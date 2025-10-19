'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { User, MapPin, Phone, Mail, Settings, CreditCard, MessageCircle, Coins, TrendingUp } from 'lucide-react'

interface QualityBalance {
  balance: number
  recentTransactions: Array<{
    id: string
    amount: number
    type: string
    description: string
    source: string
    createdAt: string
  }>
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [qualityBalance, setQualityBalance] = useState<QualityBalance | null>(null)
  const [loadingBalance, setLoadingBalance] = useState(false)

  useEffect(() => {
    if (status === 'loading') return // Ainda carregando
    if (!session) {
      router.push('/auth/signin')
    } else if (session.user?.userType === 'PROFESSIONAL') {
      loadQualityBalance()
    }
  }, [session, status, router])

  const loadQualityBalance = async () => {
    setLoadingBalance(true)
    try {
      const response = await fetch('/api/user/quality-balance')
      if (response.ok) {
        const data = await response.json()
        setQualityBalance(data)
      }
    } catch (error) {
      console.error('Erro ao carregar saldo de quality:', error)
    } finally {
      setLoadingBalance(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const user = session.user

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header do Dashboard */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo, {user.name}!
            </h1>
            <p className="text-gray-600">
              Gerencie sua conta e serviços na plataforma Elastiquality
            </p>
          </div>

          {/* Cards de Informações */}
          <div className={`grid grid-cols-1 md:grid-cols-2 ${user.userType === 'CLIENT' ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-6 mb-8`}>
            <div 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow bg-white rounded-lg shadow-md border"
              onClick={() => router.push(user.userType === 'CLIENT' ? '/profile/client' : '/profile/professional')}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Perfil</h3>
                  <p className="text-sm text-gray-600">Gerencie suas informações</p>
                </div>
              </div>
            </div>

            {user.userType === 'PROFESSIONAL' && (
              <>
                <Card 
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push('/quality')}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Coins className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Quality</h3>
                      <p className="text-sm text-gray-600">
                        {loadingBalance ? 'Carregando...' : `${qualityBalance?.balance || 0} moedas`}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Pagamentos</h3>
                      <p className="text-sm text-gray-600">Histórico e métodos</p>
                    </div>
                  </div>
                </Card>
              </>
            )}

            <div 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow bg-white rounded-lg shadow-md border"
              onClick={() => router.push('/messages')}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mensagens</h3>
                  <p className="text-sm text-gray-600">Conversas ativas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Usuário */}
          <div className={`grid grid-cols-1 ${user.userType === 'PROFESSIONAL' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-8`}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Pessoais</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">Nome completo</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{user.email}</p>
                    <p className="text-sm text-gray-600">Email</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.userType === 'CLIENT' ? 'Cliente' : 'Profissional'}
                    </p>
                    <p className="text-sm text-gray-600">Tipo de usuário</p>
                  </div>
                </div>
              </div>
            </Card>

            {user.userType === 'PROFESSIONAL' && qualityBalance && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Histórico Quality</h2>
                <div className="space-y-3">
                  {qualityBalance.recentTransactions.length > 0 ? (
                    qualityBalance.recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString('pt-PT')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'CREDIT' ? '+' : '-'}{transaction.amount}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Nenhuma transação encontrada
                    </p>
                  )}
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="space-y-3">
                {user.userType === 'CLIENT' ? (
                  <>
                    <Button 
                      className="w-full justify-start"
                      onClick={() => router.push('/request-service')}
                    >
                      Solicitar Serviço
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => router.push('/profile/client/requests')}
                    >
                      Minhas Solicitações
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => router.push('/professionals')}
                    >
                      Encontrar Profissionais
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      className="w-full justify-start"
                      onClick={() => router.push('/search')}
                    >
                      Buscar Serviços
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => router.push('/quality')}
                    >
                      Sistema Quality
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => router.push('/pricing')}
                    >
                      Ver Planos
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
