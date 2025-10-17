const { Resend } = require('resend')

// Teste direto do envio de email
async function testEmailSending() {
  try {
    console.log('=== TESTE DE ENVIO DE EMAIL ===\n')
    
    // Verificar se a API key está configurada
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('❌ RESEND_API_KEY não encontrada!')
      return
    }
    
    console.log('✅ RESEND_API_KEY encontrada')
    
    const resend = new Resend(apiKey)
    
    // Teste simples de envio
    const { data, error } = await resend.emails.send({
      from: 'Elastiquality <notificacoes@elastiquality.pt>',
      to: ['jdterra@outlook.com'],
      subject: 'Teste de Notificação - Elastiquality',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://elastiquality.pt/logo.png" alt="Elastiquality" style="height: 60px;">
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin: 0 0 10px 0;">Nova mensagem recebida!</h2>
            <p style="color: #374151; margin: 0; line-height: 1.5;">Você recebeu uma nova mensagem de <strong>Elastiquality</strong> na plataforma Elastiquality.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://elastiquality.pt/messages" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              Ver Mensagem
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>Esta é uma notificação automática da Elastiquality.</p>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('❌ Erro ao enviar email:', error)
    } else {
      console.log('✅ Email enviado com sucesso:', data)
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de email:', error)
  }
}

testEmailSending()
