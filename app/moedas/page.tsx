'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import { Coins, CreditCard, Check, Star, TrendingUp, Shield } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

interface CoinPackage {
  id: string
  name: string
  coins: number
  price: number
  discount: number
  costPerCoin: number
  popular?: boolean
  description: string
}

const coinPackages: CoinPackage[] = [
  {
    id: 'single',
    name: 'Única',
    coins: 1,
    price: 1.00,
    discount: 0,
    costPerCoin: 1.00,
    description: 'Perfeito para testar'
  },
  {
    id: 'basic',
    name: 'Básico',
    coins: 10,
    price: 9.90,
    discount: 1,
    costPerCoin: 0.99,
    description: 'Ideal para começar'
  },
  {
    id: 'standard',
    name: 'Padrão',
    coins: 25,
    price: 23.75,
    discount: 5,
    costPerCoin: 0.95,
    popular: true,
    description: 'Mais popular'
  },
  {
    id: 'premium',
    name: 'Premium',
    coins: 50,
    price: 45.00,
    discount: 10,
    costPerCoin: 0.90,
    description: 'Melhor valor'
  },
  {
    id: 'pro',
    name: 'Pro',
    coins: 100,
    price: 85.00,
    discount: 15,
    costPerCoin: 0.85,
    description: 'Máxima economia'
  }
]

export default function MoedasPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null)
  const [loading, setLoading] = useState(false)
  const [userCoins, setUserCoins] = useState(0)

  // Verificar se o usuário está logado e é profissional
  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user?.userType !== 'PROFESSIONAL') {
      router.push('/')
      return
    }

    // Carregar moedas do usuário
    loadUserCoins()
  }, [session, status, router])

  const loadUserCoins = async () => {
    try {
      const response = await fetch('/api/coins/balance')
      if (response.ok) {
        const data = await response.json()
        setUserCoins(data.balance)
      }
    } catch (error) {
      console.error('Erro ao carregar moedas:', error)
    }
  }

  const handlePurchase = async (coinPackage: CoinPackage) => {
    if (!session?.user) return

    setLoading(true)
    try {
      // Criar payment intent
      const response = await fetch('/api/coins/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: coinPackage.id,
          amount: coinPackage.price,
          coins: coinPackage.coins
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao processar pagamento')
      }

      const { clientSecret } = await response.json()

      // Inicializar Stripe
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (!stripe) {
        throw new Error('Stripe não inicializado')
      }

      // Confirmar pagamento
      const { error } = await stripe.confirmCardPayment(clientSecret)

      if (error) {
        throw new Error(error.message)
      }

      // Sucesso - atualizar moedas
      await loadUserCoins()
      alert(`Compra realizada com sucesso! Você recebeu ${coinPackage.coins} moedas.`)
      
    } catch (error) {
      console.error('Erro no pagamento:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Coins className="w-12 h-12 text-primary-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Sistema de Moedas</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desbloqueie contatos de clientes interessados em seus serviços. 
            Compre moedas e conecte-se com leads qualificados.
          </p>
          
          {/* Saldo atual */}
          <div className="mt-6 inline-flex items-center bg-primary-50 px-6 py-3 rounded-full">
            <Coins className="w-5 h-5 text-primary-600 mr-2" />
            <span className="text-lg font-semibold text-primary-700">
              Seu saldo: {userCoins} moedas
            </span>
          </div>
        </div>

        {/* Vantagens */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">ROI Alto</h3>
            <p className="text-gray-600 text-sm">
              Investimento baixo com retorno potencial de 8.400%+
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Sem Expiracão</h3>
            <p className="text-gray-600 text-sm">
              Suas moedas não expiram e podem ser usadas quando quiser
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Reembolso 30 dias</h3>
            <p className="text-gray-600 text-sm">
              Garantia de reembolso para moedas não utilizadas
            </p>
          </div>
        </div>

        {/* Pacotes de Moedas */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Escolha seu Pacote de Moedas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {coinPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-lg ${
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
                
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="flex items-center justify-center mb-2">
                      <Coins className="w-6 h-6 text-primary-600 mr-2" />
                      <span className="text-3xl font-bold text-primary-600">{pkg.coins}</span>
                      <span className="text-gray-600 ml-1">moedas</span>
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
                      €{pkg.costPerCoin.toFixed(2)} por moeda
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(pkg)}
                    disabled={loading}
                    className={`w-full ${
                      pkg.popular 
                        ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {loading ? 'Processando...' : 'Comprar Agora'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Como Funciona */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Como Funciona
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Compre Moedas</h3>
              <p className="text-gray-600 text-sm">
                Escolha um pacote e faça o pagamento seguro via Stripe
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Receba Instantaneamente</h3>
              <p className="text-gray-600 text-sm">
                Suas moedas são creditadas imediatamente na sua conta
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Desbloqueie Contatos</h3>
              <p className="text-gray-600 text-sm">
                Use 1 moeda para desbloquear dados de contato de clientes interessados
              </p>
            </div>
          </div>
        </div>

        {/* Exemplo de ROI */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Exemplo de Retorno do Investimento
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Profissional de Pintura</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Investimento</div>
                  <div className="font-bold text-red-600">€23,75</div>
                  <div className="text-xs text-gray-500">Pacote Padrão (25 moedas)</div>
                </div>
                <div>
                  <div className="text-gray-600">Contatos Desbloqueados</div>
                  <div className="font-bold text-blue-600">25 clientes</div>
                  <div className="text-xs text-gray-500">€0,95 por cliente</div>
                </div>
                <div>
                  <div className="text-gray-600">Receita Potencial</div>
                  <div className="font-bold text-green-600">€2.000+</div>
                  <div className="text-xs text-gray-500">ROI: 8.400%+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
