import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    if (session.user.userType !== 'PROFESSIONAL') {
      return NextResponse.json(
        { error: 'Apenas profissionais podem ter moedas' },
        { status: 403 }
      )
    }

    // Calcular saldo de moedas
    const coins = await prisma.coin.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    const balance = coins.reduce((total, coin) => {
      return coin.type === 'CREDIT' ? total + coin.amount : total - coin.amount
    }, 0)

    return NextResponse.json({
      balance,
      transactions: coins.slice(0, 10) // Últimas 10 transações
    })

  } catch (error) {
    console.error('Erro ao buscar saldo de moedas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
