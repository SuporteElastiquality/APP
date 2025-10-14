import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, MessageCircle, CheckCircle, Star, ArrowRight, Clock, Euro, Shield } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: '1. Descreva o seu projeto',
    description: 'Conte-nos que serviço precisa e onde está localizado. Seja específico para receber melhores propostas.',
    details: [
      'Escolha a categoria do serviço',
      'Descreva detalhadamente o que precisa',
      'Defina o seu orçamento (opcional)',
      'Informe a localização exata'
    ],
    color: 'bg-primary-100 text-primary-600'
  },
  {
    icon: MessageCircle,
    title: '2. Receba propostas',
    description: 'Profissionais interessados enviarão propostas personalizadas com preços e prazos.',
    details: [
      'Receba até 5 propostas em 24h',
      'Compare preços e avaliações',
      'Leia comentários de outros clientes',
      'Verifique especialidades e experiência'
    ],
    color: 'bg-secondary-100 text-secondary-600'
  },
  {
    icon: CheckCircle,
    title: '3. Escolha o melhor',
    description: 'Compare propostas, avalie perfis e escolha o profissional que melhor se adequa ao seu projeto.',
    details: [
      'Compare todas as propostas recebidas',
      'Verifique certificações e seguros',
      'Entre em contato com o profissional',
      'Confirme todos os detalhes'
    ],
    color: 'bg-success-100 text-success-600'
  },
  {
    icon: Star,
    title: '4. Avalie o serviço',
    description: 'Após a conclusão, avalie o profissional para ajudar outros clientes a fazerem a melhor escolha.',
    details: [
      'Avalie a qualidade do trabalho',
      'Comente sobre a pontualidade',
      'Dê uma nota de 1 a 5 estrelas',
      'Ajude outros clientes na escolha'
    ],
    color: 'bg-warning-100 text-warning-600'
  }
]

const features = [
  {
    icon: Shield,
    title: 'Profissionais Verificados',
    description: 'Todos os profissionais passam por um processo rigoroso de verificação.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Clock,
    title: 'Resposta Rápida',
    description: 'Receba propostas em até 24 horas, muitas vezes em poucas horas.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Euro,
    title: 'Preços Transparentes',
    description: 'Compare preços facilmente e encontre a melhor relação qualidade/preço.',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    icon: Star,
    title: 'Avaliações Reais',
    description: 'Leia avaliações genuínas de outros clientes antes de decidir.',
    color: 'bg-purple-100 text-purple-600'
  }
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Como Funciona
              </h1>
              <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                É simples e rápido encontrar o profissional perfeito para o seu projeto. 
                Siga estes 4 passos e tenha o trabalho realizado com qualidade.
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Steps List */}
              <div className="space-y-8">
                {steps.map((step, index) => {
                  const IconComponent = step.icon
                  return (
                    <div key={index} className="flex space-x-6">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-full ${step.color} flex items-center justify-center`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {step.description}
                        </p>
                        
                        <ul className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                              <ArrowRight className="w-4 h-4 text-primary-600 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Visual Timeline */}
              <div className="relative">
                <div className="space-y-8">
                  {steps.map((step, index) => {
                    const IconComponent = step.icon
                    return (
                      <div key={index} className="relative">
                        <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center mx-auto shadow-lg`}>
                          <IconComponent className="w-10 h-10" />
                        </div>
                        
                        {index < steps.length - 1 && (
                          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-300"></div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Por que Escolher a Elastiquality?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Oferecemos uma plataforma segura, transparente e eficiente 
                para conectar clientes e profissionais.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="text-center">
                    <div className={`inline-flex p-4 rounded-full ${feature.color} mb-4`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Cronograma Típico
              </h2>
              <p className="text-xl text-gray-600">
                Veja quanto tempo leva cada etapa do processo
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Publicação da Solicitação</h3>
                      <span className="text-sm text-gray-500">Imediato</span>
                    </div>
                    <p className="text-gray-600">Descreva seu projeto e publique a solicitação</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Primeiras Propostas</h3>
                      <span className="text-sm text-gray-500">2-6 horas</span>
                    </div>
                    <p className="text-gray-600">Profissionais começam a enviar propostas</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-success-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Escolha do Profissional</h3>
                      <span className="text-sm text-gray-500">1-2 dias</span>
                    </div>
                    <p className="text-gray-600">Compare propostas e escolha o melhor profissional</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-warning-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Execução do Serviço</h3>
                      <span className="text-sm text-gray-500">Conforme acordado</span>
                    </div>
                    <p className="text-gray-600">Profissional executa o serviço conforme combinado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Milhares de clientes já encontraram os melhores profissionais através da nossa plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors">
                Solicitar um Serviço
              </button>
              <button className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-colors">
                Ver Serviços Disponíveis
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
