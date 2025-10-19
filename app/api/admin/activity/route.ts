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
    // Buscar atividades recentes
    const [recentUsers, recentRequests, recentOrders] = await Promise.all([
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          userType: true,
          createdAt: true
        }
      }),
      prisma.serviceRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          client: {
            select: { name: true }
          }
        }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
          user: {
            select: { name: true }
          }
        }
      })
    ])

    // Combinar e formatar atividades
    const activities = [
      ...recentUsers.map(user => ({
        id: `user_${user.id}`,
        type: 'user_registration' as const,
        description: `Novo ${user.userType === 'PROFESSIONAL' ? 'profissional' : 'cliente'} registado: ${user.name}`,
        timestamp: user.createdAt.toISOString(),
        status: 'completed' as const
      })),
      ...recentRequests.map(request => ({
        id: `request_${request.id}`,
        type: 'service_request' as const,
        description: `Nova solicitação: ${request.title} (${request.client.name})`,
        timestamp: request.createdAt.toISOString(),
        status: request.status === 'COMPLETED' ? 'completed' : 
                request.status === 'PENDING' ? 'pending' : 'cancelled'
      })),
      ...recentOrders.map(order => ({
        id: `order_${order.id}`,
        type: 'order' as const,
        description: `Novo pedido: €${order.total.toFixed(2)} (${order.user.name})`,
        timestamp: order.createdAt.toISOString(),
        status: order.status === 'PAID' ? 'completed' : 'pending'
      }))
    ]

    // Ordenar por timestamp e pegar os 10 mais recentes
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    return NextResponse.json(sortedActivities)
  } catch (error) {
    console.error('Erro ao buscar atividades:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
