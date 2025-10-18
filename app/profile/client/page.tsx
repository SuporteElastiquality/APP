'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AddressAutocomplete from '@/components/AddressAutocomplete'

interface ClientProfile {
  id: string
  name: string
  email: string
  phone: string
  district: string
  council: string
  parish: string
  morada: string
  houseNumber?: string
  apartment?: string
  postalCode: string
  createdAt: string
  stats: {
    totalRequests: number
    completedRequests: number
    averageRating: number
  }
}

export default function ClientProfilePage() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    district: '',
    council: '',
    parish: '',
    morada: '',
    houseNumber: '',
    apartment: '',
    postalCode: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [saving, setSaving] = useState(false)

  const handleAddressSelect = (addressData: {
    morada: string
    district: string
    council: string
    parish: string
    postalCode: string
  }) => {
    setFormData(prev => ({
      ...prev,
      morada: addressData.morada,
      district: addressData.district,
      council: addressData.council,
      parish: addressData.parish,
      postalCode: addressData.postalCode
    }))
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin')
    }
    
    if (session?.user?.userType !== 'CLIENT') {
      redirect('/profile/professional')
    }

    // Carregar perfil do cliente
    loadClientProfile()
  }, [session, status])

  const loadClientProfile = async () => {
    try {
      const response = await fetch('/api/profile/client')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        // Separar nome completo em primeiro nome e apelido
        const nameParts = data.name.split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        
        setFormData({
          firstName,
          lastName,
          phone: data.phone,
          district: data.district,
          council: data.council,
          parish: data.parish,
          morada: data.morada || '',
          houseNumber: data.houseNumber || '',
          apartment: data.apartment || '',
          postalCode: data.postalCode || ''
        })
      } else {
        console.error('Erro ao carregar perfil:', response.statusText)
        // Fallback para dados básicos
        setProfile({
          id: session?.user?.id || '1',
          name: session?.user?.name || 'Nome do Cliente',
          email: session?.user?.email || 'cliente@exemplo.com',
          phone: '',
          district: '',
          council: '',
          parish: '',
          morada: '',
          houseNumber: '',
          apartment: '',
          postalCode: '',
          createdAt: new Date().toISOString(),
          stats: {
            totalRequests: 0,
            completedRequests: 0,
            averageRating: 0
          }
        })
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nome é obrigatório'
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Nome deve ter pelo menos 2 caracteres'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Apelido é obrigatório'
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Apelido deve ter pelo menos 2 caracteres'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    } else if (!/^9\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone deve ter 9 dígitos começando com 9'
    }

    if (!formData.district.trim()) {
      newErrors.district = 'Distrito é obrigatório'
    }

    if (!formData.council.trim()) {
      newErrors.council = 'Conselho é obrigatório'
    }

    if (!formData.parish.trim()) {
      newErrors.parish = 'Freguesia é obrigatória'
    }

    if (!formData.morada.trim()) {
      newErrors.morada = 'Morada é obrigatória'
    } else if (formData.morada.trim().length < 5) {
      newErrors.morada = 'Morada deve ter pelo menos 5 caracteres'
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Código postal é obrigatório'
    } else if (!/^\d{4}-\d{3}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Código postal deve estar no formato 0000-000'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      // Combinar firstName e lastName em name para a API
      const dataToSend = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim()
      }
      
      const response = await fetch('/api/profile/client', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      })

      if (response.ok) {
        setEditing(false)
        setErrors({})
        // Recarregar perfil atualizado
        await loadClientProfile()
        alert('Perfil atualizado com sucesso!')
      } else {
        const errorData = await response.json()
        console.error('Erro ao salvar perfil:', errorData)
        if (errorData.details) {
          setErrors(errorData.details.fieldErrors || {})
        } else {
          alert('Erro ao salvar perfil. Tente novamente.')
        }
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      alert('Erro ao salvar perfil. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {profile?.name?.charAt(0) || 'C'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile?.name}</h1>
                <p className="text-blue-100">{profile?.email}</p>
                <p className="text-blue-100">Cliente desde {new Date(profile?.createdAt || '').getFullYear()}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Informações Pessoais</h2>
              <Button
                onClick={() => setEditing(!editing)}
                variant={editing ? 'outline' : 'primary'}
              >
                {editing ? 'Cancelar' : 'Editar'}
              </Button>
            </div>

            {editing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Nome"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Seu nome"
                      required
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Input
                      label="Apelido"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Seu apelido"
                      required
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                
                <div>
                  <Input
                    label="Telefone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="912345678"
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <AddressAutocomplete
                    label="Morada (Rua/Avenida/Praceta)"
                    value={formData.morada}
                    onChange={(value) => setFormData({ ...formData, morada: value })}
                    onAddressSelect={handleAddressSelect}
                    placeholder="Digite sua morada para autopreenchimento..."
                    required
                    error={errors.morada}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Número da Casa/Prédio"
                      value={formData.houseNumber}
                      onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                      placeholder="Ex: 123, 45A, 12-14"
                    />
                    {errors.houseNumber && <p className="text-red-500 text-sm mt-1">{errors.houseNumber}</p>}
                  </div>
                  <div>
                    <Input
                      label="Apartamento/Sala (opcional)"
                      value={formData.apartment}
                      onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      placeholder="Ex: 2º D, Sala 5, Loja A"
                    />
                    {errors.apartment && <p className="text-red-500 text-sm mt-1">{errors.apartment}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Input
                      label="Distrito"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      placeholder="Preenchido automaticamente"
                      className="bg-gray-50"
                      required
                    />
                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                    <p className="text-xs text-gray-500 mt-1">Preenchido automaticamente pela morada</p>
                  </div>
                  <div>
                    <Input
                      label="Conselho"
                      value={formData.council}
                      onChange={(e) => setFormData({ ...formData, council: e.target.value })}
                      placeholder="Preenchido automaticamente"
                      className="bg-gray-50"
                      required
                    />
                    {errors.council && <p className="text-red-500 text-sm mt-1">{errors.council}</p>}
                    <p className="text-xs text-gray-500 mt-1">Preenchido automaticamente pela morada</p>
                  </div>
                  <div>
                    <Input
                      label="Freguesia"
                      value={formData.parish}
                      onChange={(e) => setFormData({ ...formData, parish: e.target.value })}
                      placeholder="Preenchido automaticamente"
                      className="bg-gray-50"
                      required
                    />
                    {errors.parish && <p className="text-red-500 text-sm mt-1">{errors.parish}</p>}
                    <p className="text-xs text-gray-500 mt-1">Preenchido automaticamente pela morada</p>
                  </div>
                </div>
                
                <div>
                  <Input
                    label="Código Postal"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="1000-001 (preenchido automaticamente)"
                    className="bg-gray-50"
                    required
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                  <p className="text-xs text-gray-500 mt-1">Preenchido automaticamente pela morada</p>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={handleSave} 
                    className="flex-1"
                    disabled={saving}
                  >
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                  <Button 
                    onClick={() => {
                      setEditing(false)
                      setErrors({})
                    }} 
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <p className="text-gray-900">{profile?.name?.split(' ')[0] || ''}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apelido
                      </label>
                      <p className="text-gray-900">{profile?.name?.split(' ').slice(1).join(' ') || ''}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-gray-900">{profile?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <p className="text-gray-900">{profile?.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Distrito
                      </label>
                      <p className="text-gray-900">{profile?.district}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Conselho
                      </label>
                      <p className="text-gray-900">{profile?.council}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Freguesia
                      </label>
                      <p className="text-gray-900">{profile?.parish}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código Postal
                      </label>
                      <p className="text-gray-900">{profile?.postalCode}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Morada Completa
                  </label>
                  <p className="text-gray-900">
                    {profile?.morada}
                    {profile?.houseNumber && `, ${profile.houseNumber}`}
                    {profile?.apartment && `, ${profile.apartment}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Solicitações</h3>
            <p className="text-3xl font-bold text-blue-600">{profile?.stats.totalRequests || 0}</p>
            <p className="text-sm text-gray-600">Total de serviços solicitados</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Concluídos</h3>
            <p className="text-3xl font-bold text-green-600">{profile?.stats.completedRequests || 0}</p>
            <p className="text-sm text-gray-600">Serviços finalizados</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Avaliação</h3>
            <p className="text-3xl font-bold text-yellow-600">{profile?.stats.averageRating || 0}</p>
            <p className="text-sm text-gray-600">Média das avaliações</p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.location.href = '/request-service'}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-lg"
          >
            Solicitar Novo Serviço
          </Button>
          <Button
            onClick={() => window.location.href = '/profile/client/requests'}
            variant="outline"
            className="px-8 py-3 text-lg"
          >
            Ver Minhas Solicitações
          </Button>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
