// Teste de email de boas-vindas para contas específicas
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
              e conectar-se com profissionais qualificados em Portugal.
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
              <a href="https://appelastiquality-328pjpicm-suporte-elastiquality.vercel.app" 
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
    
    console.log('✅ Email de boas-vindas enviado com sucesso para:', email)
    return { success: true }
  } catch (error) {
    console.error('❌ Erro ao enviar email para', email, ':', error)
    return { success: false, error }
  }
}

async function testSpecificEmails() {
  console.log('📧 Testando envio de emails de boas-vindas para contas específicas...\n')
  
  const testUsers = [
    {
      email: 'claudia.simplicio@gmail.com',
      name: 'Claudia Simplicio'
    },
    {
      email: 'jdterra@outlook.com', 
      name: 'Jonatas Dias Terra'
    }
  ]
  
  for (const user of testUsers) {
    console.log(`🧪 Enviando email para: ${user.email}`)
    
    try {
      const result = await sendWelcomeEmail(user.email, user.name)
      
      if (result.success) {
        console.log(`   ✅ Email enviado com sucesso!`)
        console.log(`   📧 Verifique a caixa de entrada de ${user.email}`)
      } else {
        console.log(`   ❌ Falha no envio:`, result.error?.message || 'Erro desconhecido')
      }
      
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`)
    }
    
    console.log('') // Linha em branco para separar
  }
  
  console.log('🏁 Teste concluído!')
}

testSpecificEmails()
