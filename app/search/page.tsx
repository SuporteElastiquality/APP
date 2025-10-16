'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, MapPin, Star, Users, Award, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import LocationInput from '@/components/LocationInput'
import { LocationData } from '@/lib/geolocation'

interface Professional {
  id: string
  name: string
  email: string
  image: string | null
  specialties: string[]
  experience: string
  location: {
    district: string
    council: string
    parish: string
  }
  rating: number
  completedJobs: number
  isVerified: boolean
  isPremium: boolean
  isElastiquality: boolean
}

interface SearchResults {
  professionals: Professional[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  searchParams: {
    service: string
    location: string
    category: string
  }
}

interface Category {
  id: string
  name: string
  description: string
  icon: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState<Category[]>([])

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

  // Carregar parâmetros da URL
  useEffect(() => {
    const service = searchParams.get('service') || ''
    const loc = searchParams.get('location') || ''
    const cat = searchParams.get('category') || ''
    const page = searchParams.get('page') || '1'
    
    setSearchQuery(service)
    setLocation(loc)
    setCategory(cat)
    setCurrentPage(parseInt(page))
    
    if (service || loc || cat) {
      performSearch(service, loc, parseInt(page), cat)
    }
  }, [searchParams])

  // Função para lidar com seleção de localização
  const handleLocationSelect = (location: LocationData) => {
    setLocationData(location)
    // Extrair informações de localização do endereço
    const address = location.address || {}
    const district = address.state || address.county || ''
    const council = address.city || address.town || address.village || ''
    const parish = address.village || address.town || ''
    const locationString = `${parish}, ${council}, ${district}`
    setLocation(locationString)
  }

  const performSearch = async (service: string, loc: string, page: number = 1, cat: string = '') => {
    if (!service.trim() && !loc.trim() && !cat.trim()) return

    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        service,
        location: loc,
        category: cat,
        page: page.toString(),
        limit: '12'
      })

