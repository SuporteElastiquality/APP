'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowLeft, CreditCard, Coins, Calendar, Euro, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface Transaction {
  id: string
  amount: number
  description: string
  status: string
  stripePaymentIntentId: string | null
  stripeChargeId: string | null
  createdAt: string
  updatedAt: string
}

interface QualityTransaction {
  id: string
  amount: number
  type: string
  description: string
  source: string
  createdAt: string
}

interface PaymentHistory {
  transactions: Transaction[]
  qualityTransactions: QualityTransaction[]
  totalSpent: number
  totalQualityEarned: number
  currentBalance: number
}

export default function PaymentHistory() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    } else if (session.user?.userType !== 'PROFESSIONAL') {
      router.push('/dashboard')
    } else {
      loadPaymentHistory()
    }
  }, [session, status, router])

  const loadPaymentHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/professional/payment-history')
      
      if (response.ok) {
        const data = await response.json()
        setPaymentHistory(data)
      } else {
        setError('Erro ao carregar histórico de pagamentos')
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err)
      setError('Erro ao carregar histórico de pagamentos')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { text: 'Pendente', color: 'text-yellow-600', icon: Clock }
      case 'COMPLETED':
        return { text: 'Concluído', color: 'text-green-600', icon: CheckCircle }
      case 'FAILED':
        return { text: 'Falhou', color: 'text-red-600', icon: XCircle }
      case 'CANCELED':
        return { text: 'Cancelado', color: 'text-gray-600', icon: XCircle }
      default:
        return { text: status, color: 'text-gray-600', icon: Clock }
    }
  }

  const getTransactionTypeInfo = (type: string) => {
    switch (type) {
      case 'CREDIT':
        return { text: 'Crédito', color: 'text-green-600', icon: TrendingUp }
      case 'DEBIT':
        return { text: 'Débito', color: 'text-red-600', icon: TrendingUp }
      default:
        return { text: type, color: 'text-gray-600', icon: TrendingUp }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !paymentHistory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro</h1>
            <p className="text-gray-600 mb-6">{error || 'Histórico não encontrado'}</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Histórico de Pagamentos
          </h1>
          <p className="text-gray-600">
            Acompanhe suas compras de Quality e transações
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Euro className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Gasto</p>
                <p className="text-2xl font-bold text-gray-900">€{paymentHistory.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Coins className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Quality Ganho</p>
                <p className="text-2xl font-bold text-gray-900">{paymentHistory.totalQualityEarned}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Coins className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
                <p className="text-2xl font-bold text-gray-900">{paymentHistory.currentBalance}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transações</p>
                <p className="text-2xl font-bold text-gray-900">{paymentHistory.transactions.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Transactions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Compras de Quality</h2>
              <p className="text-sm text-gray-600">Histórico de pagamentos via Stripe</p>
            </div>
            <div className="p-6">
              {paymentHistory.transactions.length > 0 ? (
                <div className="space-y-4">
                  {paymentHistory.transactions.map((transaction) => {
                    const statusInfo = getStatusInfo(transaction.status)
                    const StatusIcon = statusInfo.icon
                    
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <CreditCard className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {transaction.description}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">€{transaction.amount.toFixed(2)}</p>
                          <div className="flex items-center space-x-1">
                            <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                            <span className={`text-sm ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhuma compra encontrada</p>
                </div>
              )}
            </div>
          </div>

          {/* Quality Transactions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Movimentações de Quality</h2>
              <p className="text-sm text-gray-600">Histórico de créditos e débitos</p>
            </div>
            <div className="p-6">
              {paymentHistory.qualityTransactions.length > 0 ? (
                <div className="space-y-4">
                  {paymentHistory.qualityTransactions.map((transaction) => {
                    const typeInfo = getTransactionTypeInfo(transaction.type)
                    const TypeIcon = typeInfo.icon
                    
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <Coins className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {transaction.description}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${typeInfo.color}`}>
                            {transaction.type === 'CREDIT' ? '+' : '-'}{transaction.amount}
                          </p>
                          <div className="flex items-center space-x-1">
                            <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                            <span className={`text-sm ${typeInfo.color}`}>
                              {typeInfo.text}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhuma movimentação encontrada</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/quality"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Comprar Mais Quality
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
