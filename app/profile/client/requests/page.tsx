'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import { Calendar, MapPin, Euro, MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react'

interface ServiceRequest {
  id: string
  title: string
  description: string
  status: string
  budgetMin?: number
  budgetMax?: number
  district: string
  council: string
  parish: string
  address?: string
  createdAt: string
  service: {
    id: string
    name: string
    category: {
      name: string
    }
  }
  proposals?: Array<{
    id: string
    price: number
    description: string
    estimatedTime: string
    status: string
    professional: {
      id: string
      name: string
      professionalProfile: {
        rating: number
        totalReviews: number
      }
    }
  }>
}

export default function ClientRequestsPage() {
  const { data: session, status } = useSession()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      redirect('/auth/signin?callbackUrl=/profile/client/requests')
    }
  }, [session, status])

  useEffect(() => {
    if (session?.user?.id) {
      loadRequests()
    }
  }, [session, filter])

  const loadRequests = async () => {
    try {
      const response = await fetch(`/api/service-requests?status=${filter}`)
      if (response.ok) {
        const data = await response.json()
        setRequests(data.serviceRequests)
      }
    } catch (error) {
      console.error('Error loading requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800'
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Aguardando propostas'
      case 'ACCEPTED':
        return 'Proposta aceita'
      case 'IN_PROGRESS':
        return 'Em andamento'
      case 'COMPLETED':
        return 'Concluído'
      case 'CANCELLED':
        return 'Cancelado'
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />
      case 'ACCEPTED':
        return <CheckCircle className="w-4 h-4" />
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Minhas Solicitações</h1>
                <p className="text-gray-600 mt-2">Gerencie suas solicitações de serviço</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link href="/request-service">
                  <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                    Nova Solicitação
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="mb-6">
            <div className="flex space-x-2">
              {['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {status === 'ALL' ? 'Todas' : getStatusText(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Solicitações */}
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma solicitação encontrada
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'ALL' 
                    ? 'Você ainda não criou nenhuma solicitação de serviço.'
                    : `Nenhuma solicitação com status "${getStatusText(filter)}" encontrada.`
                  }
                </p>
                <Link href="/request-service">
                  <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                    Criar Primeira Solicitação
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {requests.map((request) => (
                <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {request.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(request.createdAt).toLocaleDateString('pt-PT')}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{request.parish}, {request.council}, {request.district}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {request.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                          {request.service.category.name}
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                          {request.service.name}
                        </span>
                        {request.budgetMin && request.budgetMax && (
                          <span className="flex items-center space-x-1">
                            <Euro className="w-4 h-4" />
                            <span>{request.budgetMin}€ - {request.budgetMax}€</span>
                          </span>
                        )}
                        <span className="text-primary-600 font-medium">
                          {request.proposals?.length || 0} proposta{(request.proposals?.length || 0) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <div className="flex space-x-2">
                        <Link href={`/profile/client/requests/${request.id}`}>
                          <Button variant="outline" className="text-sm">
                            Ver Detalhes
                          </Button>
                        </Link>
                        {(request.proposals?.length || 0) > 0 && (
                          <Link href={`/messages?request=${request.id}`}>
                            <Button className="bg-primary-600 hover:bg-primary-700 text-white text-sm">
                              Ver Propostas
                            </Button>
                          </Link>
                        )}
                      </div>
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
