import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIP, checkRateLimit, logSecurityEvent } from '@/lib/security'
import { getAllCategories, getCategoryById } from '@/lib/categories'

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

    // Validar parâmetros
    if (!service.trim() && !location.trim() && !category.trim()) {
      console.log('❌ Parâmetros inválidos')
      return NextResponse.json(
        { error: 'Serviço, localização ou categoria é obrigatório' },
        { status: 400 }
      )
    }

    // Construir query de busca com filtros
    const whereClause: any = {
      userType: 'PROFESSIONAL',
      professionalProfile: {
        isNot: null,
        isActive: true // Apenas profissionais ativos
      }
    }

    // Filtro por categoria
    if (category.trim()) {
      whereClause.professionalProfile.category = {
        contains: category,
        mode: 'insensitive'
      }
    }

    // Filtro por especialidade/serviço
    if (service.trim()) {
      whereClause.professionalProfile.specialties = {
        contains: service,
        mode: 'insensitive'
      }
    }

    // Filtro por localização (distrito, conselho, freguesia)
    if (location.trim()) {
      whereClause.professionalProfile.OR = [
        { district: { contains: location, mode: 'insensitive' } },
        { council: { contains: location, mode: 'insensitive' } },
        { parish: { contains: location, mode: 'insensitive' } }
      ]
    }

    console.log('🔍 Executando query no banco de dados...')
    const professionals = await prisma.user.findMany({
      where: whereClause,
      include: {
        professionalProfile: {
          select: {
            specialties: true,
            experience: true,
            district: true,
            council: true,
            parish: true,
            category: true,
            rating: true,
            completedJobs: true,
            isVerified: true,
            isPremium: true
          }
        }
      },
      orderBy: [
        { professionalProfile: { isPremium: 'desc' } },
        { professionalProfile: { isVerified: 'desc' } },
        { professionalProfile: { rating: 'desc' } },
        { createdAt: 'desc' }
      ],
      take: 100 // Aumentar limite para ordenação administrativa
    })

    console.log('✅ Profissionais encontrados:', professionals.length)

    // Função para ordenar por proximidade administrativa
    const sortByAdministrativeProximity = (profs: typeof professionals, searchLocation: string) => {
      if (!searchLocation.trim()) return profs
      
      const locationLower = searchLocation.toLowerCase()
      
      return profs.sort((a, b) => {
        const aProfile = a.professionalProfile
        const bProfile = b.professionalProfile
        
        if (!aProfile || !bProfile) return 0
        
        // Prioridade 1: Mesma freguesia
        const aParish = aProfile.parish?.toLowerCase() || ''
        const bParish = bProfile.parish?.toLowerCase() || ''
        const aParishMatch = aParish.includes(locationLower) || locationLower.includes(aParish)
        const bParishMatch = bParish.includes(locationLower) || locationLower.includes(bParish)
        
        if (aParishMatch && !bParishMatch) return -1
        if (!aParishMatch && bParishMatch) return 1
        
        // Prioridade 2: Mesmo conselho
        const aCouncil = aProfile.council?.toLowerCase() || ''
        const bCouncil = bProfile.council?.toLowerCase() || ''
        const aCouncilMatch = aCouncil.includes(locationLower) || locationLower.includes(aCouncil)
        const bCouncilMatch = bCouncil.includes(locationLower) || locationLower.includes(bCouncil)
        
        if (aCouncilMatch && !bCouncilMatch) return -1
        if (!aCouncilMatch && bCouncilMatch) return 1
        
        // Prioridade 3: Mesmo distrito
        const aDistrict = aProfile.district?.toLowerCase() || ''
        const bDistrict = bProfile.district?.toLowerCase() || ''
        const aDistrictMatch = aDistrict.includes(locationLower) || locationLower.includes(aDistrict)
        const bDistrictMatch = bDistrict.includes(locationLower) || locationLower.includes(bDistrict)
        
        if (aDistrictMatch && !bDistrictMatch) return -1
        if (!aDistrictMatch && bDistrictMatch) return 1
        
        return 0
      })
    }

    // Ordenar por proximidade administrativa
    const sortedProfessionals = sortByAdministrativeProximity(professionals, location)
    console.log('📍 Profissionais ordenados por proximidade administrativa')

    // Preparar lista de profissionais
    const professionalsList = sortedProfessionals.map(prof => ({
      id: prof.id,
      name: prof.name,
      email: prof.email?.replace(/(.{2}).*(@.*)/, '$1***$2'),
      image: prof.image,
      specialties: prof.professionalProfile?.specialties?.split(',').map(s => s.trim()) || [],
      experience: prof.professionalProfile?.experience || '',
      category: prof.professionalProfile?.category || '',
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
