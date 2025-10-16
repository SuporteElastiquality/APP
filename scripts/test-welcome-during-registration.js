// Teste específico do envio de email durante registro
const { sendWelcomeEmail } = require('../lib/email')

async function testWelcomeEmailFunction() {
  console.log('🧪 Testando função sendWelcomeEmail diretamente...\n')
  
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
    console.log(`📧 Testando envio para: ${user.email}`)
    
    try {
      const result = await sendWelcomeEmail(user.email, user.name)
      
      if (result.success) {
        console.log(`   ✅ Email enviado com sucesso!`)
        console.log(`   📧 Verifique a caixa de entrada de ${user.email}`)
      } else {
        console.log(`   ❌ Falha no envio:`, result.error)
      }
      
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`)
    }
    
    console.log('') // Linha em branco
  }
  
  console.log('🏁 Teste concluído!')
}

testWelcomeEmailFunction()
