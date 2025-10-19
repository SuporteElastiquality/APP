'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface DashboardStats {
  totalUsers: number
  totalProfessionals: number
  totalClients: number
  totalServiceRequests: number
  totalOrders: number
  totalRevenue: number
  pendingRequests: number
  completedRequests: number
}

interface RecentActivity {
  id: string
  type: 'user_registration' | 'service_request' | 'order' | 'professional_approval'
  description: string
  timestamp: string
  status: 'pending' | 'completed' | 'cancelled'
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user?.email !== 'admin@elastiquality.pt') {
      router.push('/auth/signin')
      return
    }

    loadDashboardData()
  }, [session, status, router])

  const loadDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/activity')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json()
        setRecentActivity(activityData)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.email !== 'admin@elastiquality.pt') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="mt-2 text-gray-600">Visão geral da plataforma Elastiquality</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Solicitações de Serviço</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalServiceRequests}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">€{stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pedidos da Loja</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Orçamentos */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Gestão de Orçamentos</h2>
              <p className="text-sm text-gray-600">Gerir solicitações de serviço dos clientes</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats?.pendingRequests || 0}</div>
                  <div className="text-sm text-gray-600">Pendentes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats?.completedRequests || 0}</div>
                  <div className="text-sm text-gray-600">Concluídos</div>
                </div>
              </div>
              <button
                onClick={() => router.push('/admin/orcamentos')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Todos os Orçamentos
              </button>
            </div>
          </div>

          {/* Profissionais */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Gestão de Profissionais</h2>
              <p className="text-sm text-gray-600">Gerir profissionais cadastrados</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats?.totalProfessionals || 0}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats?.totalClients || 0}</div>
                  <div className="text-sm text-gray-600">Clientes</div>
                </div>
              </div>
              <button
                onClick={() => router.push('/admin/profissionais')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Ver Todos os Profissionais
              </button>
            </div>
          </div>
        </div>

        {/* Relatório Financeiro */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Relatório Financeiro</h2>
            <p className="text-sm text-gray-600">Visão geral das finanças da plataforma</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">€{stats?.totalRevenue.toFixed(2) || '0.00'}</div>
                <div className="text-sm text-gray-600">Receita Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats?.totalOrders || 0}</div>
                <div className="text-sm text-gray-600">Pedidos Processados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">€{((stats?.totalRevenue || 0) / (stats?.totalOrders || 1)).toFixed(2)}</div>
                <div className="text-sm text-gray-600">Ticket Médio</div>
              </div>
            </div>
            <button
              onClick={() => router.push('/admin/financeiro')}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Ver Relatório Financeiro Completo
            </button>
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
            <p className="text-sm text-gray-600">Últimas atividades na plataforma</p>
          </div>
          <div className="p-6">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-100' :
                      activity.status === 'pending' ? 'bg-yellow-100' :
                      'bg-red-100'
                    }`}>
                      {activity.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : activity.status === 'pending' ? (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString('pt-PT')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
