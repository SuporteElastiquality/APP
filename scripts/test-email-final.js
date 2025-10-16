// Teste final de envio de email
const { Resend } = require('resend')

const resend = new Resend('re_BkdZuoJY_DuGJw5VbWroACMMxEL8MnxF9')

async function testEmailFinal() {
  console.log('📧 Teste final de envio de email...')
  
  try {
    const result = await resend.emails.send({
      from: 'Elastiquality <onboarding@resend.dev>',
      to: ['jdterra@outlook.com'],
      subject: 'Teste Final - Elastiquality',
      html: '<h1>Teste Final de Email</h1><p>Este é um teste final usando o domínio padrão do Resend.</p>'
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

testEmailFinal()
