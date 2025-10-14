import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Política de Cookies
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. O que são Cookies?</h2>
                <p className="text-gray-600 mb-6">
                  Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando 
                  você visita nossa plataforma. Eles nos ajudam a melhorar sua experiência, 
                  lembrar suas preferências e entender como você usa nossos serviços.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Tipos de Cookies que Utilizamos</h2>
                
                <div className="text-gray-600 mb-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies Essenciais</h3>
                    <p className="mb-2">
                      Necessários para o funcionamento básico da plataforma:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Autenticação e sessão de usuário</li>
                      <li>Preferências de idioma e região</li>
                      <li>Segurança e prevenção de fraudes</li>
                      <li>Funcionalidades básicas do site</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies de Desempenho</h3>
                    <p className="mb-2">
                      Coletam informações sobre como você usa nossa plataforma:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Páginas mais visitadas</li>
                      <li>Tempo gasto na plataforma</li>
                      <li>Links clicados</li>
                      <li>Erros encontrados</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies de Funcionalidade</h3>
                    <p className="mb-2">
                      Permitem funcionalidades aprimoradas e personalização:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Lembrar suas preferências</li>
                      <li>Personalizar interface</li>
                      <li>Configurações de notificação</li>
                      <li>Histórico de pesquisas</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies de Marketing</h3>
                    <p className="mb-2">
                      Usados para mostrar anúncios relevantes:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Segmentação de anúncios</li>
                      <li>Medição de eficácia</li>
                      <li>Evitar anúncios duplicados</li>
                      <li>Remarketing</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookies de Terceiros</h2>
                <div className="text-gray-600 mb-6 space-y-4">
                  <p>
                    Alguns cookies são colocados por serviços de terceiros que aparecem em nossas páginas:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Google Analytics:</strong> Para análise de tráfego e comportamento</li>
                    <li><strong>Stripe:</strong> Para processamento de pagamentos</li>
                    <li><strong>Redes Sociais:</strong> Para botões de compartilhamento</li>
                    <li><strong>Google Maps:</strong> Para funcionalidades de localização</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Duração dos Cookies</h2>
                <div className="text-gray-600 mb-6">
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Cookies de Sessão:</strong> Expiram quando você fecha o navegador</li>
                    <li><strong>Cookies Persistentes:</strong> Permanecem por um período específico (30 dias a 2 anos)</li>
                    <li><strong>Cookies Essenciais:</strong> Geralmente duram a sessão ou até 30 dias</li>
                    <li><strong>Cookies de Marketing:</strong> Podem durar até 2 anos</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Como Gerenciar Cookies</h2>
                <div className="text-gray-600 mb-6 space-y-4">
                  <p>
                    Você pode controlar e gerenciar cookies de várias formas:
                  </p>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações do Navegador</h3>
                    <p className="mb-2">A maioria dos navegadores permite:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Bloquear todos os cookies</li>
                      <li>Aceitar apenas cookies de primeira parte</li>
                      <li>Excluir cookies existentes</li>
                      <li>Ser notificado antes de aceitar cookies</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nosso Banner de Cookies</h3>
                    <p>
                      Quando você visita nossa plataforma, pode escolher quais tipos de cookies aceitar 
                      através do nosso banner de consentimento.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ferramentas de Opt-out</h3>
                    <p>
                      Para cookies de marketing, você pode usar ferramentas como:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Your Online Choices (Europa)</li>
                      <li>Network Advertising Initiative</li>
                      <li>Digital Advertising Alliance</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Impacto de Desabilitar Cookies</h2>
                <div className="text-gray-600 mb-6 space-y-4">
                  <p>
                    Desabilitar cookies pode afetar sua experiência na plataforma:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Algumas funcionalidades podem não funcionar corretamente</li>
                    <li>Você precisará fazer login a cada visita</li>
                    <li>Preferências não serão salvas</li>
                    <li>Conteúdo personalizado não estará disponível</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Atualizações desta Política</h2>
                <p className="text-gray-600 mb-6">
                  Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças 
                  em nossas práticas ou por outras razões operacionais, legais ou regulamentares. 
                  Recomendamos revisar esta política regularmente.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contato</h2>
                <p className="text-gray-600 mb-6">
                  Se você tiver dúvidas sobre nossa Política de Cookies, entre em contato:
                  <br />
                  Email: cookies@elastiquality.pt
                  <br />
                  Telefone: +351 900 000 000
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
