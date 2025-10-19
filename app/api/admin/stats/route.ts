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
    // Contar usuários por tipo
    const [totalUsers, totalProfessionals, totalClients] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { userType: 'PROFESSIONAL' } }),
      prisma.user.count({ where: { userType: 'CLIENT' } })
    ])

    // Contar solicitações de serviço
    const [totalServiceRequests, pendingRequests, completedRequests] = await Promise.all([
      prisma.serviceRequest.count(),
      prisma.serviceRequest.count({ where: { status: 'PENDING' } }),
      prisma.serviceRequest.count({ where: { status: 'COMPLETED' } })
    ])

    // Contar pedidos da loja e receita
    const [totalOrders, orders] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        where: { status: 'PAID' },
        select: { total: true }
      })
    ])

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    return NextResponse.json({
      totalUsers,
      totalProfessionals,
      totalClients,
      totalServiceRequests,
      pendingRequests,
      completedRequests,
      totalOrders,
      totalRevenue
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