      const response = await fetch(`/api/search/professionals?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro na busca')
      }

      setResults(data)
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Erro na busca')
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('service', searchQuery)
    newUrl.searchParams.set('location', location)
    newUrl.searchParams.set('category', category)
    newUrl.searchParams.set('page', '1')
    router.push(newUrl.pathname + newUrl.search)
  }

  const handlePageChange = (page: number) => {
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('page', page.toString())
    router.push(newUrl.pathname + newUrl.search)
  }

  const formatLocation = (prof: Professional) => {
    const { district, council, parish } = prof.location
    return [parish, council, district].filter(Boolean).join(', ')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Que serviço precisa?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900"
                />
              </div>
              
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900 bg-white"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <LocationInput
                value={location}
                onChange={setLocation}
                onLocationSelect={handleLocationSelect}
                placeholder="Onde está localizado?"
              />
              
              <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                Buscar Profissionais
              </Button>
            </div>
          </form>
        </div>

        {/* Results Header */}
        {results && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {results.searchParams.service && results.searchParams.location && results.searchParams.category
                  ? `Profissionais de ${results.searchParams.service} em ${results.searchParams.location} - ${categories.find(c => c.id === results.searchParams.category)?.name || results.searchParams.category}`
                  : results.searchParams.service && results.searchParams.location
                  ? `Profissionais de ${results.searchParams.service} em ${results.searchParams.location}`
                  : results.searchParams.service && results.searchParams.category
                  ? `Profissionais de ${results.searchParams.service} - ${categories.find(c => c.id === results.searchParams.category)?.name || results.searchParams.category}`
                  : results.searchParams.service
                  ? `Profissionais de ${results.searchParams.service}`
                  : results.searchParams.location
                  ? `Profissionais em ${results.searchParams.location}`
                  : results.searchParams.category
                  ? `Profissionais - ${categories.find(c => c.id === results.searchParams.category)?.name || results.searchParams.category}`
                  : 'Todos os profissionais'
                }
              </h1>
              <p className="text-gray-600 mt-1">
                {results.pagination.total} profissional{results.pagination.total !== 1 ? 'is' : ''} encontrado{results.pagination.total !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Filtros</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Buscando profissionais...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">
              <Search className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Erro na busca</h3>
              <p className="text-sm">{error}</p>
            </div>
            <Button 
              onClick={() => performSearch(searchQuery, location, currentPage)}
              className="mt-4"
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {/* No Results State */}
        {results && results.professionals.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="text-gray-400 mb-6">
              <Search className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum profissional encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                {results.searchParams.service && results.searchParams.location && results.searchParams.category
                  ? `Não encontramos profissionais para "${results.searchParams.service}" em "${results.searchParams.location}" na categoria "${categories.find(c => c.id === results.searchParams.category)?.name || results.searchParams.category}".`
                  : results.searchParams.service && results.searchParams.location
                  ? `Não encontramos profissionais para "${results.searchParams.service}" em "${results.searchParams.location}".`
                  : results.searchParams.service && results.searchParams.category
                  ? `Não encontramos profissionais para "${results.searchParams.service}" na categoria "${categories.find(c => c.id === results.searchParams.category)?.name || results.searchParams.category}".`
                  : results.searchParams.service
                  ? `Não encontramos profissionais para "${results.searchParams.service}".`
                  : results.searchParams.location
                  ? `Não encontramos profissionais em "${results.searchParams.location}".`
                  : results.searchParams.category
                  ? `Não encontramos profissionais na categoria "${categories.find(c => c.id === results.searchParams.category)?.name || results.searchParams.category}".`
                  : 'Não encontramos profissionais.'
                }
                <br />
                Tente ajustar sua busca ou expandir a área de pesquisa.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Sugestões:</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {['Eletricista', 'Canalizador', 'Pintor', 'Carpinteiro', 'Jardinagem', 'Limpeza'].map((service) => (
                  <button
                    key={service}
                    onClick={() => {
                      setSearchQuery(service)
                      setLocation('')
                      setCategory('')
                      performSearch(service, '', 1, '')
                    }}
                    className="bg-primary-50 hover:bg-primary-100 text-primary-700 px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    {service}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSearchQuery('')
                      setLocation('')
                      setCategory(cat.id)
                      performSearch('', '', 1, cat.id)
                    }}
                    className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {results && results.professionals.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.professionals.map((prof) => (
                <Card key={prof.id} className={`p-6 hover:shadow-lg transition-shadow ${prof.isElastiquality ? 'ring-2 ring-primary-500 bg-gradient-to-br from-primary-50 to-blue-50' : ''}`}>
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${prof.isElastiquality ? 'bg-gradient-to-br from-primary-500 to-blue-600' : 'bg-primary-100'}`}>
                      {prof.image ? (
                        <img 
                          src={prof.image} 
                          alt={prof.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <Users className={`w-8 h-8 ${prof.isElastiquality ? 'text-white' : 'text-primary-600'}`} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{prof.name}</h3>
                        {prof.isElastiquality && (
                          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            OFICIAL
                          </span>
                        )}
                        {prof.isVerified && !prof.isElastiquality && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            VERIFICADO
                          </span>
                        )}
                        {prof.isPremium && !prof.isElastiquality && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                            PREMIUM
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{formatLocation(prof)}</p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700 ml-1">
                            {prof.rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {prof.completedJobs} trabalhos
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Especialidades:</h4>
                      <div className="flex flex-wrap gap-1">
                        {prof.specialties.slice(0, 3).map((specialty, index) => (
                          <span
                            key={index}
                            className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                        {prof.specialties.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{prof.specialties.length - 3} mais
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {prof.experience && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Experiência:</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {prof.experience}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Button className={`w-full ${prof.isElastiquality ? 'bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700' : ''}`}>
                      {prof.isElastiquality ? 'Contatar Elastiquality' : 'Ver Perfil'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {results.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!results.pagination.hasPrev}
                  className="flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, results.pagination.totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          page === currentPage
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!results.pagination.hasNext}
                  className="flex items-center space-x-1"
                >
                  <span>Próxima</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
