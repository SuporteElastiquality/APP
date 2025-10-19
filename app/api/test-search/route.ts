import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testando API de busca...')
    
    const { searchParams } = new URL(request.url)
    const service = searchParams.get('service') || ''
    const location = searchParams.get('location') || ''
    const category = searchParams.get('category') || ''
    
    console.log('🔍 Parâmetros:', { service, location, category })
    
    // Busca simples sem filtros complexos
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
      take: 10
    })
    
    console.log('✅ Profissionais encontrados:', professionals.length)
    
    const professionalsList = professionals.map(prof => ({
      id: prof.id,
      name: prof.name,
      email: prof.email?.replace(/(.{2}).*(@.*)/, '$1***$2'),
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
      isPremium: prof.professionalProfile?.isPremium || false
    }))
    
    return NextResponse.json({
      professionals: professionalsList,
      total: professionalsList.length,
      message: 'Teste de busca funcionando'
    })
    
  } catch (error) {
    console.error('❌ Erro na API de teste:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}
