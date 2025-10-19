'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface FinancialData {
  totalRevenue: number
  netRevenue: number
  totalStripeFees: number
  totalOrders: number
  averageOrderValue: number
  monthlyRevenue: Array<{
    month: string
    revenue: number
    orders: number
  }>
  revenueByCategory: Array<{
    category: string
    revenue: number
    percentage: number
  }>
  recentOrders: Array<{
    id: string
    total: number
    status: string
    createdAt: string
    user: {
      name: string
      email: string
    }
  }>
}

export default function FinanceiroPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('all')
  const [chartType, setChartType] = useState('bar')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user?.email !== 'admin@elastiquality.pt') {
      router.push('/auth/signin')
      return
    }

    loadFinancialData()
  }, [session, status, router, dateRange])

  const loadFinancialData = async () => {
    try {
      const response = await fetch(`/api/admin/financial?range=${dateRange}`)
      if (response.ok) {
        const data = await response.json()
        setFinancialData(data)
      }
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!financialData) return

    const csvData = [
      ['Mês', 'Receita', 'Pedidos'],
      ...financialData.monthlyRevenue.map(item => [
        item.month,
        item.revenue.toFixed(2),
        item.orders.toString()
      ])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio_financeiro_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando relatório financeiro...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Relatório Financeiro</h1>
              <p className="mt-2 text-gray-600">Análise financeira da plataforma</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </button>
              <button
                onClick={() => router.push('/admin')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os Tempos</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
                <option value="365">Último ano</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Gráfico</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="bar">Barras</option>
                <option value="line">Linha</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadFinancialData}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Atualizar Dados
              </button>
            </div>
          </div>
        </div>

        {financialData && (
          <>
            {/* Resumo Financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Receita Líquida</p>
                    <p className="text-2xl font-bold text-gray-900">€{financialData.netRevenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Após taxas Stripe</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                    <p className="text-2xl font-bold text-gray-900">{financialData.totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                    <p className="text-2xl font-bold text-gray-900">€{financialData.averageOrderValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taxas Stripe</p>
                    <p className="text-2xl font-bold text-gray-900">€{financialData.totalStripeFees.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">2.9% + €0.25</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalhamento da Receita */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhamento da Receita</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Receita Bruta</p>
                  <p className="text-2xl font-bold text-gray-900">€{financialData.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Taxas Stripe</p>
                  <p className="text-2xl font-bold text-red-600">-€{financialData.totalStripeFees.toFixed(2)}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Receita Líquida</p>
                  <p className="text-2xl font-bold text-green-600">€{financialData.netRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Gráfico de Receita Mensal */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Receita Mensal</h2>
              <div className="h-64 flex items-end space-x-2">
                {financialData.monthlyRevenue.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                      style={{ 
                        height: `${(item.revenue / Math.max(...financialData.monthlyRevenue.map(m => m.revenue))) * 200}px` 
                      }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-600 text-center">
                      <div>{item.month}</div>
                      <div className="font-medium">€{item.revenue.toFixed(0)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Receita por Categoria */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Receita por Categoria</h2>
                <div className="space-y-3">
                  {financialData.revenueByCategory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">€{item.revenue.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pedidos Recentes */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pedidos Recentes</h2>
                <div className="space-y-3">
                  {financialData.recentOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.user.name}</p>
                        <p className="text-xs text-gray-500">{order.user.email}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">€{order.total.toFixed(2)}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'PAID' ? 'Pago' :
                           order.status === 'PENDING' ? 'Pendente' : 'Cancelado'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
