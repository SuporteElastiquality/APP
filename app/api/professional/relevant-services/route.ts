import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.userType !== 'PROFESSIONAL') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar perfil profissional
    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: {
        userId: session.user.id
      },
      select: {
        categories: true,
        workDistricts: true
      }
    })

    if (!professionalProfile) {
      return NextResponse.json({ error: 'Perfil profissional não encontrado' }, { status: 404 })
    }

    // Buscar categorias e serviços relevantes
    const relevantCategories = await prisma.category.findMany({
      where: {
        id: {
          in: professionalProfile.categories || []
        }
      },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true
          }
        }
      }
    })

    // Buscar distritos de trabalho
    const workDistricts = professionalProfile.workDistricts || []

    return NextResponse.json({
      categories: relevantCategories,
      workDistricts: workDistricts
    })

  } catch (error) {
    console.error('Erro ao buscar serviços relevantes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
