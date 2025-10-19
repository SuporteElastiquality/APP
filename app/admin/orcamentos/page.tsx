'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  MapPin,
  Euro
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface ServiceRequest {
  id: string
  title: string
  description: string
  budgetMin: number | null
  budgetMax: number | null
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
  client: {
    id: string
    name: string
    email: string
    phone: string | null
  }
  proposals: {
    id: string
    price: number
    description: string
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
    professional: {
      id: string
      name: string
      email: string
    }
  }[]
}

export default function OrcamentosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user?.email !== 'admin@elastiquality.pt') {
      router.push('/auth/signin')
      return
    }

    loadRequests()
  }, [session, status, router])

  const loadRequests = async () => {
    try {
      const response = await fetch('/api/admin/service-requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests)
        setFilteredRequests(data.requests)
      }
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    let filtered = requests

    if (term) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(term.toLowerCase()) ||
        request.client.name.toLowerCase().includes(term.toLowerCase()) ||
        request.client.email.toLowerCase().includes(term.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter)
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'budget-high':
          return (b.budgetMax || 0) - (a.budgetMax || 0)
        case 'budget-low':
          return (a.budgetMin || 0) - (b.budgetMin || 0)
        default:
          return 0
      }
    })

    setFilteredRequests(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente'
      case 'IN_PROGRESS':
        return 'Em Progresso'
      case 'COMPLETED':
        return 'Concluído'
      case 'CANCELLED':
        return 'Cancelado'
      default:
        return status
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando orçamentos...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Orçamentos</h1>
              <p className="mt-2 text-gray-600">Gerir solicitações de serviço dos clientes</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Título, cliente, email..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  handleSearch(searchTerm)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="PENDING">Pendente</option>
                <option value="IN_PROGRESS">Em Progresso</option>
                <option value="COMPLETED">Concluído</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  handleSearch(searchTerm)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Mais Recente</option>
                <option value="oldest">Mais Antigo</option>
                <option value="budget-high">Orçamento Maior</option>
                <option value="budget-low">Orçamento Menor</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setSortBy('newest')
                  setFilteredRequests(requests)
                }}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Orçamentos */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Solicitações ({filteredRequests.length})
            </h2>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Nenhuma solicitação encontrada</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{getStatusText(request.status)}</span>
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{request.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{new Date(request.createdAt).toLocaleDateString('pt-PT')}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Euro className="h-4 w-4 mr-2" />
                          <span>
                            {request.budgetMin && request.budgetMax 
                              ? `€${request.budgetMin} - €${request.budgetMax}`
                              : request.budgetMin 
                                ? `A partir de €${request.budgetMin}`
                                : request.budgetMax
                                  ? `Até €${request.budgetMax}`
                                  : 'Orçamento não especificado'
                            }
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="font-medium">Cliente:</span>
                          <span className="ml-1">{request.client.name}</span>
                        </div>
                      </div>

                      {request.proposals.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Propostas ({request.proposals.length}):
                          </p>
                          <div className="space-y-2">
                            {request.proposals.map((proposal) => (
                              <div key={proposal.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">{proposal.professional.name}</p>
                                    <p className="text-sm text-gray-600">€{proposal.price.toFixed(2)}</p>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    proposal.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                    proposal.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {proposal.status === 'ACCEPTED' ? 'Aceite' :
                                     proposal.status === 'REJECTED' ? 'Rejeitada' : 'Pendente'}
                                  </span>
                                </div>
                                {proposal.description && (
                                  <p className="text-sm text-gray-600 mt-1">{proposal.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => router.push(`/admin/orcamentos/${request.id}`)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
