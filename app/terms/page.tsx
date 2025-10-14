import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Termos de Uso
              </h1>
              <p className="text-xl text-primary-100">
                Última atualização: 14 de outubro de 2024
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
                <p className="text-gray-600 mb-6">
                  Ao acessar e usar a plataforma Elastiquality, você concorda em cumprir e estar vinculado 
                  a estes Termos de Uso. Se você não concorda com qualquer parte destes termos, 
                  não deve usar nossa plataforma.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição do Serviço</h2>
                <p className="text-gray-600 mb-6">
                  A Elastiquality é uma plataforma que conecta clientes que precisam de serviços 
                  com profissionais qualificados. Facilitamos a comunicação e transações entre 
                  essas partes, mas não somos responsáveis pela execução dos serviços.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Contas de Usuário</h2>
                <div className="text-gray-600 mb-6 space-y-4">
                  <p>Para usar nossa plataforma, você deve:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Fornecer informações verdadeiras e atualizadas</li>
                    <li>Manter a segurança de sua senha</li>
                    <li>Ser responsável por todas as atividades em sua conta</li>
                    <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Conduta do Usuário</h2>
                <div className="text-gray-600 mb-6">
                  <p className="mb-4">Você concorda em não:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Usar a plataforma para atividades ilegais ou não autorizadas</li>
                    <li>Interferir com o funcionamento da plataforma</li>
                    <li>Tentar acessar contas de outros usuários</li>
                    <li>Publicar conteúdo ofensivo, difamatório ou inadequado</li>
                    <li>Fazer spam ou comunicações não solicitadas</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Pagamentos e Transações</h2>
                <div className="text-gray-600 mb-6 space-y-4">
                  <p>
                    Os pagamentos são feitos diretamente entre clientes e profissionais. 
                    A Elastiquality não processa pagamentos nem retém valores.
                  </p>
                  <p>
                    Profissionais podem ter planos de assinatura para funcionalidades premium, 
                    cobrados mensalmente conforme o plano escolhido.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Responsabilidades</h2>
                <div className="text-gray-600 mb-6 space-y-4">
                  <p>
                    <strong>Cliente:</strong> É responsável por descrever adequadamente o serviço 
                    necessário e pagar o profissional conforme acordado.
                  </p>
                  <p>
                    <strong>Profissional:</strong> É responsável por executar o serviço conforme 
                    descrito e acordado, com qualidade e pontualidade.
                  </p>
                  <p>
                    <strong>Elastiquality:</strong> Facilita a conexão entre as partes mas não 
                    garante a qualidade dos serviços prestados.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitação de Responsabilidade</h2>
                <p className="text-gray-600 mb-6">
                  A Elastiquality não será responsável por danos diretos, indiretos, incidentais 
                  ou consequenciais resultantes do uso da plataforma ou da execução de serviços 
                  por profissionais.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Propriedade Intelectual</h2>
                <p className="text-gray-600 mb-6">
                  Todo o conteúdo da plataforma Elastiquality, incluindo textos, gráficos, 
                  logotipos e software, é propriedade da Elastiquality e protegido por leis 
                  de direitos autorais.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modificações</h2>
                <p className="text-gray-600 mb-6">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                  As alterações entrarão em vigor imediatamente após a publicação. 
                  O uso continuado da plataforma constitui aceitação dos novos termos.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contato</h2>
                <p className="text-gray-600 mb-6">
                  Para questões sobre estes Termos de Uso, entre em contato conosco em:
                  <br />
                  Email: legal@elastiquality.pt
                  <br />
                  Telefone: +351 900 000 000
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
