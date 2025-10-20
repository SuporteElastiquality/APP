'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { Euro, Clock, FileText, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface ServiceRequest {
  id: string
  title: string
  description: string
  budgetMin: number | null
  budgetMax: number | null
  client: {
    id: string
    name: string
  }
  service: {
    name: string
    category: {
      name: string
    }
  }
}

export default function CreateProposalPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [request, setRequest] = useState<ServiceRequest | null>(null)
  const [price, setPrice] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const requestId = searchParams.get('requestId')
  const clientName = searchParams.get('clientName')
  const profession = searchParams.get('profession')

  useEffect(() => {
    if (requestId) {
      loadServiceRequest()
    }
  }, [requestId])

  const loadServiceRequest = async () => {
    try {
      const response = await fetch(`/api/service-requests/${requestId}`)
      if (response.ok) {
        const data = await response.json()
        setRequest(data)
      } else {
        router.push('/services')
      }
    } catch (error) {
      console.error('Error loading service request:', error)
      router.push('/services')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      alert('Você precisa estar logado para enviar uma proposta')
      return
    }

    if (!price || !estimatedTime || !description) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/service-proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: requestId,
          price: parseFloat(price),
          estimatedTime,
          description
        }),
      })

      if (response.ok) {
        alert('Proposta enviada com sucesso! O cliente será notificado.')
        router.push('/services')
      } else {
        const error = await response.json()
        console.error('API Error:', error)
        alert(`Erro ao enviar proposta: ${error.error || error.message || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Error creating proposal:', error)
      alert('Erro ao enviar proposta. Tente novamente.')
    } finally {
      setIsSubmitting(false)
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

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Solicitação não encontrada</h1>
            <p className="text-gray-600 mb-6">A solicitação que você está tentando acessar não existe ou foi removida.</p>
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
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Enviar Proposta
            </h1>
            <p className="text-gray-600 mb-4">
              Envie sua proposta para <strong>{clientName}</strong>
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{request.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {request.service.category.name} • {request.service.name}
              </p>
              <p className="text-sm text-gray-700">{request.description}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Price */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Euro className="w-4 h-4 inline mr-1" />
                Valor da Proposta (€) *
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: 150.00"
                required
                className="w-full"
              />
              {request.budgetMin && request.budgetMax && (
                <p className="text-sm text-gray-500">
                  Orçamento do cliente: €{request.budgetMin} - €{request.budgetMax}
                </p>
              )}
            </div>

            {/* Estimated Time */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4 inline mr-1" />
                Tempo Estimado *
              </label>
              <Input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="Ex: 2 horas, 1 dia, 3 dias"
                required
                className="w-full"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4 inline mr-1" />
                Descrição da Proposta *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva como você realizará o serviço, materiais que usará, cronograma, etc."
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500">
                {description.length}/500 caracteres
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-600 hover:bg-primary-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Enviar Proposta
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
