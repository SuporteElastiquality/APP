import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testando API de busca simplificada...')
    
    const { searchParams } = new URL(request.url)
    const service = searchParams.get('service') || ''
    const location = searchParams.get('location') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    console.log('🔍 Parâmetros:', { service, location, category, page, limit })

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
      take: 20
    })

    console.log('✅ Profissionais encontrados:', professionals.length)

    // Filtrar por categoria se especificada
    let filteredProfessionals = professionals
    if (category.trim()) {
      filteredProfessionals = professionals.filter(prof => 
        prof.professionalProfile?.category?.toLowerCase().includes(category.toLowerCase())
      )
    }

    // Filtrar por especialidade se especificada
    if (service.trim()) {
      filteredProfessionals = filteredProfessionals.filter(prof => 
        prof.professionalProfile?.specialties?.toLowerCase().includes(service.toLowerCase())
      )
    }

    // Filtrar por localização se especificada
    if (location.trim()) {
      const locationLower = location.toLowerCase()
      filteredProfessionals = filteredProfessionals.filter(prof => {
        const profile = prof.professionalProfile
        return profile?.district?.toLowerCase().includes(locationLower) ||
               profile?.council?.toLowerCase().includes(locationLower) ||
               profile?.parish?.toLowerCase().includes(locationLower)
      })
    }

    // Ordenar por proximidade administrativa
    if (location.trim()) {
      const locationLower = location.toLowerCase()
      filteredProfessionals.sort((a, b) => {
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

    // Preparar lista de profissionais
    const professionalsList = filteredProfessionals.map(prof => ({
      id: prof.id,
      name: prof.name,
      email: prof.email?.replace(/(.{2}).*(@.*)/, '$1***$2'),
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
        categories: []
      }
    })

  } catch (error) {
    console.error('❌ Erro na API de busca simplificada:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}
