// Teste da API de registro para verificar envio de email de boas-vindas
const fetch = require('node-fetch').default

async function testRegistrationAPI() {
  console.log('🧪 Testando API de registro...\n')
  
  const testUser = {
    name: 'Teste Email Boas vindas',
    email: 'teste.boasvindas@exemplo.com',
    password: 'Teste123!',
    confirmPassword: 'Teste123!',
    userType: 'CLIENT',
    phone: '912345678',
    district: 'Lisboa',
    council: 'Lisboa',
    parish: 'Campolide',
    postalCode: '1000-001'
  }
  
  try {
    console.log('📤 Enviando requisição para API de registro...')
    console.log('📧 Email de teste:', testUser.email)
    
    const response = await fetch('https://appelastiquality-328pjpicm-suporte-elastiquality.vercel.app/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    })
    
    const data = await response.json()
    
    console.log('📊 Status da resposta:', response.status)
    console.log('📄 Dados da resposta:', JSON.stringify(data, null, 2))
    
    if (response.ok) {
      console.log('\n✅ Registro realizado com sucesso!')
      console.log('📧 Email de boas-vindas deve ter sido enviado para:', testUser.email)
      console.log('🔍 Verifique a caixa de entrada do email de teste')
    } else {
      console.log('\n❌ Erro no registro:', data.error || 'Erro desconhecido')
    }
    
  } catch (error) {
    console.log('\n❌ Erro na requisição:', error.message)
  }
}

testRegistrationAPI()
