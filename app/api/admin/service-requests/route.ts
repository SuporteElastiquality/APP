import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.email !== 'admin@elastiquality.pt') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  }

  try {
    const requests = await prisma.serviceRequest.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        proposals: {
          include: {
            professional: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
