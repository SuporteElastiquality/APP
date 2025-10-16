import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIP, checkRateLimit, logSecurityEvent } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    
    // Rate limiting para busca
    const rateLimit = checkRateLimit(clientIP, 'api')
    if (!rateLimit.allowed) {
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Validar parâmetros
    if (!service.trim() && !location.trim()) {
      return NextResponse.json(
        { error: 'Serviço ou localização é obrigatório' },
        { status: 400 }
      )
    }

    // Construir query de busca
    const whereClause: any = {
      userType: 'PROFESSIONAL',
      professionalProfile: {
        isNot: null
      }
    }

    // Buscar por especialidade
    if (service.trim()) {
      whereClause.professionalProfile = {
        ...whereClause.professionalProfile,
        specialties: {
          contains: service,
          mode: 'insensitive'
        }
      }
    }

    // Buscar por localização
    if (location.trim()) {
      whereClause.professionalProfile = {
        ...whereClause.professionalProfile,
        OR: [
          { district: { contains: location, mode: 'insensitive' } },
          { council: { contains: location, mode: 'insensitive' } },
          { parish: { contains: location, mode: 'insensitive' } }
        ]
      }
    }

    // Buscar profissionais
    const [professionals, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        include: {
          professionalProfile: {
            select: {
              specialties: true,
              experience: true,
              district: true,
              council: true,
              parish: true,
              rating: true,
              isVerified: true,
              isPremium: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          {
            professionalProfile: {
              isPremium: 'desc'
            }
          },
          {
            professionalProfile: {
              isVerified: 'desc'
            }
          },
          {
            professionalProfile: {
              rating: 'desc'
            }
          },
          {
            createdAt: 'desc'
          }
        ]
      }),
      prisma.user.count({
        where: whereClause
      })
    ])

    // Buscar usuário Elastiquality separadamente para garantir que apareça sempre
    const elastiqualityUser = await prisma.user.findUnique({
      where: { email: 'elastiquality@elastiquality.pt' },
      include: {
        professionalProfile: {
          select: {
            specialties: true,
            experience: true,
            district: true,
            council: true,
            parish: true,
            rating: true,
            isVerified: true,
            isPremium: true
          }
        }
      }
    })

    // Log de busca (sem dados sensíveis)
    logSecurityEvent('professional_search', { 
      service: service.substring(0, 50),
      location: location.substring(0, 50),
      resultsCount: professionals.length,
      totalCount,
      ip: clientIP 
    }, 'low')

    // Preparar lista de profissionais
    let professionalsList = professionals.map(prof => ({
      id: prof.id,
      name: prof.name,
      email: prof.email?.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mascarar email
      image: prof.image,
      specialties: prof.professionalProfile?.specialties?.split(',').map(s => s.trim()) || [],
      experience: prof.professionalProfile?.experience || '',
      location: {
        district: prof.professionalProfile?.district || '',
        council: prof.professionalProfile?.council || '',
        parish: prof.professionalProfile?.parish || ''
      },
      rating: prof.professionalProfile?.rating || 0,
      completedJobs: 0, // Campo temporário até o banco ser atualizado
      isVerified: prof.professionalProfile?.isVerified || false,
      isPremium: prof.professionalProfile?.isPremium || false,
      isElastiquality: prof.email === 'elastiquality@elastiquality.pt'
    }))

    // Adicionar usuário Elastiquality no topo se existir e não estiver já na lista
    if (elastiqualityUser && elastiqualityUser.professionalProfile) {
      const elastiqualityInList = professionalsList.find(p => p.id === elastiqualityUser.id)
      
      if (!elastiqualityInList) {
        const elastiqualityProfile = {
          id: elastiqualityUser.id,
          name: elastiqualityUser.name,
          email: 'Elastiquality***@elastiquality.pt',
          image: elastiqualityUser.image,
          specialties: elastiqualityUser.professionalProfile.specialties?.split(',').map(s => s.trim()) || [],
          experience: elastiqualityUser.professionalProfile.experience || '',
          location: {
            district: elastiqualityUser.professionalProfile.district || '',
            council: elastiqualityUser.professionalProfile.council || '',
            parish: elastiqualityUser.professionalProfile.parish || ''
          },
          rating: elastiqualityUser.professionalProfile.rating || 5.0,
          completedJobs: 5000,
          isVerified: elastiqualityUser.professionalProfile.isVerified || true,
          isPremium: elastiqualityUser.professionalProfile.isPremium || true,
          isElastiquality: true
        }
        
        // Adicionar no topo da lista
        professionalsList = [elastiqualityProfile, ...professionalsList]
      }
    }

    return NextResponse.json({
      professionals: professionalsList,
      pagination: {
        page,
        limit,
        total: totalCount + (elastiqualityUser ? 1 : 0),
        totalPages: Math.ceil((totalCount + (elastiqualityUser ? 1 : 0)) / limit),
        hasNext: page < Math.ceil((totalCount + (elastiqualityUser ? 1 : 0)) / limit),
        hasPrev: page > 1
      },
      searchParams: {
        service,
        location
      }
    })

  } catch (error) {
    console.error('Search professionals error:', error)
    logSecurityEvent('search_error', { 
      error: (error as Error).message,
      ip: getClientIP(request) 
    }, 'high')
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
