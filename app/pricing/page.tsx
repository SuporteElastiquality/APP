import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Check, Euro, Users, Star } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Cliente',
    price: 'Grátis',
    description: 'Para quem precisa de serviços',
    features: [
      'Acesso a milhares de profissionais',
      'Receba até 5 propostas',
      'Sistema de avaliações',
      'Chat direto com profissionais',
      'Suporte 24/7'
    ],
    cta: 'Começar Grátis',
    popular: false,
    color: 'bg-primary-600'
  },
  {
    name: 'Profissional Básico',
    price: '€9.99',
    period: '/mês',
    description: 'Para profissionais que querem começar',
    features: [
      'Até 10 solicitações por mês',
      'Perfil profissional destacado',
      'Sistema de avaliações',
      'Chat ilimitado',
      'Relatórios básicos',
      'Suporte por email'
    ],
    cta: 'Começar Agora',
    popular: true,
    color: 'bg-secondary-600'
  },
  {
    name: 'Profissional Premium',
    price: '€19.99',
    period: '/mês',
    description: 'Para profissionais estabelecidos',
    features: [
      'Solicitações ilimitadas',
      'Perfil premium destacado',
      'Prioridade nas buscas',
      'Chat ilimitado',
      'Relatórios avançados',
      'Suporte prioritário',
      'Certificação verificada',
      'Moedas Elastiquality inclusas'
    ],
    cta: 'Upgrade Agora',
    popular: false,
    color: 'bg-success-600'
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Preços Transparentes
              </h1>
              <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                Para clientes é sempre grátis. Para profissionais, 
                escolha o plano que melhor se adequa ao seu negócio.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div key={index} className={`relative bg-white rounded-xl shadow-lg border-2 ${
                  plan.popular ? 'border-secondary-500' : 'border-gray-200'
                } overflow-hidden`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-secondary-500 text-white px-4 py-1 text-sm font-medium">
                      Mais Popular
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                      
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        {plan.period && (
                          <span className="text-gray-600 ml-1">{plan.period}</span>
                        )}
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className={`w-full ${plan.color} hover:opacity-90 text-white font-medium py-3 px-6 rounded-lg transition-opacity`}>
                      {plan.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Perguntas Frequentes
              </h2>
              <p className="text-xl text-gray-600">
                Tire suas dúvidas sobre nossos preços
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Por que é grátis para clientes?
                </h3>
                <p className="text-gray-600">
                  Acreditamos que encontrar o profissional certo deve ser sempre grátis. 
                  Nossa receita vem dos profissionais que querem destaque na plataforma.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Posso cancelar a qualquer momento?
                </h3>
                <p className="text-gray-600">
                  Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas ou penalidades.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  O que são as Moedas Elastiquality?
                </h3>
                <p className="text-gray-600">
                  São créditos que os profissionais usam para ver detalhes dos clientes e 
                  fazer propostas. Incluídas no plano Premium.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Como funciona o pagamento?
                </h3>
                <p className="text-gray-600">
                  Aceitamos cartões de crédito e débito. O pagamento é mensal e renovado automaticamente.
                </p>
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
              Junte-se a milhares de profissionais que já encontraram sucesso na nossa plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Cadastrar-se Agora
              </Link>
              <Link
                href="/contact"
                className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Falar com Vendas
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
