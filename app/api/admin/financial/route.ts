import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.email !== 'admin@elastiquality.pt') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || 'all'

    // Calcular datas baseado no range
    let startDate: Date | undefined
    const endDate = new Date()

    switch (range) {
      case '30':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 90)
        break
      case '365':
        startDate = new Date()
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate = undefined
    }

    // Buscar transações completadas
    const whereClause = {
      status: 'COMPLETED',
      ...(startDate && {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      })
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calcular métricas financeiras
    const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0)
    const totalOrders = transactions.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calcular taxa do Stripe (2.9% + €0.25 por transação)
    const stripeFeeRate = 0.029
    const stripeFixedFee = 0.25
    const totalStripeFees = transactions.reduce((sum, tx) => {
      return sum + (tx.amount * stripeFeeRate + stripeFixedFee)
    }, 0)
    const netRevenue = totalRevenue - totalStripeFees

    // Agrupar receita por mês
    const monthlyRevenueMap = new Map<string, { revenue: number, orders: number }>()
    
    transactions.forEach(tx => {
      const month = tx.createdAt.toISOString().substring(0, 7) // YYYY-MM
      const monthName = tx.createdAt.toLocaleDateString('pt-PT', { 
        year: 'numeric', 
        month: 'long' 
      })
      
      if (!monthlyRevenueMap.has(month)) {
        monthlyRevenueMap.set(month, { revenue: 0, orders: 0 })
      }
      
      const current = monthlyRevenueMap.get(month)!
      current.revenue += tx.amount
      current.orders += 1
    })

    const monthlyRevenue = Array.from(monthlyRevenueMap.entries())
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('pt-PT', { 
          year: 'numeric', 
          month: 'long' 
        }),
        revenue: data.revenue,
        orders: data.orders
      }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Receita por categoria (assumindo que todas são "Quality")
    const revenueByCategory = [
      {
        category: 'Quality (Moedas)',
        revenue: totalRevenue,
        percentage: 100
      }
    ]

    // Pedidos recentes
    const recentOrders = transactions.slice(0, 10).map(tx => ({
      id: tx.id,
      total: tx.amount,
      status: tx.status === 'COMPLETED' ? 'PAID' : 'PENDING',
      createdAt: tx.createdAt.toISOString(),
      user: tx.user
    }))

    const financialData = {
      totalRevenue: totalRevenue,
      netRevenue: netRevenue, // Receita líquida após taxas do Stripe
      totalStripeFees: totalStripeFees,
      totalOrders: totalOrders,
      averageOrderValue: averageOrderValue,
      monthlyRevenue: monthlyRevenue,
      revenueByCategory: revenueByCategory,
      recentOrders: recentOrders
    }

    return NextResponse.json(financialData)

  } catch (error) {
    console.error('Erro ao buscar dados financeiros:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}