'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowLeft, Star, Clock, Euro, MapPin, Phone, Mail, Calendar } from 'lucide-react'
import Button from '@/components/Button'

interface Service {
  id: number
  name: string
  category: string
  description: string
  price: string
  rating: number
  reviews: number
  image: string | null
}

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

  // Dados mockados dos serviços
  const servicesData = [
    {
      id: 1,
      name: 'Eletricista',
      category: 'Reparações',
      description: 'Instalações elétricas, reparações e manutenção',
      price: '€25-50/hora',
      rating: 4.8,
      reviews: 156,
      image: null
    },
    {
      id: 2,
      name: 'Canalizador',
      category: 'Reparações',
      description: 'Reparações de canalizações e instalações',
      price: '€30-60/hora',
      rating: 4.9,
      reviews: 203,
      image: null
    },
    {
      id: 3,
      name: 'Limpeza Doméstica',
      category: 'Casa e Jardim',
      description: 'Serviços de limpeza e organização',
      price: '€15-25/hora',
      rating: 4.7,
      reviews: 89,
      image: null
    },
    {
      id: 4,
      name: 'Jardinagem',
      category: 'Casa e Jardim',
      description: 'Manutenção de jardins e paisagismo',
      price: '€20-35/hora',
      rating: 4.8,
      reviews: 124,
      image: null
    },
    {
      id: 5,
      name: 'Pintor',
      category: 'Casa e Jardim',
      description: 'Pintura de interiores e exteriores',
      price: '€18-30/hora',
      rating: 4.6,
      reviews: 97,
      image: null
    },
    {
      id: 6,
      name: 'Mecânico',
      category: 'Automóvel',
      description: 'Reparações e manutenção automóvel',
      price: '€35-70/hora',
      rating: 4.9,
      reviews: 178,
      image: null
    }
  ]

  useEffect(() => {
    const serviceId = parseInt(params.id as string)
    const foundService = servicesData.find(s => s.id === serviceId)
    setService(foundService || null)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Serviço não encontrado</h1>
            <p className="text-gray-600 mb-8">O serviço solicitado não existe.</p>
            <Button onClick={() => router.push('/services')}>
              Voltar aos Serviços
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button 
            onClick={() => router.push('/services')}
            className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos Serviços</span>
          </button>
          <span>•</span>
          <span>{service.category}</span>
          <span>•</span>
          <span>{service.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Imagem do Serviço</span>
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-primary-600 font-medium bg-primary-50 px-3 py-1 rounded-full">
                    {service.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{service.rating}</span>
                    <span className="text-gray-500">({service.reviews} avaliações)</span>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>
                <p className="text-lg text-gray-600 mb-6">{service.description}</p>
                
                <div className="flex items-center space-x-1 text-green-600 mb-6">
                  <Euro className="w-5 h-5" />
                  <span className="text-xl font-bold">{service.price}</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Disponibilidade: 24/7</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Serviço em toda Portugal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Solicitar Orçamento
              </h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Seu nome"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="+351 XXX XXX XXX"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Cidade, Distrito"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição do Serviço
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Descreva o que precisa..."
                  />
                </div>
                
                <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                  Solicitar Orçamento
                </Button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+351 123 456 789</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 mt-2">
                  <Mail className="w-4 h-4" />
                  <span>contato@elastiquality.pt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
