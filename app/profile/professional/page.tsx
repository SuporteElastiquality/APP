'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Button from '@/components/Button'
import Input from '@/components/Input'

interface ProfessionalProfile {
  id: string
  name: string
  email: string
  phone: string
  district: string
  council: string
  parish: string
  address: string
  postalCode: string
  specialties: string[]
  experience: string
  bio?: string
  rating: number
  totalReviews: number
  totalJobs: number
  completedJobs: number
  createdAt: string
}

export default function ProfessionalProfilePage() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    council: '',
    parish: '',
    address: '',
    postalCode: '',
    specialties: [] as string[],
    experience: '',
    bio: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [saving, setSaving] = useState(false)

  const availableSpecialties = [
    'Canalizações', 'Eletricidade', 'Pintura', 'Carpintaria', 'Alvenaria',
    'Telhados', 'Aquecimento', 'Ar Condicionado', 'Jardinagem', 'Limpeza',
    'Mudanças', 'Reparações Gerais', 'Construção', 'Renovação', 'Manutenção',
    'Instalações', 'Reparações Automóveis', 'Informática', 'Fotografia',
    'Catering', 'Organização de Eventos', 'Design', 'Consultoria'
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin')
    }
    
    if (session?.user?.userType !== 'PROFESSIONAL') {
      redirect('/profile/client')
    }

    // Carregar perfil do profissional
    loadProfessionalProfile()
  }, [session, status])

  const loadProfessionalProfile = async () => {
    try {
      const response = await fetch('/api/profile/professional')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          district: data.district || '',
          council: data.council || '',
          parish: data.parish || '',
          address: data.address || '',
          postalCode: data.postalCode || '',
          specialties: data.specialties || [],
          experience: data.experience || '',
          bio: data.bio || ''
        })
      } else {
        // Fallback para dados básicos
        setProfile({
          id: session?.user?.id || '',
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          phone: '',
          district: '',
          council: '',
          parish: '',
          address: '',
          postalCode: '',
          specialties: [],
          experience: '',
          bio: '',
          rating: 0,
          totalReviews: 0,
          totalJobs: 0,
          completedJobs: 0,
          createdAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      // Fallback para dados básicos
      setProfile({
        id: session?.user?.id || '',
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        phone: '',
        district: '',
        council: '',
        parish: '',
        address: '',
        postalCode: '',
        specialties: [],
        experience: '',
        bio: '',
        rating: 0,
        totalReviews: 0,
        totalJobs: 0,
        completedJobs: 0,
        createdAt: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
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
    
    if (!formData.address.trim()) {
      newErrors.address = 'Morada é obrigatória'
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Morada deve ter pelo menos 5 caracteres'
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Código postal é obrigatório'
    } else if (!/^\d{4}-\d{3}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Código postal deve estar no formato 0000-000'
    }
    
    if (formData.specialties.length === 0) {
      newErrors.specialties = 'Pelo menos uma especialidade é obrigatória'
    }
    
    if (!formData.experience.trim()) {
      newErrors.experience = 'Experiência é obrigatória'
    } else if (formData.experience.trim().length < 10) {
      newErrors.experience = 'Experiência deve ter pelo menos 10 caracteres'
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
      const response = await fetch('/api/profile/professional', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setEditing(false)
        setErrors({})
        await loadProfessionalProfile()
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

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">
                  {profile?.name?.charAt(0) || 'P'}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{profile?.name}</h1>
                <p className="text-green-100">{profile?.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{profile?.rating || 0}/5</span>
                    {(profile?.totalReviews || 0) > 0 && (
                      <span className="ml-2 text-green-100">({profile?.totalReviews} avaliações)</span>
                    )}
                  </div>
                  <p className="text-green-100">
                    {profile?.createdAt ? `Profissional desde ${new Date(profile.createdAt).getFullYear()}` : 'Novo profissional'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm">Trabalhos Concluídos</p>
                <p className="text-2xl font-bold">{profile?.completedJobs}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Informações Profissionais</h2>
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
                      label="Nome Completo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                    <Input
                      label="Distrito"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      required
                    />
                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                  </div>
                  <div>
                    <Input
                      label="Conselho"
                      value={formData.council}
                      onChange={(e) => setFormData({ ...formData, council: e.target.value })}
                      required
                    />
                    {errors.council && <p className="text-red-500 text-sm mt-1">{errors.council}</p>}
                  </div>
                  <div>
                    <Input
                      label="Freguesia"
                      value={formData.parish}
                      onChange={(e) => setFormData({ ...formData, parish: e.target.value })}
                      required
                    />
                    {errors.parish && <p className="text-red-500 text-sm mt-1">{errors.parish}</p>}
                  </div>
                </div>
                
                <div>
                  <Input
                    label="Morada"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Rua, número, andar, etc."
                    required
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                
                <div>
                  <Input
                    label="Código Postal"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="1000-001"
                    required
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Especialidades
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {availableSpecialties.map((specialty) => (
                      <label key={specialty} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(specialty)}
                          onChange={() => toggleSpecialty(specialty)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{specialty}</span>
                      </label>
                    ))}
                  </div>
                  {errors.specialties && <p className="text-red-500 text-sm mt-1">{errors.specialties}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experiência
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Descreva sua experiência profissional..."
                    required
                  />
                  {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
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
                    onClick={() => { setEditing(false); setErrors({}) }} 
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
                        Nome Completo
                      </label>
                      <p className="text-gray-900">{profile?.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-gray-900">{profile?.email || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <p className="text-gray-900">{profile?.phone || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Distrito
                      </label>
                      <p className="text-gray-900">{profile?.district || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Conselho
                      </label>
                      <p className="text-gray-900">{profile?.council || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Freguesia
                      </label>
                      <p className="text-gray-900">{profile?.parish || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Morada
                      </label>
                      <p className="text-gray-900">{profile?.address || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código Postal
                      </label>
                      <p className="text-gray-900">{profile?.postalCode || 'Não informado'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Especialidades
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profile?.specialties && profile.specialties.length > 0 ? (
                      profile.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">Nenhuma especialidade informada</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experiência
                  </label>
                  <p className="text-gray-900">{profile?.experience || 'Não informado'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Avaliação</h3>
            <p className="text-3xl font-bold text-yellow-600">{profile?.rating || 0}/5</p>
            <p className="text-sm text-gray-600">{profile?.totalReviews || 0} avaliações</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trabalhos</h3>
            <p className="text-3xl font-bold text-blue-600">{profile?.totalJobs || 0}</p>
            <p className="text-sm text-gray-600">Total de trabalhos</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Concluídos</h3>
            <p className="text-3xl font-bold text-green-600">{profile?.completedJobs || 0}</p>
            <p className="text-sm text-gray-600">Trabalhos finalizados</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Taxa Sucesso</h3>
            <p className="text-3xl font-bold text-purple-600">
              {profile && profile.totalJobs > 0 ? Math.round((profile.completedJobs / profile.totalJobs) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600">Taxa de conclusão</p>
          </div>
        </div>
      </div>
    </div>
  )
}
