'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Select from '@/components/Select'
import { MapPin, Euro, Calendar, FileText, CheckCircle } from 'lucide-react'
import LocationInput from '@/components/LocationInput'
import { LocationData } from '@/lib/geolocation'

interface Category {
  id: string
  name: string
  description: string
  icon: string
}

interface Service {
  id: string
  name: string
  categoryId: string
}

export default function RequestServicePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [categories, setCategories] = useState<Category[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [location, setLocation] = useState<LocationData | null>(null)
  const [locationInput, setLocationInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Parâmetros da URL para profissional específico
  const professionalId = searchParams.get('professional')
  const professionalName = searchParams.get('name')
  const professionalProfession = searchParams.get('profession')

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin?callbackUrl=/request-service')
    }
  }, [session, status, router])

  // Preencher campos automaticamente quando há um profissional específico
  useEffect(() => {
    if (professionalName && professionalProfession) {
      setTitle(`Solicitação de serviço para ${professionalName}`)
      setDescription(`Olá ${professionalName}, gostaria de solicitar seus serviços de ${professionalProfession}. Por favor, entre em contato para discutirmos os detalhes.`)
    }
  }, [professionalName, professionalProfession])

  // Carregar categorias
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }
    loadCategories()
  }, [])

  // Carregar serviços quando categoria for selecionada
  useEffect(() => {
    if (selectedCategory) {
      const loadServices = async () => {
        try {
          const response = await fetch(`/api/services?category=${selectedCategory}`)
          const data = await response.json()
          // A API retorna { services, pagination }, então extraímos apenas services
          setServices(data.services || [])
        } catch (error) {
          console.error('Error loading services:', error)
          setServices([])
        }
      }
      loadServices()
    } else {
      setServices([])
      setSelectedService('')
    }
  }, [selectedCategory])

  // Função para lidar com seleção de localização
  const handleLocationSelect = (locationData: LocationData) => {
    setLocation(locationData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      alert('Você precisa estar logado para solicitar um serviço')
      return
    }

    if (!selectedService || !title || !description || !location) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          serviceId: selectedService,
          budgetMin: budgetMin ? parseFloat(budgetMin) : null,
          budgetMax: budgetMax ? parseFloat(budgetMax) : null,
          district: location.address?.state || location.address?.county || '',
          council: location.address?.city || location.address?.town || location.address?.village || '',
          parish: location.address?.village || location.address?.town || '',
          address: location.display_name || ''
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Se há um profissional específico, redirecionar para o chat
        if (professionalId) {
          // Criar conversa com o profissional específico
          try {
            const chatResponse = await fetch('/api/chat/rooms', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                participantId: professionalId,
                type: 'DIRECT'
              }),
            })
            
            if (chatResponse.ok) {
              const chatData = await chatResponse.json()
              router.push(`/messages?room=${chatData.id}`)
            } else {
              // Se falhar ao criar chat, redirecionar para mensagens
              router.push('/messages')
            }
          } catch (error) {
            console.error('Error creating chat:', error)
            router.push('/messages')
          }
        } else {
          alert('Solicitação criada com sucesso! Você receberá propostas em breve.')
          router.push('/profile/client')
        }
      } else {
        const error = await response.json()
        console.error('API Error:', error)
        alert(`Erro ao criar solicitação: ${error.error || error.message || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Error creating service request:', error)
      alert('Erro ao criar solicitação. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
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
      
      <main className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Solicitar Serviço
            </h1>
            <p className="text-lg text-gray-600">
              Descreva o seu projeto e receba propostas de profissionais certificados
            </p>
          </div>

          {/* Professional Selected Info */}
          {professionalId && professionalName && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-lg font-medium">
                    {professionalName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    Solicitando serviço para {professionalName}
                  </h3>
                  <p className="text-blue-700">
                    {professionalProfession} • Esta solicitação será enviada diretamente para este profissional
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Passo 1: Categoria e Serviço */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Escolha o tipo de serviço</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Serviço específico *
                    </label>
                    <Select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      required
                      disabled={!selectedCategory}
                    >
                      <option value="">Selecione um serviço</option>
                      {services.length > 0 ? (
                        services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          {selectedCategory ? 'Carregando serviços...' : 'Selecione uma categoria primeiro'}
                        </option>
                      )}
                    </Select>
                  </div>
                </div>
              </div>

              {/* Passo 2: Descrição do Projeto */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Descreva o seu projeto</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do projeto *
                  </label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Instalação elétrica em apartamento T2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição detalhada *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva detalhadamente o que precisa, incluindo especificações técnicas, materiais, prazos, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    rows={5}
                    required
                  />
                </div>
              </div>

              {/* Passo 3: Orçamento */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Defina o seu orçamento (opcional)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orçamento mínimo (€)
                    </label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="number"
                        value={budgetMin}
                        onChange={(e) => setBudgetMin(e.target.value)}
                        placeholder="0"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orçamento máximo (€)
                    </label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="number"
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(e.target.value)}
                        placeholder="0"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Passo 4: Localização */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Informe a localização</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização exata *
                  </label>
                  <LocationInput
                    value={locationInput}
                    onChange={setLocationInput}
                    onLocationSelect={handleLocationSelect}
                    placeholder="Digite o endereço ou use a localização atual"
                  />
                  {location && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800">
                          {location.display_name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Criando solicitação...' : 'Publicar Solicitação'}
                </Button>
              </div>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <FileText className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-blue-800 mb-2">
                  O que acontece depois?
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Profissionais certificados receberão sua solicitação</li>
                  <li>• Você receberá até 5 propostas em 24 horas</li>
                  <li>• Compare preços, avaliações e especialidades</li>
                  <li>• Escolha o profissional que melhor se adequa ao seu projeto</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
