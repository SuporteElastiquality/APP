import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIP, checkRateLimit, logSecurityEvent } from '@/lib/security'
import { getAllCategories } from '@/lib/categories'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Iniciando busca de profissionais...')
    
    const clientIP = getClientIP(request)
    console.log('📍 IP do cliente:', clientIP)
    
    // Rate limiting para busca
    const rateLimit = checkRateLimit(clientIP, 'professional_search')
    if (!rateLimit.allowed) {
      console.log('⏰ Rate limit excedido')
      logSecurityEvent('rate_limit_exceeded', { 
        ip: clientIP, 
        endpoint: 'search_professionals',
        resetTime: rateLimit.resetTime 
      }, 'medium')
      
      return NextResponse.json(
        { 
          error: 'Muitas tentativas de busca. Tente novamente mais tarde.',
          resetTime: rateLimit.resetTime 
        },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const service = searchParams.get('service') || ''
    const location = searchParams.get('location') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    console.log('🔍 Parâmetros de busca:', { 
      service, 
      location, 
      category, 
      page, 
      limit 
    })

    // Busca básica sem filtros complexos
    const professionals = await prisma.user.findMany({
      where: {
        userType: 'PROFESSIONAL',
        professionalProfile: {
          isNot: null
        }
      },
      include: {
        professionalProfile: {
          select: {
            categories: true,
            services: true,
            workDistricts: true,
            experience: true,
            district: true,
            council: true,
            parish: true,
            rating: true,
            completedJobs: true,
            isVerified: true,
            isPremium: true
          }
        }
      },
      take: 100
    })

    console.log('✅ Profissionais encontrados:', professionals.length)

    // Separar Elastiquality dos outros profissionais
    const elastiqualityProf = professionals.find(prof => prof.email === 'elastiquality@elastiquality.pt')
    const otherProfessionals = professionals.filter(prof => prof.email !== 'elastiquality@elastiquality.pt')

    // Filtrar outros profissionais por categoria se especificada
    let filteredOtherProfessionals = otherProfessionals
    if (category.trim()) {
      filteredOtherProfessionals = otherProfessionals.filter(prof => 
        prof.professionalProfile?.categories?.some(cat => 
          cat.toLowerCase().includes(category.toLowerCase())
        )
      )
    }

    // Filtrar outros profissionais por serviço se especificado
    if (service.trim()) {
      filteredOtherProfessionals = filteredOtherProfessionals.filter(prof => 
        prof.professionalProfile?.services?.some(serv => 
          serv.toLowerCase().includes(service.toLowerCase())
        )
      )
    }

    // Filtrar outros profissionais por localização se especificada
    if (location.trim()) {
      const locationLower = location.toLowerCase()
      filteredOtherProfessionals = filteredOtherProfessionals.filter(prof => {
        const profile = prof.professionalProfile
        return profile?.district?.toLowerCase().includes(locationLower) ||
               profile?.council?.toLowerCase().includes(locationLower) ||
               profile?.parish?.toLowerCase().includes(locationLower)
      })
    }

    // Combinar Elastiquality (sempre no topo) com outros profissionais filtrados
    const filteredProfessionals = elastiqualityProf 
      ? [elastiqualityProf, ...filteredOtherProfessionals]
      : filteredOtherProfessionals

    // Ordenar profissionais
    filteredProfessionals.sort((a, b) => {
      const aProfile = a.professionalProfile
      const bProfile = b.professionalProfile
      
      if (!aProfile || !bProfile) return 0
      
      // Prioridade 1: Elastiquality sempre no topo
      const aIsElastiquality = a.email === 'elastiquality@elastiquality.pt'
      const bIsElastiquality = b.email === 'elastiquality@elastiquality.pt'
      
      if (aIsElastiquality && !bIsElastiquality) return -1
      if (!aIsElastiquality && bIsElastiquality) return 1
      
      // Prioridade 2: Profissionais verificados e premium
      const aIsVerified = aProfile.isVerified && aProfile.isPremium
      const bIsVerified = bProfile.isVerified && bProfile.isPremium
      
      if (aIsVerified && !bIsVerified) return -1
      if (!aIsVerified && bIsVerified) return 1
      
      // Prioridade 3: Melhor avaliação
      const aRating = aProfile.rating || 0
      const bRating = bProfile.rating || 0
      
      if (aRating !== bRating) return bRating - aRating
      
      // Prioridade 4: Mais trabalhos concluídos
      const aCompleted = aProfile.completedJobs || 0
      const bCompleted = bProfile.completedJobs || 0
      
      if (aCompleted !== bCompleted) return bCompleted - aCompleted
      
      // Prioridade 5: Proximidade administrativa (se localização especificada)
      if (location.trim()) {
        const locationLower = location.toLowerCase()
        
        // Mesma freguesia
        const aParish = aProfile.parish?.toLowerCase() || ''
        const bParish = bProfile.parish?.toLowerCase() || ''
        const aParishMatch = aParish.includes(locationLower) || locationLower.includes(aParish)
        const bParishMatch = bParish.includes(locationLower) || locationLower.includes(bParish)
        
        if (aParishMatch && !bParishMatch) return -1
        if (!aParishMatch && bParishMatch) return 1
        
        // Mesmo conselho
        const aCouncil = aProfile.council?.toLowerCase() || ''
        const bCouncil = bProfile.council?.toLowerCase() || ''
        const aCouncilMatch = aCouncil.includes(locationLower) || locationLower.includes(aCouncil)
        const bCouncilMatch = bCouncil.includes(locationLower) || locationLower.includes(bCouncil)
        
        if (aCouncilMatch && !bCouncilMatch) return -1
        if (!aCouncilMatch && bCouncilMatch) return 1
        
        // Mesmo distrito
        const aDistrict = aProfile.district?.toLowerCase() || ''
        const bDistrict = bProfile.district?.toLowerCase() || ''
        const aDistrictMatch = aDistrict.includes(locationLower) || locationLower.includes(aDistrict)
        const bDistrictMatch = bDistrict.includes(locationLower) || locationLower.includes(bDistrict)
        
        if (aDistrictMatch && !bDistrictMatch) return -1
        if (!aDistrictMatch && bDistrictMatch) return 1
      }
      
      return 0
    })

    // Preparar lista de profissionais
    const professionalsList = filteredProfessionals.map(prof => ({
      id: prof.id,
      name: prof.name,
      email: prof.email?.replace(/(.{2}).*(@.*)/, '$1***$2'),
      image: prof.image,
      specialties: prof.professionalProfile?.services || [],
      experience: prof.professionalProfile?.experience || '',
      categories: prof.professionalProfile?.categories || [],
      location: {
        district: prof.professionalProfile?.district || '',
        council: prof.professionalProfile?.council || '',
        parish: prof.professionalProfile?.parish || ''
      },
      rating: prof.professionalProfile?.rating || 0,
      completedJobs: prof.professionalProfile?.completedJobs || 0,
      isVerified: prof.professionalProfile?.isVerified || false,
      isPremium: prof.professionalProfile?.isPremium || false,
      isElastiquality: prof.email === 'elastiquality@elastiquality.pt'
    }))

    // Aplicar paginação
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProfessionals = professionalsList.slice(startIndex, endIndex)

    console.log('✅ Lista de profissionais preparada:', paginatedProfessionals.length)

    return NextResponse.json({
      professionals: paginatedProfessionals,
      pagination: {
        page,
        limit,
        total: professionalsList.length,
        totalPages: Math.ceil(professionalsList.length / limit),
        hasNext: endIndex < professionalsList.length,
        hasPrev: page > 1
      },
      searchParams: {
        service,
        location,
        category
      },
      filters: {
        hasAdministrativeSorting: true,
        categories: getAllCategories()
      }
    })

  } catch (error) {
    console.error('Search professionals error:', error)
    console.error('Error details:', {
      message: (error as Error).message,
      stack: (error as Error).stack,
      name: (error as Error).name
    })
    
    const { searchParams } = new URL(request.url)
    logSecurityEvent('search_error', { 
      error: (error as Error).message,
      ip: getClientIP(request),
      service: searchParams.get('service') || '',
      location: searchParams.get('location') || '',
      category: searchParams.get('category') || ''
    }, 'high')
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}
