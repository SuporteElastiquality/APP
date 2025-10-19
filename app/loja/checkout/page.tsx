'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Select from '@/components/Select'
import { Check, CreditCard, Truck, Shield, Lock } from 'lucide-react'
import Image from 'next/image'

interface CartItem {
  product: {
    id: string
    name: string
    price: number
    images: string[]
    brand?: string
  }
  quantity: number
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [cart, setCart] = useState<CartItem[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Formulário de entrega
  const [deliveryForm, setDeliveryForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: session?.user?.email || ''
  })
  
  // Formulário de faturação (Portugal)
  const [billingForm, setBillingForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    nif: '', // Número de Identificação Fiscal
    phone: '',
    email: session?.user?.email || ''
  })
  
  // Formulário de pagamento
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })
  
  // Opções de entrega
  const [deliveryOption, setDeliveryOption] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [sameAsDelivery, setSameAsDelivery] = useState(true) // Dados de faturação iguais aos de entrega

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Entrega Standard',
      description: '3-5 dias úteis',
      price: 0,
      free: true
    },
    {
      id: 'express',
      name: 'Entrega Expressa',
      description: '1-2 dias úteis',
      price: 9.99,
      free: false
    },
    {
      id: 'next-day',
      name: 'Entrega no Dia Seguinte',
      description: 'Próximo dia útil',
      price: 19.99,
      free: false
    }
  ]

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    console.log('Checkout - localStorage cart:', savedCart)
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        console.log('Checkout - parsed cart:', parsedCart)
        setCart(parsedCart)
      } catch (error) {
        console.error('Erro ao fazer parse do carrinho:', error)
        setCart([])
      }
    }
  }, [])

  // Carregar dados do usuário
  useEffect(() => {
    const loadUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/user/profile`)
          if (response.ok) {
            const userData = await response.json()
            
            // Preencher dados de entrega
            if (userData.clientProfile) {
              const profile = userData.clientProfile
              setDeliveryForm(prev => ({
                ...prev,
                firstName: userData.name?.split(' ')[0] || '',
                lastName: userData.name?.split(' ').slice(1).join(' ') || '',
                address: profile.morada || '',
                city: profile.council || '',
                postalCode: profile.postalCode || '',
                phone: userData.phone || ''
              }))
              
              // Preencher dados de faturação (mesmos dados por padrão)
              setBillingForm(prev => ({
                ...prev,
                firstName: userData.name?.split(' ')[0] || '',
                lastName: userData.name?.split(' ').slice(1).join(' ') || '',
                address: profile.morada || '',
                city: profile.council || '',
                postalCode: profile.postalCode || '',
                phone: userData.phone || ''
              }))
            } else {
              // Se não tem perfil, usar dados básicos
              setDeliveryForm(prev => ({
                ...prev,
                firstName: userData.name?.split(' ')[0] || '',
                lastName: userData.name?.split(' ').slice(1).join(' ') || '',
                phone: userData.phone || ''
              }))
              
              setBillingForm(prev => ({
                ...prev,
                firstName: userData.name?.split(' ')[0] || '',
                lastName: userData.name?.split(' ').slice(1).join(' ') || '',
                phone: userData.phone || ''
              }))
            }
          }
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error)
        }
      }
    }
    
    loadUserData()
  }, [session])

  // Sincronizar dados de faturação com entrega quando sameAsDelivery for true
  useEffect(() => {
    if (sameAsDelivery) {
      setBillingForm(prev => ({
        ...prev,
        firstName: deliveryForm.firstName,
        lastName: deliveryForm.lastName,
        address: deliveryForm.address,
        city: deliveryForm.city,
        postalCode: deliveryForm.postalCode,
        phone: deliveryForm.phone,
        email: deliveryForm.email
      }))
    }
  }, [deliveryForm, sameAsDelivery])

  // Calcular totais
  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  const selectedDelivery = deliveryOptions.find(option => option.id === deliveryOption)
  const deliveryCost = selectedDelivery?.price || 0
  const total = subtotal + deliveryCost

  // Verificar se está logado
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">A carregar...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin?callbackUrl=/loja/checkout')
    return null
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Carrinho vazio</h1>
            <p className="text-gray-600 mb-6">Adicione produtos ao seu carrinho para continuar</p>
            <Button onClick={() => router.push('/loja')}>
              Continuar a comprar
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep(2)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Limpar carrinho
      localStorage.removeItem('cart')
      setCart([])
      
      // Redirecionar para página de sucesso
      router.push('/loja/success')
    } catch (error) {
      console.error('Erro no pagamento:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-6">
            {[
              { step: 1, title: 'Entrega', icon: Truck },
              { step: 2, title: 'Faturação', icon: CreditCard },
              { step: 3, title: 'Pagamento', icon: CreditCard },
              { step: 4, title: 'Confirmação', icon: Check }
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-primary-600' : 'text-gray-400'
                }`}>
                  {title}
                </span>
                {step < 4 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    currentStep > step ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações de Entrega</h2>
                
                <form onSubmit={handleDeliverySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nome"
                      value={deliveryForm.firstName}
                      onChange={(e) => setDeliveryForm(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                    <Input
                      label="Apelido"
                      value={deliveryForm.lastName}
                      onChange={(e) => setDeliveryForm(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <Input
                    label="Morada (Rua/Avenida/Praceta)"
                    value={deliveryForm.address}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Ex: Rua da Liberdade, 123"
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Concelho"
                      value={deliveryForm.city}
                      onChange={(e) => setDeliveryForm(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Ex: Lisboa"
                      required
                    />
                    <Input
                      label="Código Postal"
                      value={deliveryForm.postalCode}
                      onChange={(e) => setDeliveryForm(prev => ({ ...prev, postalCode: e.target.value }))}
                      placeholder="Ex: 1000-001"
                      pattern="[0-9]{4}-[0-9]{3}"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Telefone"
                      type="tel"
                      value={deliveryForm.phone}
                      onChange={(e) => setDeliveryForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Ex: 912345678"
                      pattern="[0-9]{9}"
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={deliveryForm.email}
                      onChange={(e) => setDeliveryForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Opções de Entrega</h3>
                    <div className="space-y-3">
                      {deliveryOptions.map(option => (
                        <label key={option.id} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="delivery"
                            value={option.id}
                            checked={deliveryOption === option.id}
                            onChange={(e) => setDeliveryOption(e.target.value)}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{option.name}</span>
                              <span className="text-lg font-semibold text-primary-600">
                                {option.free ? 'Grátis' : `€${option.price.toFixed(2)}`}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Continuar para Pagamento
                  </Button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações de Faturação</h2>
                
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sameAsDelivery}
                      onChange={(e) => setSameAsDelivery(e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">
                      Os dados de faturação são os mesmos da entrega
                    </span>
                  </label>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(3); }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nome"
                      value={billingForm.firstName}
                      onChange={(e) => setBillingForm(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={sameAsDelivery}
                      required
                    />
                    <Input
                      label="Apelido"
                      value={billingForm.lastName}
                      onChange={(e) => setBillingForm(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={sameAsDelivery}
                      required
                    />
                  </div>
                  
                  <Input
                    label="Morada (Rua/Avenida/Praceta)"
                    value={billingForm.address}
                    onChange={(e) => setBillingForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Ex: Rua da Liberdade, 123"
                    disabled={sameAsDelivery}
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Concelho"
                      value={billingForm.city}
                      onChange={(e) => setBillingForm(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Ex: Lisboa"
                      disabled={sameAsDelivery}
                      required
                    />
                    <Input
                      label="Código Postal"
                      value={billingForm.postalCode}
                      onChange={(e) => setBillingForm(prev => ({ ...prev, postalCode: e.target.value }))}
                      placeholder="Ex: 1000-001"
                      pattern="[0-9]{4}-[0-9]{3}"
                      disabled={sameAsDelivery}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="NIF (Número de Identificação Fiscal)"
                      value={billingForm.nif}
                      onChange={(e) => setBillingForm(prev => ({ ...prev, nif: e.target.value }))}
                      placeholder="Ex: 123456789"
                      pattern="[0-9]{9}"
                      required
                    />
                    <Input
                      label="Telefone"
                      type="tel"
                      value={billingForm.phone}
                      onChange={(e) => setBillingForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Ex: 912345678"
                      pattern="[0-9]{9}"
                      disabled={sameAsDelivery}
                      required
                    />
                  </div>
                  
                  <Input
                    label="Email"
                    type="email"
                    value={billingForm.email}
                    onChange={(e) => setBillingForm(prev => ({ ...prev, email: e.target.value }))}
                    disabled={sameAsDelivery}
                    required
                  />
                  
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                    <Button type="submit" className="flex-1">
                      Continuar para Pagamento
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações de Pagamento</h2>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Lock className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">Pagamento seguro e encriptado</span>
                  </div>
                  
                  <Input
                    label="Número do Cartão"
                    value={paymentForm.cardNumber}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Data de Validade"
                      value={paymentForm.expiryDate}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                      placeholder="MM/AA"
                      required
                    />
                    <Input
                      label="CVV"
                      value={paymentForm.cvv}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                      placeholder="123"
                      required
                    />
                  </div>
                  
                  <Input
                    label="Nome no Cartão"
                    value={paymentForm.cardName}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, cardName: e.target.value }))}
                    required
                  />
                  
                  <div className="pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Método de Pagamento</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <CreditCard className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="font-medium text-gray-900">Cartão de Crédito/Débito</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? 'A processar...' : 'Finalizar Compra'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <div className="w-16 h-16 relative">
                      <Image
                        src={item.product.images[0] || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-primary-600">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Entrega</span>
                  <span className="text-gray-900">
                    {deliveryCost === 0 ? 'Grátis' : `€${deliveryCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-primary-600">€{total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6 flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Compra protegida e segura</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
