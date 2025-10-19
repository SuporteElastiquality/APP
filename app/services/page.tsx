'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, MapPin, Filter, Star, Clock, User, Euro, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface ServiceRequest {
  id: string
  title: string
  description: string
  district: string
  council: string
  parish: string
  budgetMin: number | null
  budgetMax: number | null
  status: string
  createdAt: string
  client: {
    name: string
    email: string
  }
  service: {
    name: string
    category: {
      name: string
    }
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    loadRequests()
  }, [selectedCategory, searchTerm, page])

  const loadRequests = async () => {
    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        search: searchTerm,
        page: page.toString(),
        limit: '12'
      })

      const response = await fetch(`/api/service-requests?${params}`)
      if (response.ok) {
        const data = await response.json()
        
        if (page === 1) {
          setRequests(data.requests)
        } else {
          setRequests(prev => [...prev, ...data.requests])
        }
        
        setCategories(data.categories)
        setHasMore(data.pagination.page < data.pagination.pages)
      }
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreRequests = () => {
    setPage(prev => prev + 1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    loadRequests()
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setPage(1)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Orçamento a definir'
    if (!min) return `Até €${max}`
    if (!max) return `A partir de €${min}`
    return `€${min} - €${max}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Solicitações de Serviços
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encontre oportunidades de trabalho. Clientes estão procurando profissionais certificados como você.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Buscar
            </button>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading && page === 1 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma solicitação encontrada
            </h3>
            <p className="text-gray-600">
              Não há solicitações de serviços disponíveis no momento.
            </p>
          </div>
        ) : (
          <>
            {/* Requests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {requests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {request.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {request.service.category.name}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {request.description}
                    </p>

                    {/* Budget */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Euro className="w-4 h-4 mr-1" />
                      <span>{formatBudget(request.budgetMin, request.budgetMax)}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>
                        {request.district}, {request.council}
                      </span>
                    </div>

                    {/* Client Info */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <User className="w-4 h-4 mr-1" />
                      <span>{request.client.name}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Publicado em {formatDate(request.createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/messages?request=${request.id}`}
                        className="flex-1 bg-primary-600 text-white text-center py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Enviar Proposta
                      </Link>
                      <Link
                        href={`/service-requests/${request.id}`}
                        className="flex-1 border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMoreRequests}
                  disabled={loading}
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Carregando...' : 'Carregar Mais Solicitações'}
                </button>
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        <div className="bg-primary-600 rounded-lg p-8 text-center text-white mt-12">
          <h2 className="text-2xl font-bold mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-primary-100 mb-6">
            Publique uma solicitação de serviço e receba propostas de profissionais certificados.
          </p>
          <Link
            href="/request-service"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Solicitar Serviço
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}