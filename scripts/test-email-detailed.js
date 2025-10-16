// Teste detalhado de envio de email
const { Resend } = require('resend')

const resend = new Resend('re_BkdZuoJY_DuGJw5VbWroACMMxEL8MnxF9')

async function testEmailDetailed() {
  console.log('📧 Teste detalhado de envio de email...')
  
  const emails = [
    'jdterra@outlook.com',
    'elastiquality@elastiquality.pt',
    'suporte@elastiquality.pt'
  ]
  
  for (const email of emails) {
    console.log(`\n🧪 Testando envio para: ${email}`)
    
    try {
      const result = await resend.emails.send({
        from: 'Elastiquality <onboarding@resend.dev>',
        to: [email],
        subject: 'Teste de Recuperação de Senha - Elastiquality',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3B82F6; font-size: 28px;">Recuperação de Senha</h1>
            </div>
            
            <div style="background: #F8FAFC; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #1E293B; margin-bottom: 15px;">Olá! 👋</h2>
              <p style="color: #64748B; line-height: 1.6; margin-bottom: 20px;">
                Este é um teste do sistema de recuperação de senha da Elastiquality.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="color: #64748B; margin-bottom: 20px;">
                  Clique no botão abaixo para testar a recuperação de senha:
                </p>
                <a href="https://appelastiquality.vercel.app/auth/reset-password?token=test-token-123" 
                   style="display: inline-block; background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Testar Recuperação de Senha
                </a>
              </div>
              
              <div style="background: #FEF3C7; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="color: #92400E; margin: 0; font-size: 14px;">
                  <strong>⚠️ Importante:</strong> Este é apenas um teste. O link não funcionará para redefinir senha real.
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
              <p style="color: #94A3B8; font-size: 14px;">
                Este email foi enviado pela Elastiquality para teste do sistema.
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
      } else {
        console.log(`   ⚠️ Resposta inesperada:`, JSON.stringify(result, null, 2))
      }
      
    } catch (error) {
      console.log(`   ❌ Erro ao enviar email: ${error.message}`)
    }
  }
}

testEmailDetailed()
