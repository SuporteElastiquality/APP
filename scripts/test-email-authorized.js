// Teste enviando para email autorizado
const { Resend } = require('resend')

const resend = new Resend('re_BkdZuoJY_DuGJw5VbWroACMMxEL8MnxF9')

async function testEmailAuthorized() {
  console.log('📧 Teste enviando para email autorizado...')
  
  try {
    const result = await resend.emails.send({
      from: 'Elastiquality <onboarding@resend.dev>',
      to: ['suporte@elastiquality.pt'],
      subject: 'Teste de Recuperação de Senha - Elastiquality',
      html: `
        <h1>Teste de Recuperação de Senha</h1>
        <p>Este é um teste do sistema de recuperação de senha.</p>
        <p>Se você recebeu este email, o sistema está funcionando!</p>
        <p>Link de teste: <a href="https://appelastiquality.vercel.app/auth/reset-password?token=test-token-123">Redefinir Senha</a></p>
      `
    })
    
    console.log('   ✅ Email enviado com sucesso!')
    console.log(`   Resposta:`, JSON.stringify(result, null, 2))
    if (result.data && result.data.id) {
      console.log(`   ID do email: ${result.data.id}`)
    }
    console.log('   📧 Verifique suporte@elastiquality.pt!')
    
  } catch (error) {
    console.log('   ❌ Erro ao enviar email:')
    console.log(`   Status: ${error.statusCode || 'N/A'}`)
    console.log(`   Mensagem: ${error.message}`)
    console.log(`   Detalhes:`, error)
  }
}

testEmailAuthorized()
