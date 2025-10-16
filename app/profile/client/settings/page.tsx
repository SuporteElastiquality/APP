'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { User, Bell, Shield, CreditCard, HelpCircle } from 'lucide-react'

export default function ClientSettingsPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin')
    }
    
    if (session?.user?.userType !== 'CLIENT') {
      redirect('/profile/professional')
    }

    setLoading(false)
  }, [session, status])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'billing', label: 'Faturação', icon: CreditCard },
    { id: 'help', label: 'Ajuda', icon: HelpCircle }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
                <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
              </div>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 bg-gray-50 border-r border-gray-200">
                <nav className="p-4 space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Informações do Perfil</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Nome Completo"
                        value={session?.user?.name || ''}
                        disabled
                        className="bg-gray-50"
                      />
                      <Input
                        label="Email"
                        value={session?.user?.email || ''}
                        disabled
                        className="bg-gray-50"
                      />
                      <Input
                        label="Tipo de Conta"
                        value="Cliente"
                        disabled
                        className="bg-gray-50"
                      />
                      <Input
                        label="Data de Criação"
                        value={new Date().toLocaleDateString('pt-PT')}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="pt-4">
                      <Button onClick={() => window.location.href = '/profile/client'}>
                        Editar Perfil Completo
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Preferências de Notificação</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Email de Novos Serviços</h3>
                          <p className="text-sm text-gray-600">Receber notificações sobre novos serviços disponíveis</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Propostas de Profissionais</h3>
                          <p className="text-sm text-gray-600">Receber notificações quando profissionais enviarem propostas</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Atualizações de Status</h3>
                          <p className="text-sm text-gray-600">Receber notificações sobre mudanças no status dos seus pedidos</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <Button>Salvar Preferências</Button>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Segurança da Conta</h2>
                    <div className="space-y-4">
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="font-medium text-yellow-800">Alterar Senha</h3>
                        <p className="text-sm text-yellow-700 mb-3">Mantenha sua conta segura com uma senha forte</p>
                        <Button variant="outline" onClick={() => window.location.href = '/auth/forgot-password'}>
                          Alterar Senha
                        </Button>
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-medium text-blue-800">Sessões Ativas</h3>
                        <p className="text-sm text-blue-700 mb-3">Gerencie os dispositivos conectados à sua conta</p>
                        <Button variant="outline">Ver Sessões</Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Faturação e Pagamentos</h2>
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Plano Atual</h3>
                      <p className="text-2xl font-bold text-blue-600 mb-1">Cliente Grátis</p>
                      <p className="text-gray-600 mb-4">Acesso completo a todos os serviços sem custos</p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>✅ Acesso a profissionais qualificados</p>
                        <p>✅ Sistema de avaliações</p>
                        <p>✅ Chat direto com profissionais</p>
                        <p>✅ Suporte 24/7</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'help' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Ajuda e Suporte</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Central de Ajuda</h3>
                        <p className="text-sm text-gray-600 mb-3">Encontre respostas para suas dúvidas</p>
                        <Button variant="outline" onClick={() => window.location.href = '/help'}>
                          Acessar Ajuda
                        </Button>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Contato</h3>
                        <p className="text-sm text-gray-600 mb-3">Entre em contato conosco</p>
                        <Button variant="outline" onClick={() => window.location.href = '/contact'}>
                          Enviar Mensagem
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
