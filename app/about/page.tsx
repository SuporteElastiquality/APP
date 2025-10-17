import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Users, Award, MapPin, Heart, Target, Lightbulb, Shield, Clock } from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    icon: Users,
    value: '50,000+',
    label: 'Profissionais Cadastrados',
    description: 'Em todo o território português'
  },
  {
    icon: Award,
    value: '98%',
    label: 'Taxa de Satisfação',
    description: 'Clientes satisfeitos com o serviço'
  },
  {
    icon: MapPin,
    value: '308',
    label: 'Concelhos Cobertos',
    description: 'Em Portugal Continental e Ilhas'
  },
  {
    icon: Heart,
    value: '100,000+',
    label: 'Serviços Realizados',
    description: 'Projetos concluídos com sucesso'
  }
]

const values = [
  {
    icon: Target,
    title: 'Missão',
    description: 'Conectar clientes com os melhores profissionais de serviços, facilitando o acesso a soluções de qualidade em todo Portugal.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Lightbulb,
    title: 'Visão',
    description: 'Ser a principal plataforma de serviços em Portugal, reconhecida pela qualidade, transparência e inovação.',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    icon: Shield,
    title: 'Valores',
    description: 'Confiança, transparência, credibilidade e inovação.',
    color: 'bg-green-100 text-green-600'
  }
]

const team = [
  {
    name: 'João Silva',
    role: 'CEO & Fundador',
    description: 'Mais de 15 anos de experiência em tecnologia e mercado de serviços.',
    image: null
  },
  {
    name: 'Maria Santos',
    role: 'CTO',
    description: 'Especialista em desenvolvimento de plataformas digitais e experiência do usuário.',
    image: null
  },
  {
    name: 'Pedro Costa',
    role: 'Diretor de Operações',
    description: 'Responsável pela qualidade dos serviços e satisfação dos clientes.',
    image: null
  },
  {
    name: 'Ana Rodrigues',
    role: 'Diretora de Marketing',
    description: 'Especialista em comunicação e crescimento de comunidades online.',
    image: null
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Sobre a Elastiquality
              </h1>
              <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                Somos a plataforma líder em Portugal para conectar clientes com profissionais 
                de serviços, revolucionando a forma como as pessoas encontram soluções para suas necessidades.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Nossa História
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    A Elastiquality nasceu em 2020 com uma visão simples mas poderosa: 
                    democratizar o acesso a serviços de qualidade em Portugal.
                  </p>
                  <p>
                    Observamos que muitas pessoas tinham dificuldade em encontrar profissionais 
                    confiáveis para resolver suas necessidades do dia a dia, enquanto muitos 
                    profissionais talentosos lutavam para encontrar clientes.
                  </p>
                  <p>
                    Hoje, somos a maior plataforma de serviços do país, conectando mais de 
                    50.000 profissionais com milhares de clientes em todos os 308 concelhos 
                    de Portugal.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-xl p-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary-600 mb-2">2020</div>
                  <p className="text-gray-600 mb-6">Fundação da Elastiquality</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">Primeiros 100 profissionais</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">Expansão para todo o país</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">50.000+ profissionais cadastrados</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex p-4 bg-primary-100 rounded-full mb-4">
                      <IconComponent className="w-8 h-8 text-primary-600" />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                    <div className="text-sm text-gray-600">{stat.description}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Nossos Princípios
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Guiados por valores sólidos e uma visão clara do futuro
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <div key={index} className="text-center p-8 bg-gray-50 rounded-xl">
                    <div className={`inline-flex p-4 rounded-full ${value.color} mb-6`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Nossa Equipe
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Conheça as pessoas por trás da Elastiquality
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Foto</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Por que Escolher a Elastiquality?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Oferecemos uma experiência única e segura para clientes e profissionais
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <Shield className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Segurança Garantida
                </h3>
                <p className="text-gray-600">
                  Todos os profissionais são verificados e possuem seguros adequados. 
                  Sua tranquilidade é nossa prioridade.
                </p>
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <Clock className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Resposta Rápida
                </h3>
                <p className="text-gray-600">
                  Receba propostas em até 24 horas, muitas vezes em poucas horas. 
                  Não perca tempo procurando.
                </p>
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <Award className="w-12 h-12 text-yellow-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Qualidade Comprovada
                </h3>
                <p className="text-gray-600">
                  Sistema de avaliações transparente e profissionais com histórico 
                  comprovado de excelência.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Junte-se à Nossa Comunidade
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Seja cliente ou profissional, faça parte da maior plataforma de serviços de Portugal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Começar Agora
              </Link>
              <Link
                href="/contact"
                className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Entre em Contato
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
