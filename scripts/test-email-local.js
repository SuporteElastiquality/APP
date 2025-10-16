const { sendPasswordResetEmail } = require('../lib/email')

async function testEmail() {
  console.log('🧪 Testando envio de email local...')
  
  try {
    const result = await sendPasswordResetEmail(
      'jdterra@outlook.com',
      'Jonatas Dias Terra',
      'test-token-123'
    )
    
    console.log('Resultado:', result)
    
    if (result.success) {
      console.log('✅ Email enviado com sucesso!')
    } else {
      console.log('❌ Erro ao enviar email:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

testEmail()
