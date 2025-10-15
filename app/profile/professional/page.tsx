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
  postalCode?: string
  specialties: string[]
  experience: string
  rating: number
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
    postalCode: '',
    specialties: [] as string[],
    experience: ''
  })

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
      // Simular carregamento de dados
      setProfile({
        id: '1',
        name: session?.user?.name || 'Nome do Profissional',
        email: session?.user?.email || 'profissional@exemplo.com',
        phone: '912345678',
        district: 'Lisboa',
        council: 'Lisboa',
        parish: 'Campolide',
        postalCode: '1000-001',
        specialties: ['Canalizações', 'Eletricidade', 'Pintura'],
        experience: 'Mais de 10 anos de experiência em reparações domésticas.',
        rating: 4.8,
        totalJobs: 45,
        completedJobs: 42,
        createdAt: '2024-01-01'
      })
      
      setFormData({
        name: session?.user?.name || '',
        phone: '912345678',
        district: 'Lisboa',
        council: 'Lisboa',
        parish: 'Campolide',
        postalCode: '1000-001',
        specialties: ['Canalizações', 'Eletricidade', 'Pintura'],
        experience: 'Mais de 10 anos de experiência em reparações domésticas.'
      })
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      // Aqui seria a chamada para a API para salvar
      console.log('Salvando perfil:', formData)
      setEditing(false)
      // Atualizar o perfil local
      if (profile) {
        setProfile({
          ...profile,
          ...formData
        })
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
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
                    <span className="ml-1">{profile?.rating}/5</span>
                  </div>
                  <p className="text-green-100">Profissional desde {new Date(profile?.createdAt || '').getFullYear()}</p>
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
                  <Input
                    label="Nome Completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Telefone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="912345678"
                    required
                  />
                  <Input
                    label="Distrito"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                  />
                  <Input
                    label="Conselho"
                    value={formData.council}
                    onChange={(e) => setFormData({ ...formData, council: e.target.value })}
                    required
                  />
                  <Input
                    label="Freguesia"
                    value={formData.parish}
                    onChange={(e) => setFormData({ ...formData, parish: e.target.value })}
                    required
                  />
                  <Input
                    label="Código Postal"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="1000-001"
                  />
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
                  />
                </div>

                <Button onClick={handleSave} className="w-full">
                  Salvar Alterações
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo
                      </label>
                      <p className="text-gray-900">{profile?.name}</p>
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
                    {profile?.postalCode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Código Postal
                        </label>
                        <p className="text-gray-900">{profile.postalCode}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Especialidades
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profile?.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experiência
                  </label>
                  <p className="text-gray-900">{profile?.experience}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Avaliação</h3>
            <p className="text-3xl font-bold text-yellow-600">{profile?.rating}/5</p>
            <p className="text-sm text-gray-600">Média das avaliações</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trabalhos</h3>
            <p className="text-3xl font-bold text-blue-600">{profile?.totalJobs}</p>
            <p className="text-sm text-gray-600">Total de trabalhos</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Concluídos</h3>
            <p className="text-3xl font-bold text-green-600">{profile?.completedJobs}</p>
            <p className="text-sm text-gray-600">Trabalhos finalizados</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Taxa Sucesso</h3>
            <p className="text-3xl font-bold text-purple-600">
              {profile ? Math.round((profile.completedJobs / profile.totalJobs) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600">Taxa de conclusão</p>
          </div>
        </div>
      </div>
    </div>
  )
}
