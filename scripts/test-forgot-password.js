const fetch = require('node-fetch').default || require('node-fetch')

async function testForgotPassword() {
  const testEmails = [
    'jdterra@outlook.com',
    'elastiquality@elastiquality.pt'
  ]

  for (const email of testEmails) {
    console.log(`\n🧪 Testando recuperação de senha para: ${email}`)
    
    try {
      const response = await fetch('https://appelastiquality-8kgzassy9-suporte-elastiquality.vercel.app/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      
      console.log(`   Status: ${response.status}`)
      console.log(`   Resposta:`, data)
      
      if (response.ok) {
        console.log('   ✅ Requisição bem-sucedida')
      } else {
        console.log('   ❌ Erro na requisição')
      }
      
    } catch (error) {
      console.log(`   ❌ Erro de conexão: ${error.message}`)
    }
  }
}

testForgotPassword()
