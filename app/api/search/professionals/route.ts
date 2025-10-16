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
              rating: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({
        where: whereClause
      })
    ])

    // Log de busca (sem dados sensíveis)
    logSecurityEvent('professional_search', { 
      service: service.substring(0, 50),
      location: location.substring(0, 50),
      resultsCount: professionals.length,
      totalCount,
      ip: clientIP 
    }, 'low')

    return NextResponse.json({
      professionals: professionals.map(prof => ({
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
        completedJobs: 0 // Campo temporário até o banco ser atualizado
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
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
