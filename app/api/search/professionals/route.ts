import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIP, checkRateLimit, logSecurityEvent } from '@/lib/security'
import { filterProfessionalsByDistance, getCoordinatesFromLocation } from '@/lib/geolocation'
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
    const clientLatitude = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null
    const clientLongitude = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    console.log('🔍 Parâmetros de busca:', { 
      service, 
      location, 
      category, 
      clientLatitude, 
      clientLongitude, 
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
            latitude: true,
            longitude: true,
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
      take: 50 // Aumentar limite para filtrar por distância depois
    })

    console.log('✅ Profissionais encontrados:', professionals.length)

    // Filtrar por proximidade geográfica se coordenadas do cliente estiverem disponíveis
    let filteredProfessionals = professionals
    
    if (clientLatitude && clientLongitude) {
      console.log('🌍 Filtrando por proximidade geográfica...')
      filteredProfessionals = filterProfessionalsByDistance(
        professionals,
        clientLatitude,
        clientLongitude,
        15 // 15km de raio
      )
      console.log(`📍 Profissionais dentro de 15km: ${filteredProfessionals.length}`)
    }

    // Preparar lista de profissionais
    const professionalsList = filteredProfessionals.map(prof => ({
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
      coordinates: {
        latitude: prof.professionalProfile?.latitude,
        longitude: prof.professionalProfile?.longitude
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
        hasGeographicFilter: !!(clientLatitude && clientLongitude),
        radiusKm: 15,
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
      location: searchParams.get('location') || ''
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
