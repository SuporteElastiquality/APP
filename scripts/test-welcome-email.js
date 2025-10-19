// Teste do email de boas-vindas
const { Resend } = require('resend')

const resend = new Resend('re_BkdZuoJY_DuGJw5VbWroACMMxEL8MnxF9')

async function sendWelcomeEmail(email, name) {
  try {
    await resend.emails.send({
      from: 'Elastiquality <noreply@elastiquality.pt>',
      to: [email],
      subject: 'Bem-vindo ao Elastiquality! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6; font-size: 28px;">Bem-vindo ao Elastiquality!</h1>
          </div>
          
          <div style="background: #F8FAFC; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #1E293B; margin-bottom: 15px;">Olá, ${name}! 👋</h2>
            <p style="color: #64748B; line-height: 1.6; margin-bottom: 20px;">
              Sua conta foi criada com sucesso! Agora você pode acessar todos os nossos serviços 
              e conectar-se com profissionais certificados em Portugal.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #3B82F6; margin-bottom: 15px;">🎯 O que você pode fazer agora:</h3>
              <ul style="color: #64748B; line-height: 1.8;">
                <li>Explorar serviços disponíveis</li>
                <li>Encontrar profissionais na sua região</li>
                <li>Contratar serviços com segurança</li>
                <li>Acompanhar seus pedidos em tempo real</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://appelastiquality.vercel.app/dashboard" 
                 style="background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Acessar Minha Conta
              </a>
            </div>
          </div>
          
          <div style="text-align: center; color: #94A3B8; font-size: 14px; margin-top: 30px;">
            <p>Este email foi enviado automaticamente. Não responda a este email.</p>
            <p>© 2024 Elastiquality. Todos os direitos reservados.</p>
          </div>
        </div>
      `
    })
    
    console.log('Welcome email sent successfully to:', email)
    return { success: true }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}

async function testWelcomeEmail() {
  console.log('📧 Testando email de boas-vindas...')
  
  const testUsers = [
    {
      email: 'teste@exemplo.com',
      name: 'João Silva'
    },
    {
      email: 'maria@exemplo.com', 
      name: 'Maria Santos'
    }
  ]
  
  for (const user of testUsers) {
    console.log(`\n🧪 Testando envio para: ${user.email}`)
    
    try {
      const result = await sendWelcomeEmail(user.email, user.name)
      
      if (result.success) {
        console.log(`   ✅ Email de boas-vindas enviado com sucesso!`)
        console.log(`   📧 Verifique ${user.email}!`)
      } else {
        console.log(`   ❌ Erro ao enviar email:`, result.error)
      }
      
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`)
    }
  }
}

testWelcomeEmail()
