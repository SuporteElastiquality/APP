import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.email !== 'admin@elastiquality.pt') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || 'all'

    // Calcular data de início baseada no range
    let startDate = new Date()
    switch (range) {
      case '30':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90':
        startDate.setDate(startDate.getDate() - 90)
        break
      case '365':
        startDate.setDate(startDate.getDate() - 365)
        break
      default:
        startDate = new Date('2020-01-01') // Data muito antiga para pegar tudo
    }

    // Buscar pedidos pagos
    const orders = await prisma.order.findMany({
      where: {
        status: 'PAID',
        createdAt: {
          gte: startDate
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                category: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calcular estatísticas básicas
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Agrupar por mês
    const monthlyData = new Map<string, { revenue: number; orders: number }>()
    orders.forEach(order => {
      const month = order.createdAt.toISOString().substring(0, 7) // YYYY-MM
      const existing = monthlyData.get(month) || { revenue: 0, orders: 0 }
      monthlyData.set(month, {
        revenue: existing.revenue + order.total,
        orders: existing.orders + 1
      })
    })

    const monthlyRevenue = Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' }),
        revenue: data.revenue,
        orders: data.orders
      }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Agrupar por categoria
    const categoryData = new Map<string, number>()
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.product.category || 'Outros'
        const existing = categoryData.get(category) || 0
        categoryData.set(category, existing + (item.price * item.quantity))
      })
    })

    const totalCategoryRevenue = Array.from(categoryData.values()).reduce((sum, revenue) => sum + revenue, 0)
    const revenueByCategory = Array.from(categoryData.entries())
      .map(([category, revenue]) => ({
        category,
        revenue,
        percentage: totalCategoryRevenue > 0 ? (revenue / totalCategoryRevenue) * 100 : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)

    // Pedidos recentes
    const recentOrders = orders.slice(0, 10).map(order => ({
      id: order.id,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      user: order.user
    }))

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      monthlyRevenue,
      revenueByCategory,
      recentOrders
    })
  } catch (error) {
    console.error('Erro ao buscar dados financeiros:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
