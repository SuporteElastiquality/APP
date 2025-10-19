import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.email !== 'admin@elastiquality.pt') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  }

  try {
    const professionals = await prisma.user.findMany({
      where: { userType: 'PROFESSIONAL' },
      include: {
        professionalProfile: {
          include: {
            location: true
          }
        },
        _count: {
          select: {
            serviceRequests: true,
            proposals: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ professionals })
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
