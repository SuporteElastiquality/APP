'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Clock, MapPin, Euro, Calendar, User, CheckCircle, XCircle } from 'lucide-react'

interface ServiceRequest {
  id: string
  title: string
  description: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  budget: number
  location: string
  createdAt: string
  professional?: {
    name: string
    rating: number
  }
}

export default function RequestsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Simular carregamento de solicitações
    loadRequests()
  }, [session, status, router])

  const loadRequests = async () => {
    try {
      // Simular dados de solicitações
      const mockRequests: ServiceRequest[] = [
        {
          id: '1',
          title: 'Reparação de Canalização',
          description: 'Fuga de água na cozinha, preciso de reparação urgente',
          status: 'COMPLETED',
          budget: 150,
          location: 'Lisboa, Campolide',
          createdAt: '2024-10-01',
          professional: {
            name: 'João Silva',
            rating: 4.8
          }
        },
        {
          id: '2',
          title: 'Instalação Elétrica',
          description: 'Instalar nova tomada na sala de estar',
          status: 'IN_PROGRESS',
          budget: 80,
          location: 'Lisboa, Belém',
          createdAt: '2024-10-10',
          professional: {
            name: 'Maria Santos',
            rating: 4.9
          }
        },
        {
          id: '3',
          title: 'Pintura de Parede',
          description: 'Pintar parede da sala com tinta branca',
          status: 'PENDING',
          budget: 200,
          location: 'Porto, Cedofeita',
          createdAt: '2024-10-15'
        }
      ]
      
      setRequests(mockRequests)
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100'
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100'
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100'
      case 'CANCELLED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Concluído'
      case 'IN_PROGRESS':
        return 'Em Andamento'
      case 'PENDING':
        return 'Pendente'
      case 'CANCELLED':
        return 'Cancelado'
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Minhas Solicitações
            </h1>
            <p className="text-gray-600">
              Gerencie seus pedidos de serviços
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'PENDING').length}
                  </p>
                  <p className="text-sm text-gray-600">Pendentes</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'IN_PROGRESS').length}
                  </p>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'COMPLETED').length}
                  </p>
                  <p className="text-sm text-gray-600">Concluídos</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Euro className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    €{requests.reduce((sum, r) => sum + r.budget, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Gasto</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Lista de Solicitações */}
          <div className="space-y-6">
            {requests.length === 0 ? (
              <Card className="p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma solicitação encontrada
                </h3>
                <p className="text-gray-600 mb-4">
                  Você ainda não fez nenhuma solicitação de serviço.
                </p>
                <Button onClick={() => router.push('/services')}>
                  Explorar Serviços
                </Button>
              </Card>
            ) : (
              requests.map((request) => (
                <Card key={request.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {request.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{request.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span>{getStatusText(request.status)}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Euro className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">€{request.budget}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{request.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {new Date(request.createdAt).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                    {request.professional && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{request.professional.name}</span>
                        <span className="text-yellow-500">★ {request.professional.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    {request.status === 'PENDING' && (
                      <Button variant="outline" size="sm">
                        Cancelar
                      </Button>
                    )}
                    {request.status === 'COMPLETED' && (
                      <Button size="sm">
                        Avaliar
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
