// Teste usando o módulo resend diretamente
const { Resend } = require('resend')

const resend = new Resend('re_BkdZuoJY_DuGJw5VbWroACMMxEL8MnxF9')

async function testResendModule() {
  console.log('📧 Testando com módulo resend...')
  
  try {
    const result = await resend.emails.send({
      from: 'Elastiquality <onboarding@resend.dev>',
      to: ['jdterra@outlook.com'],
      subject: 'Teste de Email - Elastiquality',
      html: '<h1>Teste de Email</h1><p>Este é um teste usando o módulo resend.</p>'
    })
    
    console.log('   ✅ Email enviado com sucesso!')
    console.log(`   Resposta:`, JSON.stringify(result, null, 2))
    if (result.data && result.data.id) {
      console.log(`   ID do email: ${result.data.id}`)
    }
    console.log('   📧 Verifique sua caixa de entrada!')
    
  } catch (error) {
    console.log('   ❌ Erro ao enviar email:')
    console.log(`   Status: ${error.statusCode || 'N/A'}`)
    console.log(`   Mensagem: ${error.message}`)
    console.log(`   Detalhes:`, error)
  }
}

testResendModule()
