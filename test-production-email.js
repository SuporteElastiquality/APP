// Teste de envio de email via API de produção
async function testProductionEmail() {
  try {
    console.log('=== TESTE DE EMAIL VIA API DE PRODUÇÃO ===\n')
    
    const response = await fetch('https://elastiquality-57jdwv7mb-suporte-elastiquality.vercel.app/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'system',
        title: 'Teste de Notificação',
        message: 'Esta é uma notificação de teste para verificar se o sistema de emails está funcionando.',
        recipientEmail: 'jdterra@outlook.com'
      }),
    })
    
    console.log('Status da resposta:', response.status)
    const result = await response.json()
    console.log('Resultado:', result)
    
    if (response.ok) {
      console.log('✅ Teste de email enviado com sucesso!')
    } else {
      console.log('❌ Erro no envio do email:', result)
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testProductionEmail()
