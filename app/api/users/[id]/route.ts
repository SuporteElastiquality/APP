import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const userId = params.id

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        clientProfile: true,
        professionalProfile: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Retornar dados públicos (sem informações sensíveis)
    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      userType: user.userType,
      createdAt: user.createdAt,
      clientProfile: user.clientProfile ? {
        district: user.clientProfile.district,
        council: user.clientProfile.council,
        parish: user.clientProfile.parish
      } : null,
      professionalProfile: user.professionalProfile ? {
        specialties: user.professionalProfile.specialties,
        experience: user.professionalProfile.experience,
        rating: user.professionalProfile.rating,
        completedJobs: user.professionalProfile.completedJobs,
        isVerified: user.professionalProfile.isVerified,
        isPremium: user.professionalProfile.isPremium
      } : null
    }

    return NextResponse.json(publicUser)

  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
