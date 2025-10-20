'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MapPin, Euro, Calendar, User, MessageCircle, ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

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
    id: string
    name: string
    email: string
  }
  service: {
    id: string
    name: string
    category: {
      id: string
      name: string
    }
  }
}

export default function ServiceRequestDetails() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [request, setRequest] = useState<ServiceRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadServiceRequest()
    }
  }, [params.id])

  const loadServiceRequest = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/service-requests/${params.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setRequest(data)
      } else if (response.status === 404) {
        setError('Solicitação de serviço não encontrada')
      } else {
        setError('Erro ao carregar solicitação de serviço')
      }
    } catch (err) {
      console.error('Erro ao carregar solicitação:', err)
      setError('Erro ao carregar solicitação de serviço')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!request) return
    const confirmed = window.confirm('Tem certeza que deseja eliminar esta solicitação? Esta ação não pode ser desfeita.')
    if (!confirmed) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/service-requests/${request.id}`, { method: 'DELETE' })
      if (response.ok) {
        router.push('/profile/client/requests')
      } else {
        const data = await response.json().catch(() => ({}))
        alert(data.error || 'Não foi possível eliminar a solicitação.')
      }
    } catch (e) {
      alert('Erro ao eliminar a solicitação.')
    } finally {
      setDeleting(false)
    }
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (min === null && max === null) return 'Orçamento a definir'
    if (min !== null && max === null) return `A partir de €${min.toFixed(2)}`
    if (min === null && max !== null) return `Até €${max.toFixed(2)}`
    return `€${min?.toFixed(2)} - €${max?.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { text: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
      case 'IN_PROGRESS':
        return { text: 'Em Progresso', color: 'bg-blue-100 text-blue-800', icon: Clock }
      case 'COMPLETED':
        return { text: 'Concluído', color: 'bg-green-100 text-green-800', icon: CheckCircle }
      case 'CANCELED':
        return { text: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle }
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800', icon: Clock }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro</h1>
            <p className="text-gray-600 mb-6">{error || 'Solicitação não encontrada'}</p>
            <Link
              href="/services"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Serviços
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const statusInfo = getStatusInfo(request.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Serviços
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {request.title}
              </h1>
              <p className="text-lg text-gray-600">
                {request.service.category.name} • {request.service.name}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <StatusIcon className="w-5 h-5" />
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
              {session?.user?.id === request.client.id && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="ml-3 inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {deleting ? 'Eliminando...' : 'Eliminar Solicitação'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descrição</h2>
              <p className="text-gray-700 leading-relaxed">
                {request.description}
              </p>
            </div>

            {/* Client Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações do Cliente</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{request.client.name?.split(' ')[0] || 'Cliente'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Orçamento</h3>
              <div className="flex items-center">
                <Euro className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-700 font-medium">
                  {formatBudget(request.budgetMin, request.budgetMax)}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Localização</h3>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div className="text-gray-700">
                  <p>{request.parish}</p>
                  <p>{request.council}</p>
                  <p>{request.district}</p>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data de Publicação</h3>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-700">
                  {formatDate(request.createdAt)}
                </span>
              </div>
            </div>

            {/* Actions */}
            {session?.user?.userType === 'PROFESSIONAL' && request.status === 'PENDING' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
                <div className="space-y-3">
                  <Link
                    href={`/proposals/create?requestId=${request.id}&clientId=${request.client.id}&clientName=${request.client.name?.split(' ')[0] || 'Cliente'}&profession=${request.service.name}`}
                    className="w-full bg-primary-600 text-white text-center py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors block"
                  >
                    Enviar Proposta
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/chat/rooms', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            participantId: request.client.id,
                            type: 'DIRECT'
                          })
                        })
                        if (response.ok) {
                          const data = await response.json()
                          router.push(`/messages?room=${data.id}`)
                        } else {
                          router.push('/messages')
                        }
                      } catch (error) {
                        console.error('Error creating chat:', error)
                        router.push('/messages')
                      }
                    }}
                    className="w-full border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors block"
                  >
                    Contactar Cliente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
