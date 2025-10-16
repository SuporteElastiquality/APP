import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, MapPin, Filter, Star, Clock, Euro } from 'lucide-react'
import Link from 'next/link'

const services = [
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

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Encontre o Serviço Perfeito
              </h1>
              <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                Mais de 500 tipos de serviços disponíveis em Portugal. 
                Conectamos você com os melhores profissionais.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <form action="/search" method="GET" className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="service"
                        placeholder="Que serviço precisa?"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900"
                      />
                    </div>
                    
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="location"
                        placeholder="Localização"
                        className="w-full md:w-64 pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900"
                      />
                    </div>
                    
                    <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                      Buscar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 font-medium">Filtros:</span>
              </div>
              
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                <option>Todas as Categorias</option>
                <option>Reparações</option>
                <option>Casa e Jardim</option>
                <option>Automóvel</option>
                <option>Beleza</option>
              </select>
              
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                <option>Qualquer Preço</option>
                <option>€0-20/hora</option>
                <option>€20-40/hora</option>
                <option>€40-60/hora</option>
                <option>€60+/hora</option>
              </select>
              
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                <option>Qualquer Avaliação</option>
                <option>4.5+ estrelas</option>
                <option>4.0+ estrelas</option>
                <option>3.5+ estrelas</option>
              </select>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Imagem do Serviço</span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-primary-600 font-medium">{service.category}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{service.rating}</span>
                        <span className="text-sm text-gray-500">({service.reviews})</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-green-600">
                        <Euro className="w-4 h-4" />
                        <span className="font-medium">{service.price}</span>
                      </div>
                      
                      <Link
                        href={`/search?service=${encodeURIComponent(service.name)}`}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Buscar Profissionais
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More */}
            <div className="text-center mt-12">
              <button className="bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium transition-colors">
                Carregar Mais Serviços
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Não encontrou o que procura?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Publique uma solicitação de serviço e receba propostas de profissionais qualificados.
            </p>
            <button className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors">
              Solicitar Serviço
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
