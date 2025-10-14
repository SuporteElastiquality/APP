import { Search, MessageCircle, CheckCircle, Star } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: '1. Descreva o seu projeto',
    description: 'Conte-nos que serviço precisa e onde está localizado. Seja específico para receber melhores propostas.',
    color: 'bg-primary-100 text-primary-600'
  },
  {
    icon: MessageCircle,
    title: '2. Receba propostas',
    description: 'Profissionais interessados enviarão propostas personalizadas com preços e prazos.',
    color: 'bg-secondary-100 text-secondary-600'
  },
  {
    icon: CheckCircle,
    title: '3. Escolha o melhor',
    description: 'Compare propostas, avalie perfis e escolha o profissional que melhor se adequa ao seu projeto.',
    color: 'bg-success-100 text-success-600'
  },
  {
    icon: Star,
    title: '4. Avalie o serviço',
    description: 'Após a conclusão, avalie o profissional para ajudar outros clientes a fazerem a melhor escolha.',
    color: 'bg-warning-100 text-warning-600'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            É simples e rápido encontrar o profissional perfeito para o seu projeto. 
            Siga estes 4 passos e tenha o trabalho realizado com qualidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent transform translate-x-4"></div>
                )}
                
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className={`inline-flex p-4 rounded-full ${step.color} mb-4`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">24h</div>
              <p className="text-gray-600">Tempo médio para receber propostas</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">3-5</div>
              <p className="text-gray-600">Propostas que receberá em média</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
              <p className="text-gray-600">Taxa de satisfação dos clientes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
