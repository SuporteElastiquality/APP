// Testar API de recuperação de senha
const fetch = require('node-fetch').default

async function testForgotPasswordAPI() {
  console.log('🔐 Testando API de recuperação de senha...\n')
  
  const testEmail = 'jdterra@outlook.com'
  
  try {
    console.log(`📧 Enviando solicitação para: ${testEmail}`)
    
    const response = await fetch('https://appelastiquality-le8vwrd10-suporte-elastiquality.vercel.app/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail
      })
    })
    
    console.log('📊 Status da resposta:', response.status)
    console.log('📋 Headers:', Object.fromEntries(response.headers.entries()))
    
    const data = await response.text()
    console.log('📄 Resposta:', data)
    
    if (response.ok) {
      console.log('✅ Solicitação de recuperação enviada com sucesso!')
      console.log('📧 Verifique a caixa de entrada de', testEmail)
    } else {
      console.log('❌ Erro na solicitação:', data)
    }
    
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message)
  }
  
  console.log('\n🏁 Teste concluído!')
}

testForgotPasswordAPI()
