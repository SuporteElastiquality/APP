import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Calcular saldo total de quality do usuário
    const balance = await prisma.coin.aggregate({
      where: {
        userId: session.user.id
      },
      _sum: {
        amount: true
      }
    })

    const totalBalance = balance._sum.amount || 0

    // Buscar transações recentes
    const recentTransactions = await prisma.coin.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        source: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      balance: totalBalance,
      recentTransactions
    })

  } catch (error) {
    console.error('Erro ao buscar saldo de quality:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
