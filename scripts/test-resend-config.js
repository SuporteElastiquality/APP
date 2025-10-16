// Teste para verificar configuração do Resend
const https = require('https')

function testResendAPI() {
  return new Promise((resolve, reject) => {
    const emailData = {
      from: 'Elastiquality <noreply@elastiquality.vercel.app>',
      to: ['jdterra@outlook.com'],
      subject: 'Teste de Email - Elastiquality',
      html: '<h1>Teste de Email</h1><p>Este é um teste de envio de email.</p>'
    }
    
    const data = JSON.stringify(emailData)
    
    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY || 're_BkdZuoJY_DuGJw5VbWroACMMxEL8MnxF9'}`,
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

async function testResend() {
  console.log('🧪 Testando API do Resend diretamente...')
  
  try {
    const result = await testResendAPI()
    console.log(`   Status: ${result.status}`)
    console.log(`   Headers:`, result.headers['content-type'])
    console.log(`   Data:`, result.data)
    
    if (result.parseError) {
      console.log(`   Parse Error: ${result.parseError}`)
    }
    
    if (result.status === 200) {
      console.log('   ✅ API do Resend funcionando!')
    } else {
      console.log('   ❌ Erro na API do Resend')
    }
    
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`)
  }
}

testResend()
