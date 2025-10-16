'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { MapPin, User, Briefcase, CheckCircle } from 'lucide-react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Select from '@/components/Select'

export default function GoogleSignUp() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1: Tipo de usuário, 2: Dados adicionais

  const [formData, setFormData] = useState({
    userType: '',
    phone: '',
    district: '',
    council: '',
    parish: '',
    morada: '',
    postalCode: '',
    specialties: '',
    experience: '',
    bio: ''
  })

  // Lista de distritos portugueses
  const districts = [
    'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra',
    'Évora', 'Faro', 'Guarda', 'Leiria', 'Lisboa', 'Portalegre',
    'Porto', 'Santarém', 'Setúbal', 'Viana do Castelo', 'Vila Real', 'Viseu'
  ]

  // Lista de concelhos (exemplo para Lisboa)
  const councils = {
    'Lisboa': ['Lisboa', 'Amadora', 'Oeiras', 'Cascais', 'Sintra', 'Loures', 'Vila Franca de Xira'],
    'Porto': ['Porto', 'Vila Nova de Gaia', 'Matosinhos', 'Gondomar', 'Valongo', 'Paredes', 'Paços de Ferreira'],
    'Braga': ['Braga', 'Guimarães', 'Barcelos', 'Famalicão', 'Vila Nova de Famalicão'],
    'Coimbra': ['Coimbra', 'Figueira da Foz', 'Cantanhede', 'Condeixa-a-Nova'],
    'Aveiro': ['Aveiro', 'Águeda', 'Albergaria-a-Velha', 'Anadia', 'Arouca', 'Aveiro', 'Castelo de Paiva'],
    // Adicione mais conforme necessário
  }

  // Lista de freguesias (exemplo para Lisboa)
  const parishes = {
    'Lisboa': ['Ajuda', 'Alcântara', 'Alvalade', 'Areeiro', 'Arroios', 'Avenidas Novas', 'Beato', 'Belém', 'Benfica', 'Campo de Ourique', 'Campolide', 'Carnide', 'Estrela', 'Lumiar', 'Marvila', 'Misericórdia', 'Olivais', 'Penha de França', 'Santa Clara', 'Santa Maria Maior', 'Santo António', 'São Domingos de Benfica', 'São Vicente'],
    'Porto': ['Aldoar, Foz do Douro e Nevogilde', 'Bonfim', 'Campanhã', 'Cedofeita, Santo Ildefonso, Sé, Miragaia, São Nicolau e Vitória', 'Lordelo do Ouro e Massarelos', 'Paranhos', 'Ramalde'],
    // Adicione mais conforme necessário
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Se já tem perfil completo, redirecionar
      if (session.user.userType) {
        router.push('/dashboard')
      }
    } else if (status === 'unauthenticated') {
      // Se não está logado, redirecionar para login
      router.push('/auth/signin')
    }
  }, [session, status, router])

  const handleUserTypeSelect = (userType: string) => {
    setFormData({ ...formData, userType })
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/complete-google-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao completar perfil')
      }

      // Atualizar a sessão
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao completar perfil')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Será redirecionado
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Elastiquality"
            width={200}
            height={100}
            className="w-50 h-25 object-contain"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {step === 1 ? 'Complete seu perfil' : 'Dados adicionais'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1 
            ? 'Escolha como você quer usar a plataforma'
            : 'Preencha as informações necessárias para seu perfil'
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-6">
                  Olá <strong>{session?.user?.name}</strong>! Como você quer usar a plataforma?
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  onClick={() => handleUserTypeSelect('CLIENT')}
                  className="relative p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center">
                    <User className="w-8 h-8 text-primary-600 mr-4" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Cliente</h3>
                      <p className="text-sm text-gray-600">
                        Busco profissionais para realizar serviços
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleUserTypeSelect('PROFESSIONAL')}
                  className="relative p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Briefcase className="w-8 h-8 text-primary-600 mr-4" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Profissional</h3>
                      <p className="text-sm text-gray-600">
                        Ofereço serviços para clientes
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">
                    Conta Google conectada: {session?.user?.email}
                  </span>
                </div>
              </div>

              <Input
                label="Telefone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="912345678"
                required
                pattern="9[0-9]{8}"
                title="Telefone deve ter 9 dígitos começando com 9"
              />

              <div className="grid grid-cols-1 gap-4">
                <Select
                  label="Distrito"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value, council: '', parish: '' })}
                  required
                  options={[
                    { value: 'Porto', label: 'Porto' },
                    { value: 'Lisboa', label: 'Lisboa' },
                    { value: 'Braga', label: 'Braga' },
                    { value: 'Coimbra', label: 'Coimbra' },
                    { value: 'Aveiro', label: 'Aveiro' },
                    { value: 'Setúbal', label: 'Setúbal' },
                    { value: 'Faro', label: 'Faro' },
                    { value: 'Leiria', label: 'Leiria' },
                    { value: 'Viseu', label: 'Viseu' },
                    { value: 'Vila Real', label: 'Vila Real' }
                  ]}
                >
                  <option value="">Selecione o distrito</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </Select>

                {formData.district && councils[formData.district as keyof typeof councils] && (
                  <Select
                    label="Concelho"
                    value={formData.council}
                    onChange={(e) => setFormData({ ...formData, council: e.target.value, parish: '' })}
                    required
                    options={councils[formData.district as keyof typeof councils].map(council => ({ value: council, label: council }))}
                  >
                    <option value="">Selecione o concelho</option>
                    {councils[formData.district as keyof typeof councils].map((council) => (
                      <option key={council} value={council}>
                        {council}
                      </option>
                    ))}
                  </Select>
                )}

                {formData.council && parishes[formData.council as keyof typeof parishes] && (
                  <Select
                    label="Freguesia"
                    value={formData.parish}
                    onChange={(e) => setFormData({ ...formData, parish: e.target.value })}
                    required
                    options={parishes[formData.council as keyof typeof parishes].map(parish => ({ value: parish, label: parish }))}
                  >
                    <option value="">Selecione a freguesia</option>
                    {parishes[formData.council as keyof typeof parishes].map((parish) => (
                      <option key={parish} value={parish}>
                        {parish}
                      </option>
                    ))}
                  </Select>
                )}
              </div>

              <Input
                label="Endereço (opcional)"
                type="text"
                value={formData.morada}
                onChange={(e) => setFormData({ ...formData, morada: e.target.value })}
                placeholder="Rua, número, andar"
              />

              <Input
                label="Código Postal (opcional)"
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="1000-001"
                pattern="[0-9]{4}-[0-9]{3}"
                title="Formato: 1000-001"
              />

              {formData.userType === 'PROFESSIONAL' && (
                <>
                  <Input
                    label="Especialidades"
                    type="text"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    placeholder="Ex: Eletricista, Canalizador, Pintor"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experiência
                    </label>
                    <textarea
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="Descreva sua experiência profissional..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografia (opcional)
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Conte um pouco sobre você..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  className="flex-1"
                >
                  Completar Perfil
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
