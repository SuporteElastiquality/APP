import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || session.user.email !== 'admin@elastiquality.pt') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores.' },
        { status: 403 }
      )
    }

    // Buscar todos os usuários com perfil de cliente
    const clientes = await prisma.user.findMany({
      where: {
        userType: 'CLIENT'
      },
      include: {
        clientProfile: {
          select: {
            district: true,
            council: true,
            parish: true,
            morada: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Buscar também usuários que podem ser tanto clientes quanto profissionais
    const allUsers = await prisma.user.findMany({
      include: {
        clientProfile: {
          select: {
            district: true,
            council: true,
            parish: true,
            morada: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      clientes: allUsers, // Mostrar todos os usuários para gestão completa
      total: allUsers.length,
      clientesOnly: clientes.length
    })

  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
