'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, MapPin, Filter, Star } from 'lucide-react'
import Link from 'next/link'

const allServices = [
  {
    id: 1,
    name: 'Eletricista',
    category: 'Serviços de Construção e Remodelação',
    description: 'Instalações elétricas, reparações e manutenção',
    rating: 4.8,
    reviews: 156,
    image: null
  },
  {
    id: 2,
    name: 'Canalizador',
    category: 'Serviços de Construção e Remodelação',
    description: 'Reparações de canalizações e instalações',
    rating: 4.9,
    reviews: 203,
    image: null
  },
  {
    id: 3,
    name: 'Limpeza Residencial',
    category: 'Serviços de Limpeza',
    description: 'Limpeza de casas e apartamentos',
    rating: 4.7,
    reviews: 89,
    image: null
  },
  {
    id: 4,
    name: 'Pintor',
    category: 'Serviços de Construção e Remodelação',
    description: 'Pintura de interiores e exteriores',
    rating: 4.8,
    reviews: 124,
    image: null
  },
  {
    id: 5,
    name: 'Gesseiro',
    category: 'Serviços de Construção e Remodelação',
    description: 'Instalação e reparação de gesso',
    rating: 4.6,
    reviews: 97,
    image: null
  },
  {
    id: 6,
    name: 'Mecânica',
    category: 'Serviço Automóvel',
    description: 'Reparações e manutenção automóvel',
    rating: 4.9,
    reviews: 178,
    image: null
  },
  {
    id: 7,
    name: 'Cabeleireiro',
    category: 'Beleza e Estética',
    description: 'Cortes, penteados e tratamentos capilares',
    rating: 4.8,
    reviews: 234,
    image: null
  },
  {
    id: 8,
    name: 'Fisioterapia',
    category: 'Serviços de Saúde e Bem-Estar',
    description: 'Tratamentos fisioterapêuticos',
    rating: 4.9,
    reviews: 167,
    image: null
  },
  {
    id: 9,
    name: 'Design Gráfico',
    category: 'Serviços Criativos e Design',
    description: 'Logotipos e identidade visual',
    rating: 4.7,
    reviews: 123,
    image: null
  },
  {
    id: 10,
    name: 'Fotógrafo',
    category: 'Eventos e Festas',
    description: 'Fotografia de eventos e retratos',
    rating: 4.8,
    reviews: 145,
    image: null
  },
  {
    id: 11,
    name: 'Personal Trainer',
    category: 'Serviços de Saúde e Bem-Estar',
    description: 'Treino personalizado e fitness',
    rating: 4.6,
    reviews: 98,
    image: null
  },
  {
    id: 12,
    name: 'Consultoria Contábil',
    category: 'Serviços Administrativos e Financeiros',
    description: 'Serviços contabilísticos e fiscais',
    rating: 4.8,
    reviews: 134,
    image: null
  }
]

// Função para mapear categorias para IDs
const getCategoryId = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    'Serviços de Construção e Remodelação': 'construcao-reforma',
    'Serviços Domésticos': 'servicos-domesticos',
    'Serviços de Limpeza': 'limpeza',
    'Serviços de Tecnologia e Informática': 'tecnologia-informatica',
    'Serviço Automóvel': 'automotivos',
    'Beleza e Estética': 'beleza-estetica',
    'Serviços de Saúde e Bem-Estar': 'saude-bem-estar',
    'Serviços de Transporte e Logística': 'transporte-logistica',
    'Educação': 'educacao',
    'Eventos e Festas': 'eventos-festas',
    'Serviços Administrativos e Financeiros': 'administrativos-financeiros',
    'Serviços Criativos e Design': 'criativos-design'
  }
  return categoryMap[category] || 'construcao-reforma'
}

export default function ServicesPage() {
  const [visibleServices, setVisibleServices] = useState(6)

  const loadMoreServices = () => {
    setVisibleServices(prev => prev + 6)
  }

  const services = allServices.slice(0, visibleServices)
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
              <div className="max-w-4xl mx-auto">
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
                      <select
                        name="category"
                        className="w-full md:w-48 pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900 bg-white"
                      >
                        <option value="">Todas as categorias</option>
                        <option value="construcao-reforma">🏗️ Construção e Reforma</option>
                        <option value="servicos-domesticos">🏠 Serviços Domésticos</option>
                        <option value="limpeza">🧹 Serviços de Limpeza</option>
                        <option value="tecnologia-informatica">💻 Tecnologia e Informática</option>
                        <option value="automotivos">🚗 Serviços Automotivos</option>
                        <option value="beleza-estetica">💄 Beleza e Estética</option>
                        <option value="saude-bem-estar">💆 Saúde e Bem-estar</option>
                        <option value="transporte-logistica">🚛 Transporte e Logística</option>
                        <option value="educacao">📚 Serviços Educacionais</option>
                        <option value="eventos-festas">🎉 Eventos e Festas</option>
                        <option value="administrativos-financeiros">💼 Administrativos e Financeiros</option>
                        <option value="criativos-design">🎨 Criativos e Design</option>
                      </select>
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
                <option>Serviços de Construção e Remodelação</option>
                <option>Serviços Domésticos</option>
                <option>Serviços de Limpeza</option>
                <option>Serviços de Tecnologia e Informática</option>
                <option>Serviço Automóvel</option>
                <option>Beleza e Estética</option>
                <option>Serviços de Saúde e Bem-Estar</option>
                <option>Serviços de Transporte e Logística</option>
                <option>Educação</option>
                <option>Eventos e Festas</option>
                <option>Serviços Administrativos e Financeiros</option>
                <option>Serviços Criativos e Design</option>
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
                      <Link 
                        href={`/services/${getCategoryId(service.category)}`}
                        className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
                      >
                        {service.category}
                      </Link>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{service.rating}</span>
                        <span className="text-sm text-gray-500">({service.reviews})</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    <div className="flex justify-end">
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
            {visibleServices < allServices.length && (
              <div className="text-center mt-12">
                <button 
                  onClick={loadMoreServices}
                  className="bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Carregar Mais Serviços
                </button>
              </div>
            )}
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
            <Link
              href="/auth/signup"
              className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Solicitar Serviço
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
