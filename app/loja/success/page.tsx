'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import { CheckCircle, Package, Truck, Mail, ArrowRight } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    // Gerar número de pedido aleatório
    const orderNum = 'EL' + Date.now().toString().slice(-8)
    setOrderNumber(orderNum)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Compra realizada com sucesso!
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Obrigado pela sua compra, <span className="font-semibold">Cliente</span>!
          </p>
          
          <p className="text-gray-500">
            Número do pedido: <span className="font-mono font-semibold text-primary-600">{orderNumber}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pedido Confirmado</h3>
            <p className="text-gray-600 text-sm">
              O seu pedido foi processado e está a ser preparado para envio
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">A Enviar</h3>
            <p className="text-gray-600 text-sm">
              Receberá um email com o código de rastreamento em breve
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Enviado</h3>
            <p className="text-gray-600 text-sm">
              Confirmação e detalhes enviados para o seu email
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">O que acontece a seguir?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold text-primary-600">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Preparação do Pedido</h3>
                <p className="text-gray-600 text-sm">
                  A nossa equipa está a preparar cuidadosamente o seu pedido para envio
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold text-primary-600">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Envio</h3>
                <p className="text-gray-600 text-sm">
                  O seu pedido será enviado e receberá um email com o código de rastreamento
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold text-primary-600">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Entrega</h3>
                <p className="text-gray-600 text-sm">
                  O seu pedido será entregue no endereço especificado
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push('/loja')} className="flex items-center space-x-2">
              <ArrowRight className="w-4 h-4" />
              <span>Continuar a Comprar</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push('/profile')}
              className="flex items-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Ver Meus Pedidos</span>
            </Button>
          </div>
          
          <p className="text-sm text-gray-500">
            Tem alguma dúvida? <a href="/contact" className="text-primary-600 hover:underline">Contacte-nos</a>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
