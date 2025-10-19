import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    if (session.user.userType !== 'PROFESSIONAL') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const userId = session.user.id

    // Buscar transações de pagamento (compras de quality)
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Buscar movimentações de quality
    const qualityTransactions = await prisma.coin.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calcular totais
    const totalSpent = transactions
      .filter(t => t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalQualityEarned = qualityTransactions
      .filter(t => t.type === 'CREDIT')
      .reduce((sum, t) => sum + t.amount, 0)

    const currentBalance = qualityTransactions
      .reduce((sum, t) => {
        return sum + (t.type === 'CREDIT' ? t.amount : -t.amount)
      }, 0)

    return NextResponse.json({
      transactions: transactions.map(t => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        status: t.status,
        stripePaymentIntentId: t.stripePaymentIntentId,
        stripeChargeId: t.stripeChargeId,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString()
      })),
      qualityTransactions: qualityTransactions.map(t => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        description: t.description,
        source: t.source,
        createdAt: t.createdAt.toISOString()
      })),
      totalSpent,
      totalQualityEarned,
      currentBalance
    })
  } catch (error) {
    console.error('Erro ao buscar histórico de pagamentos:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
