'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, ChevronDown, ChevronRight, MessageCircle, Phone, Mail } from 'lucide-react'
import { useState } from 'react'

const faqCategories = [
  {
    title: 'Começar a Usar',
    questions: [
      {
        question: 'Como criar uma conta?',
        answer: 'Clique em "Cadastrar" no canto superior direito, escolha se é Cliente ou Profissional, preencha seus dados e confirme seu email.'
      },
      {
        question: 'Qual a diferença entre Cliente e Profissional?',
        answer: 'Clientes solicitam serviços, Profissionais oferecem serviços. Cada tipo de conta tem funcionalidades específicas.'
      },
      {
        question: 'É grátis criar uma conta?',
        answer: 'Sim! Criar conta e usar como Cliente é sempre grátis. Profissionais têm planos pagos opcionais para mais funcionalidades.'
      }
    ]
  },
  {
    title: 'Como Funciona',
    questions: [
      {
        question: 'Como solicitar um serviço?',
        answer: 'Após fazer login, clique em "Solicitar Serviço", descreva o que precisa, defina localização e orçamento, e publique.'
      },
      {
        question: 'Quantas propostas vou receber?',
        answer: 'Você recebe até 5 propostas em 24 horas. Pode receber mais dependendo da demanda pelos profissionais.'
      },
      {
        question: 'Como escolher o melhor profissional?',
        answer: 'Compare avaliações, preços, experiência e especialidades. Leia os comentários de outros clientes antes de decidir.'
      }
    ]
  },
  {
    title: 'Pagamentos',
    questions: [
      {
        question: 'Como funciona o pagamento?',
        answer: 'O pagamento é feito diretamente ao profissional após a conclusão do serviço. A Elastiquality não cobra taxas dos clientes.'
      },
      {
        question: 'Posso pagar com cartão?',
        answer: 'Sim, muitos profissionais aceitam pagamento por cartão, transferência bancária ou dinheiro. Combine com o profissional.'
      },
      {
        question: 'O que são as Moedas Elastiquality?',
        answer: 'São créditos que profissionais usam para ver detalhes dos clientes e fazer propostas. Clientes não precisam comprar moedas.'
      }
    ]
  },
  {
    title: 'Problemas Técnicos',
    questions: [
      {
        question: 'Não consigo fazer login',
        answer: 'Verifique se o email e senha estão corretos. Use "Esqueci a senha" se necessário. Se persistir, entre em contato.'
      },
      {
        question: 'O chat não está funcionando',
        answer: 'Verifique sua conexão com internet e atualize a página. Se o problema persistir, use o telefone para contatar o profissional.'
      },
      {
        question: 'Não recebo notificações',
        answer: 'Verifique as configurações de notificação do seu navegador e dispositivo. Ative as notificações para o site.'
      }
    ]
  }
]

export default function HelpPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const toggleCategory = (title: string) => {
    setOpenCategory(openCategory === title ? null : title)
  }

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Central de Ajuda
              </h1>
              <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                Encontre respostas para suas dúvidas e aprenda a usar a plataforma Elastiquality.
              </p>
              
              {/* Search */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Pesquisar ajuda..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredCategories.map((category, index) => (
              <div key={index} className="mb-8">
                <button
                  onClick={() => toggleCategory(category.title)}
                  className="w-full flex items-center justify-between p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
                  {openCategory === category.title ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                {openCategory === category.title && (
                  <div className="mt-4 space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faqIndex} className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {filteredCategories.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  Nenhum resultado encontrado para "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Limpar pesquisa
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ainda Precisa de Ajuda?
              </h2>
              <p className="text-xl text-gray-600">
                Nossa equipe de suporte está pronta para ajudar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="inline-flex p-4 bg-primary-100 rounded-full mb-4">
                  <MessageCircle className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chat Online
                </h3>
                <p className="text-gray-600 mb-4">
                  Converse com nossa equipe em tempo real
                </p>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Iniciar Chat
                </button>
              </div>

              <div className="text-center p-6">
                <div className="inline-flex p-4 bg-primary-100 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Email
                </h3>
                <p className="text-gray-600 mb-4">
                  Envie-nos uma mensagem detalhada
                </p>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Enviar Email
                </button>
              </div>

              <div className="text-center p-6">
                <div className="inline-flex p-4 bg-primary-100 rounded-full mb-4">
                  <Phone className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Telefone
                </h3>
                <p className="text-gray-600 mb-4">
                  Fale diretamente com nosso suporte
                </p>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Ligar Agora
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
