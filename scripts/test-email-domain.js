// Teste de envio com domínio personalizado
const { Resend } = require('resend')

const resend = new Resend('re_BkdZuoJY_DuGJw5VbWroACMMxEL8MnxF9')

async function testEmailDomain() {
  console.log('📧 Testando envio com domínio personalizado...')
  
  const testEmails = [
    'jdterra@outlook.com',
    'elastiquality@elastiquality.pt',
    'suporte@elastiquality.pt'
  ]
  
  for (const email of testEmails) {
    console.log(`\n🧪 Testando envio para: ${email}`)
    
    try {
      const result = await resend.emails.send({
        from: 'Elastiquality <noreply@elastiquality.pt>',
        to: [email],
        subject: 'Teste de Domínio Personalizado - Elastiquality',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3B82F6; font-size: 28px;">Teste de Domínio Personalizado</h1>
            </div>
            
            <div style="background: #F8FAFC; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #1E293B; margin-bottom: 15px;">Olá! 👋</h2>
              <p style="color: #64748B; line-height: 1.6; margin-bottom: 20px;">
                Este é um teste do domínio personalizado <strong>elastiquality.pt</strong>.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #3B82F6; margin-bottom: 15px;">✅ Configuração Atualizada:</h3>
                <ul style="color: #64748B; line-height: 1.8;">
                  <li>Domínio: <code>elastiquality.pt</code></li>
                  <li>Remetente: <code>noreply@elastiquality.pt</code></li>
                  <li>Status: Funcionando para qualquer email</li>
                </ul>
              </div>
              
              <div style="background: #D1FAE5; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="color: #065F46; margin: 0; font-size: 14px;">
                  <strong>🎉 Sucesso!</strong> Se você recebeu este email, o domínio personalizado está funcionando!
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
              <p style="color: #94A3B8; font-size: 14px;">
                Este email foi enviado pela Elastiquality usando o domínio personalizado.
              </p>
            </div>
          </div>
        `
      })
      
      if (result.data && result.data.id) {
        console.log(`   ✅ Email enviado com sucesso!`)
        console.log(`   ID: ${result.data.id}`)
        console.log(`   📧 Verifique ${email}!`)
      } else if (result.error) {
        console.log(`   ❌ Erro: ${result.error.message}`)
        
        if (result.error.message.includes('domain')) {
          console.log(`   💡 O domínio elastiquality.pt precisa ser verificado no Resend`)
        }
      } else {
        console.log(`   ⚠️ Resposta inesperada:`, JSON.stringify(result, null, 2))
      }
      
    } catch (error) {
      console.log(`   ❌ Erro ao enviar email: ${error.message}`)
    }
  }
}

testEmailDomain()
