'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Star, Euro, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getAllCategories } from '@/lib/categories'

// Dados de exemplo de serviços por categoria
const servicesByCategory = {
  'construcao-reforma': [
    { id: 1, name: 'Pedreiro', description: 'Construção e reparação de alvenaria', rating: 4.8, reviews: 156, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&crop=center' },
    { id: 2, name: 'Eletricista', description: 'Instalações elétricas e reparações', rating: 4.9, reviews: 203, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop&crop=center' },
    { id: 3, name: 'Canalizador', description: 'Reparações de canalizações', rating: 4.7, reviews: 89, image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop&crop=center' },
    { id: 4, name: 'Pintor', description: 'Pintura de interiores e exteriores', rating: 4.6, reviews: 97, image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop&crop=center' },
    { id: 5, name: 'Gesseiro', description: 'Instalação e reparação de gesso', rating: 4.5, reviews: 78, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&crop=center' },
    { id: 6, name: 'Azulejista', description: 'Colocação e reparação de azulejos', rating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop&crop=center' },
    { id: 7, name: 'Instalador de Pladur', description: 'Instalação de paredes de pladur', rating: 4.4, reviews: 65, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&crop=center' },
    { id: 8, name: 'Marcenaria', description: 'Móveis sob medida e reparações', rating: 4.7, reviews: 112, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&crop=center' },
    { id: 9, name: 'Carpinteiro', description: 'Trabalhos em madeira', rating: 4.6, reviews: 88, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&crop=center' }
  ],
  'servicos-domesticos': [
    { id: 1, name: 'Engomadeira', description: 'Serviços de engomaria', rating: 4.8, reviews: 45, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center' },
    { id: 2, name: 'Cozinheira', description: 'Preparação de refeições', rating: 4.9, reviews: 67, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center' },
    { id: 3, name: 'Ama (Babysitter)', description: 'Cuidado de crianças', rating: 4.7, reviews: 89, image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop&crop=center' },
    { id: 4, name: 'Cuidador de idosos', description: 'Assistência a idosos', rating: 4.8, reviews: 123, image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center' },
    { id: 5, name: 'Lavanderia', description: 'Serviços de lavanderia', rating: 4.6, reviews: 56, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center' }
  ],
  'limpeza': [
    { id: 1, name: 'Limpeza Residencial', description: 'Limpeza de casas e apartamentos', rating: 4.8, reviews: 234, image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop&crop=center' },
    { id: 2, name: 'Limpeza Pós-obra', description: 'Limpeza após construção', rating: 4.7, reviews: 89, image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop&crop=center' },
    { id: 3, name: 'Limpeza Comercial', description: 'Limpeza de escritórios e lojas', rating: 4.6, reviews: 156, image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop&crop=center' },
    { id: 4, name: 'Limpeza de Vidros', description: 'Limpeza especializada de vidros', rating: 4.9, reviews: 78, image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop&crop=center' },
    { id: 5, name: 'Limpeza de Estofos', description: 'Limpeza de sofás e cadeiras', rating: 4.5, reviews: 67, image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop&crop=center' }
  ],
  'tecnologia-informatica': [
    { id: 1, name: 'Suporte Técnico', description: 'Assistência técnica em informática', rating: 4.8, reviews: 189, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center' },
    { id: 2, name: 'Formatação de Computadores', description: 'Formatação e manutenção', rating: 4.7, reviews: 145, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center' },
    { id: 3, name: 'Instalação de Redes', description: 'Wi-Fi e cabeamento', rating: 4.9, reviews: 98, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center' },
    { id: 4, name: 'Desenvolvimento de Sites', description: 'Criação de websites', rating: 4.6, reviews: 76, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center' },
    { id: 5, name: 'Criação de Aplicativos', description: 'Desenvolvimento de apps', rating: 4.8, reviews: 54, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center' },
    { id: 6, name: 'Marketing Digital', description: 'SEO e redes sociais', rating: 4.7, reviews: 87, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center' }
  ],
  'automotivos': [
    { id: 1, name: 'Mecânica', description: 'Reparações automóveis', rating: 4.8, reviews: 178, image: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=300&fit=crop&crop=center' },
    { id: 2, name: 'Eletricista Auto', description: 'Sistemas elétricos automóveis', rating: 4.7, reviews: 123, image: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=300&fit=crop&crop=center' },
    { id: 3, name: 'Chapa e Pintura', description: 'Reparação de carroçaria', rating: 4.6, reviews: 89, image: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=300&fit=crop&crop=center' },
    { id: 4, name: 'Mudança de Óleo', description: 'Serviços de manutenção', rating: 4.9, reviews: 234, image: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=300&fit=crop&crop=center' },
    { id: 5, name: 'Serviço de Reboque', description: 'Reboque e assistência', rating: 4.8, reviews: 156, image: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=300&fit=crop&crop=center' },
    { id: 6, name: 'Higienização Interna', description: 'Limpeza automóvel', rating: 4.5, reviews: 67, image: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=300&fit=crop&crop=center' }
  ],
  'beleza-estetica': [
    { id: 1, name: 'Cabeleireiro', description: 'Cortes e penteados', rating: 4.8, reviews: 234, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&crop=center' },
    { id: 2, name: 'Maquiador(a)', description: 'Maquilhagem profissional', rating: 4.7, reviews: 156, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&crop=center' },
    { id: 3, name: 'Manicure e Pedicure', description: 'Cuidados das unhas', rating: 4.9, reviews: 189, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&crop=center' },
    { id: 4, name: 'Unhas de Gel', description: 'Aplicação de gel', rating: 4.6, reviews: 123, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&crop=center' },
    { id: 5, name: 'Massagens', description: 'Massagens relaxamento', rating: 4.8, reviews: 98, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&crop=center' },
    { id: 6, name: 'Depilação', description: 'Serviços de depilação', rating: 4.7, reviews: 145, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&crop=center' }
  ],
  'saude-bem-estar': [
    { id: 1, name: 'Fisioterapia', description: 'Tratamentos fisioterapêuticos', rating: 4.9, reviews: 167, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center' },
    { id: 2, name: 'Nutricionista', description: 'Consultoria nutricional', rating: 4.8, reviews: 134, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center' },
    { id: 3, name: 'Personal Trainer', description: 'Treino personalizado', rating: 4.7, reviews: 189, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center' },
    { id: 4, name: 'Psicólogo', description: 'Acompanhamento psicológico', rating: 4.8, reviews: 98, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center' },
    { id: 5, name: 'Acupuntura', description: 'Tratamentos de acupuntura', rating: 4.6, reviews: 76, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center' }
  ],
  'transporte-logistica': [
    { id: 1, name: 'Transporte e Mudanças', description: 'Serviços de mudança', rating: 4.8, reviews: 145, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center' },
    { id: 2, name: 'Serviço de Entregas', description: 'Entregas rápidas', rating: 4.7, reviews: 123, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center' },
    { id: 3, name: 'Transporte Executivo', description: 'Transporte de executivos', rating: 4.9, reviews: 89, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center' },
    { id: 4, name: 'Transporte Escolar', description: 'Transporte de crianças', rating: 4.8, reviews: 67, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center' },
    { id: 5, name: 'Aluguer de Viaturas', description: 'Aluguer de veículos', rating: 4.6, reviews: 98, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center' }
  ],
  'educacao': [
    { id: 1, name: 'Aulas Particulares', description: 'Matemática, inglês, etc.', rating: 4.8, reviews: 234, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop&crop=center' },
    { id: 2, name: 'Reforço Escolar', description: 'Apoio ao estudo', rating: 4.7, reviews: 156, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop&crop=center' },
    { id: 3, name: 'Tradução', description: 'Serviços de tradução', rating: 4.9, reviews: 78, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop&crop=center' }
  ],
  'eventos-festas': [
    { id: 1, name: 'Buffet', description: 'Serviços de catering', rating: 4.8, reviews: 189, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop&crop=center' },
    { id: 2, name: 'Empregado de Mesa', description: 'Serviço de mesa', rating: 4.7, reviews: 145, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop&crop=center' },
    { id: 3, name: 'DJ', description: 'Serviços de som', rating: 4.6, reviews: 123, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop&crop=center' },
    { id: 4, name: 'Fotógrafo', description: 'Fotografia de eventos', rating: 4.9, reviews: 167, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop&crop=center' },
    { id: 5, name: 'Decoração de Festas', description: 'Decoração de eventos', rating: 4.8, reviews: 98, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop&crop=center' }
  ],
  'administrativos-financeiros': [
    { id: 1, name: 'Consultoria Contábil', description: 'Serviços contabilísticos', rating: 4.8, reviews: 134, image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center' },
    { id: 2, name: 'Declaração de IRS', description: 'Preparação de IRS', rating: 4.9, reviews: 189, image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center' },
    { id: 3, name: 'Consultoria Jurídica', description: 'Aconselhamento legal', rating: 4.7, reviews: 156, image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center' },
    { id: 4, name: 'Planejamento Financeiro', description: 'Gestão financeira', rating: 4.8, reviews: 98, image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center' },
    { id: 5, name: 'Recursos Humanos', description: 'Serviços de RH', rating: 4.6, reviews: 76, image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center' }
  ],
  'criativos-design': [
    { id: 1, name: 'Design Gráfico', description: 'Logotipos e identidade visual', rating: 4.8, reviews: 167, image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop&crop=center' },
    { id: 2, name: 'Criação de Conteúdo', description: 'Conteúdo para redes sociais', rating: 4.7, reviews: 123, image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop&crop=center' },
    { id: 3, name: 'Edição de Vídeo', description: 'Produção e edição', rating: 4.9, reviews: 89, image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop&crop=center' },
    { id: 4, name: 'Fotografia Profissional', description: 'Sessões fotográficas', rating: 4.8, reviews: 145, image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop&crop=center' },
    { id: 5, name: 'Redação Publicitária', description: 'Textos publicitários', rating: 4.6, reviews: 67, image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop&crop=center' }
  ],
  'costura-alfaiataria': [
    { id: 1, name: 'Fazer Bainhas', description: 'Bainhas em calças, saias e vestidos', rating: 4.9, reviews: 89, image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop&crop=center' },
    { id: 2, name: 'Apertar/Alargar Peças', description: 'Ajustes em cinturas, laterais e ombros', rating: 4.8, reviews: 76, image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop&crop=center' },
    { id: 3, name: 'Encurtar/Alongar Mangas', description: 'Ajuste de comprimento de mangas', rating: 4.7, reviews: 54, image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop&crop=center' },
    { id: 4, name: 'Reparação de Fechos', description: 'Troca e reparação de zíperes', rating: 4.9, reviews: 98, image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop&crop=center' },
    { id: 5, name: 'Remendar Rasgos', description: 'Coser e remendar rasgos e buracos', rating: 4.8, reviews: 67, image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop&crop=center' },
    { id: 6, name: 'Troca de Forros', description: 'Substituição de forros em casacos e saias', rating: 4.6, reviews: 43, image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop&crop=center' },
    { id: 7, name: 'Substituição de Botões', description: 'Troca de botões, colchetes e molas', rating: 4.7, reviews: 56, image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop&crop=center' },
    { id: 8, name: 'Cerzidos', description: 'Reparação de pequenos danos em malhas e tecidos', rating: 4.8, reviews: 72, image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop&crop=center' }
  ]
}

export default function CategoryPage() {
  const params = useParams()
  const [category, setCategory] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [visibleServices, setVisibleServices] = useState(6)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const categoryId = params.category as string
    const categories = getAllCategories()
    const foundCategory = categories.find(cat => cat.id === categoryId)
    
    if (foundCategory) {
      setCategory(foundCategory)
      const categoryServices = servicesByCategory[categoryId as keyof typeof servicesByCategory] || []
      setServices(categoryServices)
    }
    setLoading(false)
  }, [params.category])

  const loadMoreServices = () => {
    setVisibleServices(prev => prev + 6)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Categoria não encontrada</h1>
            <Link href="/services" className="text-primary-600 hover:text-primary-700">
              Voltar aos serviços
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Header */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <Link 
                href="/services" 
                className="flex items-center text-primary-100 hover:text-white transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </Link>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4">{category.icon}</div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                {category.name}
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                {category.description}
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, visibleServices).map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-primary-600 font-medium">{category.name}</span>
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
                        href={`/search?service=${encodeURIComponent(service.name)}&category=${category.id}`}
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
            {visibleServices < services.length && (
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
      </main>
      
      <Footer />
    </div>
  )
}
