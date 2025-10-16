// Teste usando domínio padrão do Resend
const https = require('https')

function testResendDefault() {
  return new Promise((resolve, reject) => {
    const emailData = {
      from: 'Elastiquality <onboarding@resend.dev>',
      to: ['jdterra@outlook.com'],
      subject: 'Teste de Email - Elastiquality',
      html: '<h1>Teste de Email</h1><p>Este é um teste usando o domínio padrão do Resend.</p>'
    }
    
    const data = JSON.stringify(emailData)
    
    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer re_BkdZuoJY_DuGJw5VbWroACMMxEL8MnxF9`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }
    
    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData)
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers
          })
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers,
            parseError: error.message
          })
        }
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    req.write(data)
    req.end()
  })
}

async function testDefault() {
  console.log('🧪 Testando com domínio padrão do Resend...')
  
  try {
    const result = await testResendDefault()
    console.log(`   Status: ${result.status}`)
    console.log(`   Headers:`, result.headers['content-type'])
    console.log(`   Data:`, JSON.stringify(result.data, null, 2))
    
    if (result.parseError) {
      console.log(`   Parse Error: ${result.parseError}`)
    }
    
    if (result.status === 200) {
      console.log('   ✅ Email enviado com sucesso!')
      console.log(`   ID do email: ${result.data.id}`)
    } else if (result.status === 422) {
      console.log('   ❌ Erro de validação')
      console.log('   Detalhes:', result.data)
    } else {
      console.log('   ❌ Erro na API do Resend')
    }
    
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`)
  }
}

testDefault()
