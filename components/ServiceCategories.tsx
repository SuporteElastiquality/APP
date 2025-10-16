'use client'

import { useRouter } from 'next/navigation'
import { 
  Wrench, 
  Home, 
  Car, 
  Scissors, 
  Paintbrush, 
  TreePine,
  Camera,
  GraduationCap,
  Heart,
  Dumbbell,
  Music,
  Utensils,
  ChevronRight
} from 'lucide-react'

const categories = [
  {
    name: 'Reparações',
    icon: Wrench,
    services: ['Eletricista', 'Canalizador', 'Carpinteiro', 'Serralheiro'],
    color: 'bg-blue-100 text-blue-600',
    searchQuery: 'Reparações'
  },
  {
    name: 'Casa e Jardim',
    icon: Home,
    services: ['Limpeza', 'Jardinagem', 'Pintor', 'Decorador'],
    color: 'bg-green-100 text-green-600',
    searchQuery: 'Casa e Jardim'
  },
  {
    name: 'Automóvel',
    icon: Car,
    services: ['Mecânico', 'Pintura Auto', 'Vidros', 'Pneus'],
    color: 'bg-gray-100 text-gray-600',
    searchQuery: 'Automóvel'
  },
  {
    name: 'Beleza e Bem-estar',
    icon: Scissors,
    services: ['Cabeleireiro', 'Estética', 'Massagem', 'Manicure'],
    color: 'bg-pink-100 text-pink-600',
    searchQuery: 'Beleza e Bem-estar'
  },
  {
    name: 'Arte e Design',
    icon: Paintbrush,
    services: ['Design Gráfico', 'Fotógrafo', 'Arte', 'Tatuagem'],
    color: 'bg-purple-100 text-purple-600',
    searchQuery: 'Arte e Design'
  },
  {
    name: 'Jardinagem',
    icon: TreePine,
    services: ['Paisagismo', 'Manutenção', 'Plantas', 'Irrigação'],
    color: 'bg-emerald-100 text-emerald-600',
    searchQuery: 'Jardinagem'
  },
  {
    name: 'Fotografia',
    icon: Camera,
    services: ['Eventos', 'Retratos', 'Produto', 'Drone'],
    color: 'bg-amber-100 text-amber-600',
    searchQuery: 'Fotografia'
  },
  {
    name: 'Educação',
    icon: GraduationCap,
    services: ['Explicações', 'Formação', 'Idiomas', 'Música'],
    color: 'bg-indigo-100 text-indigo-600',
    searchQuery: 'Educação'
  },
  {
    name: 'Saúde',
    icon: Heart,
    services: ['Fisioterapia', 'Nutrição', 'Psicologia', 'Terapias'],
    color: 'bg-red-100 text-red-600',
    searchQuery: 'Saúde'
  },
  {
    name: 'Desporto',
    icon: Dumbbell,
    services: ['Personal Trainer', 'Yoga', 'Pilates', 'Natação'],
    color: 'bg-orange-100 text-orange-600',
    searchQuery: 'Desporto'
  },
  {
    name: 'Entretenimento',
    icon: Music,
    services: ['DJ', 'Animação', 'Música', 'Eventos'],
    color: 'bg-yellow-100 text-yellow-600',
    searchQuery: 'Entretenimento'
  },
  {
    name: 'Gastronomia',
    icon: Utensils,
    services: ['Catering', 'Chef', 'Pastelaria', 'Sommelier'],
    color: 'bg-rose-100 text-rose-600',
    searchQuery: 'Gastronomia'
  }
]

export default function ServiceCategories() {
  const router = useRouter()

  const handleCategoryClick = (searchQuery: string) => {
    router.push(`/search?service=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Serviços por Categoria
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encontre profissionais especializados em mais de 500 tipos de serviços, 
            organizados por categoria para facilitar a sua busca.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.searchQuery)}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-200 w-full text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${category.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                
                <div className="space-y-1">
                  {category.services.slice(0, 3).map((service) => (
                    <p key={service} className="text-sm text-gray-600">
                      {service}
                    </p>
                  ))}
                  {category.services.length > 3 && (
                    <p className="text-sm text-primary-600 font-medium">
                      +{category.services.length - 3} mais
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/search')}
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            Ver Todos os Serviços
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </section>
  )
}
