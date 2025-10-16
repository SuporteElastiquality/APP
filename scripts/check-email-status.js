// Verificar status do email no Resend
const { Resend } = require('resend')

const resend = new Resend('re_BkdZuoJY_DuGJw5VbWroACMMxEL8MnxF9')

async function checkEmailStatus() {
  console.log('📧 Verificando status dos emails enviados...')
  
  try {
    // Tentar enviar um email de teste simples
    const result = await resend.emails.send({
      from: 'Elastiquality <onboarding@resend.dev>',
      to: ['suporte@elastiquality.pt'],
      subject: 'Teste de Status - Elastiquality',
      html: '<h1>Teste de Status</h1><p>Este é um teste para verificar se os emails estão sendo enviados.</p>'
    })
    
    console.log('✅ Email de teste enviado!')
    console.log('Resposta:', JSON.stringify(result, null, 2))
    
    if (result.data && result.data.id) {
      console.log(`📧 ID do email: ${result.data.id}`)
      console.log('📧 Verifique suporte@elastiquality.pt!')
    }
    
  } catch (error) {
    console.log('❌ Erro ao enviar email de teste:')
    console.log(`   Status: ${error.statusCode || 'N/A'}`)
    console.log(`   Mensagem: ${error.message}`)
    
    if (error.message.includes('rate limit')) {
      console.log('   ⚠️ Rate limit atingido. Aguarde alguns minutos.')
    }
  }
}

checkEmailStatus()
