'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin, ChevronRight, Star, Users, Award } from 'lucide-react'
import Button from './Button'

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim() && !location.trim()) {
      return
    }

    // Redirecionar para página de busca
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('service', searchQuery.trim())
    if (location.trim()) params.set('location', location.trim())
    
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Encontre o profissional
                <span className="text-secondary-400 block">
                  perfeito para você
                </span>
              </h1>
              <p className="text-xl text-primary-100 max-w-lg">
                Mais de 500 tipos de serviços em um só lugar. 
                Conectamos clientes com os melhores profissionais de Portugal.
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Onde está localizado?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                    Buscar Profissionais
                  </Button>
                </div>
              </div>
            </form>

            {/* Popular Searches */}
            <div className="space-y-3">
              <p className="text-primary-100 text-sm">Pesquisas populares:</p>
              <div className="flex flex-wrap gap-2">
                {['Eletricista', 'Canalizador', 'Limpeza', 'Jardinagem', 'Pintor', 'Carpinteiro'].map((service) => (
                  <button
                    key={service}
                    onClick={() => {
                      setSearchQuery(service)
                      setLocation('')
                      router.push(`/search?service=${encodeURIComponent(service)}`)
                    }}
                    className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Stats Cards */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-secondary-500 p-2 rounded-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">50k+</p>
                    <p className="text-primary-100 text-sm">Profissionais</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-3 mt-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-success-500 p-2 rounded-lg">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">98%</p>
                    <p className="text-primary-100 text-sm">Satisfação</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-3 -mt-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-400 p-2 rounded-lg">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">4.8</p>
                    <p className="text-primary-100 text-sm">Avaliação</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-3 mt-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-secondary-400 p-2 rounded-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">308</p>
                    <p className="text-primary-100 text-sm">Concelhos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-secondary-500 rounded-full p-4 animate-bounce-subtle">
              <Star className="w-6 h-6 text-white" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-success-500 rounded-full p-3 animate-bounce-subtle" style={{ animationDelay: '1s' }}>
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-20"
        >
          <path
            d="M0,64L48,69.3C96,75,192,85,288,85.3C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="#F9FAFB"
          />
        </svg>
      </div>
    </section>
  )
}
