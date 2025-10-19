import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Check, Euro, Users, Star, CreditCard, Shield, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'

const qualityPackages = [
  {
    name: 'Única',
    quality: 1,
    price: 1.00,
    discount: 0,
    costPerQuality: 1.00,
    description: 'Perfeito para testar',
    color: 'bg-gray-600'
  },
  {
    name: 'Básico',
    quality: 10,
    price: 9.90,
    discount: 1,
    costPerQuality: 0.99,
    description: 'Ideal para começar',
    color: 'bg-blue-600'
  },
  {
    name: 'Padrão',
    quality: 25,
    price: 23.75,
    discount: 5,
    costPerQuality: 0.95,
    popular: true,
    description: 'Mais popular',
    color: 'bg-primary-600'
  },
  {
    name: 'Premium',
    quality: 50,
    price: 45.00,
    discount: 10,
    costPerQuality: 0.90,
    description: 'Melhor valor',
    color: 'bg-green-600'
  },
  {
    name: 'Pro',
    quality: 100,
    price: 85.00,
    discount: 15,
    costPerQuality: 0.85,
    description: 'Máxima economia',
    color: 'bg-purple-600'
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
              <div className="text-center mb-6">
                <h1 className="text-4xl lg:text-5xl font-bold">
                  Sistema de Quality
                </h1>
              </div>
              <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                Para clientes é sempre grátis. Profissionais pagam apenas pelas oportunidades de contato que desejam desbloquear.
              </p>
              
              {/* Vantagens do Sistema */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">ROI Alto</h3>
                  <p className="text-primary-100 text-sm">
                    Investimento baixo com retorno potencial de 8.400%+
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <Shield className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Sem Expiracão</h3>
                  <p className="text-primary-100 text-sm">
                    Suas quality não expiram e podem ser usadas quando quiser
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <CreditCard className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Reembolso 30 dias</h3>
                  <p className="text-primary-100 text-sm">
                    Garantia de reembolso para quality não utilizadas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Como Funciona
              </h2>
              <p className="text-xl text-gray-600">
                Sistema simples e transparente para conectar profissionais com clientes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Cliente Publica Serviço</h3>
                <p className="text-gray-600 text-sm">
                  Clientes descrevem o que precisam e profissionais interessados podem ver
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Profissional Desbloqueia Contato</h3>
                <p className="text-gray-600 text-sm">
                  Profissionais usam 1 quality para ver dados completos do cliente
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Conversa e Negocia</h3>
                <p className="text-gray-600 text-sm">
                  Chat direto na plataforma para negociar e fechar o serviço
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pacotes de Quality
              </h2>
              <p className="text-xl text-gray-600">
                Escolha o pacote que melhor se adequa ao seu volume de negócios
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {qualityPackages.map((pkg, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-lg flex flex-col ${
                    pkg.popular 
                      ? 'border-primary-500 ring-2 ring-primary-200' 
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Mais Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <div className="text-center mb-2">
                        <span className="text-3xl font-bold text-primary-600">{pkg.quality}</span>
                        <span className="text-gray-600 ml-1">quality</span>
                      </div>
                      <p className="text-sm text-gray-500">{pkg.description}</p>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="text-2xl font-bold text-gray-900">€{pkg.price.toFixed(2)}</div>
                      {pkg.discount > 0 && (
                        <div className="text-sm text-green-600 font-medium">
                          {pkg.discount}% de desconto
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        €{pkg.costPerQuality.toFixed(2)} por quality
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <Link
                        href="/quality"
                        className={`w-full ${pkg.color} hover:opacity-90 text-white font-medium py-3 px-6 rounded-lg transition-opacity block text-center`}
                      >
                        Comprar Agora
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Free for Clients */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-green-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Para Clientes é Sempre Grátis
                </h2>
              </div>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Clientes não pagam nada na plataforma. Publicam seus serviços gratuitamente e recebem propostas de profissionais qualificados.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <Check className="w-6 h-6 text-green-500 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Publicação Grátis</h3>
                  <p className="text-gray-600 text-sm">Publique quantos serviços precisar</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <Check className="w-6 h-6 text-green-500 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Propostas Ilimitadas</h3>
                  <p className="text-gray-600 text-sm">Receba propostas de vários profissionais</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <Check className="w-6 h-6 text-green-500 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Chat Ilimitado</h3>
                  <p className="text-gray-600 text-sm">Converse diretamente com profissionais</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <Check className="w-6 h-6 text-green-500 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Suporte 24/7</h3>
                  <p className="text-gray-600 text-sm">Ajuda sempre disponível</p>
                </div>
              </div>
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
                  Nossa receita vem dos profissionais que compram quality para desbloquear contatos.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Como funcionam as quality?
                </h3>
                <p className="text-gray-600">
                  Profissionais compram pacotes de quality e usam 1 quality para desbloquear os dados de contato de um cliente interessado em seus serviços.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  As quality expiram?
                </h3>
                <p className="text-gray-600">
                  Não! Suas quality não expiram e podem ser usadas quando quiser. Você tem total controle sobre quando usar seus créditos.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Posso obter reembolso?
                </h3>
                <p className="text-gray-600">
                  Sim! Oferecemos reembolso em 30 dias para quality não utilizadas. Processo automático via Stripe.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Como funciona o pagamento?
                </h3>
                <p className="text-gray-600">
                  Aceitamos cartões de crédito e débito através do Stripe. Pagamento único por pacote de quality, sem assinaturas mensais.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Qual o retorno do investimento?
                </h3>
                <p className="text-gray-600">
                  Profissionais relatam ROI de 8.400%+. Com €23,75 (25 quality) você pode desbloquear 25 clientes e potencialmente gerar €2.000+ em receita.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Example */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exemplo de Retorno do Investimento
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Veja como um profissional de pintura pode transformar €23,75 em €2.000+
            </p>
            
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Euro className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Investimento</h3>
                  <div className="text-2xl font-bold text-red-600">€23,75</div>
                  <p className="text-sm text-gray-500">Pacote Padrão (25 moedas)</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contatos Desbloqueados</h3>
                  <div className="text-2xl font-bold text-blue-600">25 clientes</div>
                  <p className="text-sm text-gray-500">€0,95 por cliente</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Receita Potencial</h3>
                  <div className="text-2xl font-bold text-green-600">€2.000+</div>
                  <p className="text-sm text-gray-500">ROI: 8.400%+</p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Como funciona na prática:</h4>
                <p className="text-green-800 text-sm">
                  Com 25 quality, você pode desbloquear 25 clientes interessados em pintura. 
                  Se apenas 10% (2,5 clientes) contratarem seus serviços por €800 cada, 
                  você já terá recuperado o investimento e gerado lucro significativo.
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
                href="/quality"
                className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Comprar Quality
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
