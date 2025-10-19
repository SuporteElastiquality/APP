'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Professional {
  id: string
  name: string
  email: string
  phone: string | null
  userType: 'PROFESSIONAL'
  createdAt: string
  professionalProfile: {
    id: string
    specialties: string[]
    description: string | null
    rating: number | null
    district: string
    council: string
    parish: string
    isVerified: boolean
  } | null
  _count: {
    serviceRequests: number
  }
}

export default function ProfissionaisPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [verificationFilter, setVerificationFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user?.email !== 'admin@elastiquality.pt') {
      router.push('/auth/signin')
      return
    }

    loadProfessionals()
  }, [session, status, router])

  const loadProfessionals = async () => {
    try {
      const response = await fetch('/api/admin/professionals')
      if (response.ok) {
        const data = await response.json()
        setProfessionals(data.professionals)
        setFilteredProfessionals(data.professionals)
      }
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    let filtered = professionals

    if (term) {
      filtered = filtered.filter(professional =>
        professional.name.toLowerCase().includes(term.toLowerCase()) ||
        professional.email.toLowerCase().includes(term.toLowerCase()) ||
        professional.professionalProfile?.specialties.some(specialty =>
          specialty.toLowerCase().includes(term.toLowerCase())
        ) ||
        professional.professionalProfile?.district.toLowerCase().includes(term.toLowerCase()) ||
        professional.professionalProfile?.council.toLowerCase().includes(term.toLowerCase())
      )
    }

    if (verificationFilter !== 'all') {
      filtered = filtered.filter(professional => {
        if (verificationFilter === 'verified') {
          return professional.professionalProfile?.isVerified === true
        } else if (verificationFilter === 'unverified') {
          return professional.professionalProfile?.isVerified === false
        }
        return true
      })
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'rating':
          return (b.professionalProfile?.rating || 0) - (a.professionalProfile?.rating || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredProfessionals(filtered)
  }

  const toggleVerification = async (professionalId: string, isVerified: boolean) => {
    try {
      const response = await fetch(`/api/admin/professionals/${professionalId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVerified })
      })

      if (response.ok) {
        // Atualizar a lista local
        setProfessionals(prev => 
          prev.map(prof => 
            prof.id === professionalId 
              ? {
                  ...prof,
                  professionalProfile: prof.professionalProfile 
                    ? { ...prof.professionalProfile, isVerified }
                    : null
                }
              : prof
          )
        )
        handleSearch(searchTerm) // Reaplicar filtros
      }
    } catch (error) {
      console.error('Erro ao atualizar verificação:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando profissionais...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.email !== 'admin@elastiquality.pt') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Profissionais</h1>
              <p className="mt-2 text-gray-600">Gerir profissionais cadastrados na plataforma</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Nome, email, especialidade, localização..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verificação</label>
              <select
                value={verificationFilter}
                onChange={(e) => {
                  setVerificationFilter(e.target.value)
                  handleSearch(searchTerm)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="verified">Verificados</option>
                <option value="unverified">Não Verificados</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  handleSearch(searchTerm)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Mais Recente</option>
                <option value="oldest">Mais Antigo</option>
                <option value="rating">Melhor Avaliação</option>
                <option value="name">Nome A-Z</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setVerificationFilter('all')
                  setSortBy('newest')
                  setFilteredProfessionals(professionals)
                }}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Profissionais */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Profissionais ({filteredProfessionals.length})
            </h2>
          </div>

          {filteredProfessionals.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Nenhum profissional encontrado</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProfessionals.map((professional) => (
                <div key={professional.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{professional.name}</h3>
                        {professional.professionalProfile?.isVerified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verificado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            Não Verificado
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{professional.email}</span>
                        </div>
                        
                        {professional.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{professional.phone}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Registado em {new Date(professional.createdAt).toLocaleDateString('pt-PT')}</span>
                        </div>

                        {professional.professionalProfile?.rating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-2 text-yellow-400" />
                            <span>{professional.professionalProfile.rating.toFixed(1)}/5</span>
                          </div>
                        )}
                      </div>

                      {professional.professionalProfile && (
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>
                            {professional.professionalProfile.parish}, {professional.professionalProfile.council}, {professional.professionalProfile.district}
                          </span>
                        </div>
                      )}

                      {professional.professionalProfile?.specialties && professional.professionalProfile.specialties.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Especialidades:</p>
                          <div className="flex flex-wrap gap-1">
                            {professional.professionalProfile.specialties.map((specialty, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {professional.professionalProfile?.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {professional.professionalProfile.description}
                        </p>
                      )}

                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span>{professional._count.serviceRequests} solicitações</span>
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => router.push(`/professionals/${professional.id}`)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Ver perfil"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => toggleVerification(professional.id, !professional.professionalProfile?.isVerified)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          professional.professionalProfile?.isVerified
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {professional.professionalProfile?.isVerified ? 'Desverificar' : 'Verificar'}
                      </button>
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
