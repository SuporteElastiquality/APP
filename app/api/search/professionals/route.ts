import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIP, checkRateLimit, logSecurityEvent } from '@/lib/security'

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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    console.log('🔍 Parâmetros de busca:', { service, location, page, limit })

    // Validar parâmetros
    if (!service.trim() && !location.trim()) {
      console.log('❌ Parâmetros inválidos')
      return NextResponse.json(
        { error: 'Serviço ou localização é obrigatório' },
        { status: 400 }
      )
    }

    // Query simplificada para teste
    console.log('🔍 Executando query no banco de dados...')
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
            rating: true,
            completedJobs: true,
            isVerified: true,
            isPremium: true
          }
        }
      },
      take: 10 // Limitar para teste
    })

    console.log('✅ Profissionais encontrados:', professionals.length)

    // Preparar lista de profissionais simplificada
    const professionalsList = professionals.map(prof => ({
      id: prof.id,
      name: prof.name,
      email: prof.email?.replace(/(.{2}).*(@.*)/, '$1***$2'),
      image: prof.image,
      specialties: prof.professionalProfile?.specialties?.split(',').map(s => s.trim()) || [],
      experience: prof.professionalProfile?.experience || '',
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

    console.log('✅ Lista de profissionais preparada:', professionalsList.length)

    return NextResponse.json({
      professionals: professionalsList,
      pagination: {
        page: 1,
        limit: 10,
        total: professionalsList.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      searchParams: {
        service,
        location
      }
    })

  } catch (error) {
    console.error('Search professionals error:', error)
    console.error('Error details:', {
      message: (error as Error).message,
      stack: (error as Error).stack,
      name: (error as Error).name
    })
    
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
