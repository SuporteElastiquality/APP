// Teste para verificar se a API funciona via navegador
// Execute este código no console do navegador

async function testForgotPasswordAPI() {
  const emails = ['jdterra@outlook.com', 'elastiquality@elastiquality.pt']
  
  for (const email of emails) {
    console.log(`\n🧪 Testando API para: ${email}`)
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
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

// Executar teste
testForgotPasswordAPI()
