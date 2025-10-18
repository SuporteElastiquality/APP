'use client'

import { useRouter } from 'next/navigation'
import { 
  Wrench, 
  Home, 
  Car, 
  Scissors, 
  Paintbrush, 
  Sparkles,
  Camera,
  GraduationCap,
  Heart,
  Truck,
  Music,
  Briefcase,
  ChevronRight
} from 'lucide-react'

const categories = [
  {
    name: 'Serviços de Construção e Remodelação',
    icon: Wrench,
    services: ['Eletricista', 'Canalizador', 'Pintor', 'Gesseiro', 'Azulejista', 'Carpinteiro'],
    color: 'bg-blue-100 text-blue-600',
    searchQuery: 'construcao-reforma'
  },
  {
    name: 'Serviços Domésticos',
    icon: Home,
    services: ['Engomadeira', 'Cozinheira', 'Ama (Babysitter)', 'Cuidador de idosos', 'Lavanderia'],
    color: 'bg-green-100 text-green-600',
    searchQuery: 'servicos-domesticos'
  },
  {
    name: 'Serviços de Limpeza',
    icon: Sparkles,
    services: ['Limpeza Residencial', 'Limpeza Pós-obra', 'Limpeza Comercial', 'Limpeza de Vidros'],
    color: 'bg-cyan-100 text-cyan-600',
    searchQuery: 'limpeza'
  },
  {
    name: 'Serviços de Tecnologia e Informática',
    icon: Paintbrush,
    services: ['Suporte Técnico', 'Formatação', 'Instalação de Redes', 'Desenvolvimento de Sites'],
    color: 'bg-purple-100 text-purple-600',
    searchQuery: 'tecnologia-informatica'
  },
  {
    name: 'Serviço Automóvel',
    icon: Car,
    services: ['Mecânica', 'Eletricista Auto', 'Chapa e Pintura', 'Mudança de Óleo'],
    color: 'bg-gray-100 text-gray-600',
    searchQuery: 'automotivos'
  },
  {
    name: 'Beleza e Estética',
    icon: Scissors,
    services: ['Cabeleireiro', 'Maquiador(a)', 'Manicure e Pedicure', 'Massagens'],
    color: 'bg-pink-100 text-pink-600',
    searchQuery: 'beleza-estetica'
  },
  {
    name: 'Serviços de Saúde e Bem-Estar',
    icon: Heart,
    services: ['Fisioterapia', 'Nutricionista', 'Personal Trainer', 'Psicólogo'],
    color: 'bg-red-100 text-red-600',
    searchQuery: 'saude-bem-estar'
  },
  {
    name: 'Serviços de Transporte e Logística',
    icon: Truck,
    services: ['Transporte e Mudanças', 'Serviço de Entregas', 'Transporte Executivo', 'Aluguer de Viaturas'],
    color: 'bg-orange-100 text-orange-600',
    searchQuery: 'transporte-logistica'
  },
  {
    name: 'Educação',
    icon: GraduationCap,
    services: ['Aulas Particulares', 'Reforço Escolar', 'Tradução'],
    color: 'bg-indigo-100 text-indigo-600',
    searchQuery: 'educacao'
  },
  {
    name: 'Eventos e Festas',
    icon: Music,
    services: ['Buffet', 'Empregado de Mesa', 'DJ', 'Fotógrafo', 'Decoração'],
    color: 'bg-yellow-100 text-yellow-600',
    searchQuery: 'eventos-festas'
  },
  {
    name: 'Serviços Administrativos e Financeiros',
    icon: Briefcase,
    services: ['Consultoria Contábil', 'Declaração de IRS', 'Consultoria Jurídica', 'Planejamento Financeiro'],
    color: 'bg-amber-100 text-amber-600',
    searchQuery: 'administrativos-financeiros'
  },
  {
    name: 'Serviços Criativos e Design',
    icon: Camera,
    services: ['Design Gráfico', 'Criação de Conteúdo', 'Edição de Vídeo', 'Fotografia Profissional'],
    color: 'bg-rose-100 text-rose-600',
    searchQuery: 'criativos-design'
  }
]

export default function ServiceCategories() {
  const router = useRouter()

  const handleCategoryClick = (searchQuery: string) => {
    router.push(`/services/${searchQuery}`)
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
