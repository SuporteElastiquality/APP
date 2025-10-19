import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Política de Privacidade
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informações que Coletamos</h2>
                <div className="text-gray-600 mb-6 space-y-4">
                  <p><strong>Informações Pessoais:</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Nome completo e endereço de email</li>
                    <li>Número de telefone</li>
                    <li>Endereço e localização</li>
                    <li>Informações de pagamento (processadas por terceiros seguros)</li>
                  </ul>
                  
                  <p><strong>Informações de Uso:</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Histórico de solicitações e propostas</li>
                    <li>Comunicações e mensagens</li>
                    <li>Preferências e configurações</li>
                    <li>Dados de navegação e cookies</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Como Usamos suas Informações</h2>
                <div className="text-gray-600 mb-6">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Conectar clientes com profissionais adequados</li>
                    <li>Facilitar comunicação entre usuários</li>
                    <li>Processar pagamentos e transações</li>
                    <li>Melhorar nossos serviços e plataforma</li>
                    <li>Enviar notificações importantes</li>
                    <li>Cumprir obrigações legais</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartilhamento de Informações</h2>
                <div className="text-gray-600 mb-6 space-y-4">
                  <p>Compartilhamos suas informações apenas quando necessário:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Entre usuários:</strong> Para conectar clientes e profissionais</li>
                    <li><strong>Prestadores de serviços:</strong> Para processamento de pagamentos</li>
                    <li><strong>Autoridades legais:</strong> Quando exigido por lei</li>
                    <li><strong>Com seu consentimento:</strong> Em outras situações específicas</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Segurança dos Dados</h2>
                <div className="text-gray-600 mb-6 space-y-4">
                  <p>
                    Implementamos medidas de segurança técnicas e organizacionais para proteger 
                    suas informações pessoais contra acesso não autorizado, alteração, divulgação 
                    ou destruição.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encriptação SSL/TLS para transmissão de dados</li>
                    <li>Armazenamento seguro em servidores protegidos</li>
                    <li>Controles de acesso rigorosos</li>
                    <li>Monitoramento regular de segurança</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seus Direitos</h2>
                <div className="text-gray-600 mb-6">
                  <p className="mb-4">De acordo com o RGPD, você tem o direito de:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Acessar suas informações pessoais</li>
                    <li>Corrigir dados incorretos ou incompletos</li>
                    <li>Solicitar a exclusão de seus dados</li>
                    <li>Limitar o processamento de seus dados</li>
                    <li>Portabilidade dos dados</li>
                    <li>Opor-se ao processamento</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies e Tecnologias Similares</h2>
                <div className="text-gray-600 mb-6 space-y-4">
                  <p>
                    Utilizamos cookies e tecnologias similares para melhorar sua experiência, 
                    analisar o uso da plataforma e personalizar conteúdo.
                  </p>
                  <p>
                    Você pode controlar cookies através das configurações do seu navegador, 
                    mas isso pode afetar algumas funcionalidades da plataforma.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retenção de Dados</h2>
                <p className="text-gray-600 mb-6">
                  Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir 
                  os propósitos descritos nesta política, a menos que um período de retenção 
                  mais longo seja exigido ou permitido por lei.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Transferências Internacionais</h2>
                <p className="text-gray-600 mb-6">
                  Seus dados podem ser transferidos e processados em países fora do Espaço 
                  Econômico Europeu. Garantimos que tais transferências sejam feitas com 
                  proteções adequadas conforme exigido pela lei.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Menores de Idade</h2>
                <p className="text-gray-600 mb-6">
                  Nossa plataforma não é destinada a menores de 16 anos. Não coletamos 
                  intencionalmente informações pessoais de menores. Se descobrirmos que 
                  coletamos dados de um menor, os removeremos imediatamente.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Alterações nesta Política</h2>
                <p className="text-gray-600 mb-6">
                  Podemos atualizar esta Política de Privacidade periodicamente. 
                  Notificaremos sobre mudanças significativas por email ou através da plataforma. 
                  Recomendamos revisar esta política regularmente.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contato</h2>
                <p className="text-gray-600 mb-6">
                  Para questões sobre privacidade ou para exercer seus direitos, entre em contato:
                  <br />
                  Email: privacy@elastiquality.pt
                  <br />
                  Telefone: +351 21 253 4021
                  <br />
                  Endereço: Lisboa, Portugal
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
