// Teste para verificar configuração de domínio do Resend
const https = require('https')

function testResendDomain() {
  return new Promise((resolve, reject) => {
    const emailData = {
      from: 'Elastiquality <noreply@elastiquality.vercel.app>',
      to: ['jdterra@outlook.com'],
      subject: 'Teste de Domínio - Elastiquality',
      html: '<h1>Teste de Domínio</h1><p>Este é um teste para verificar se o domínio está configurado corretamente.</p>'
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

async function testDomain() {
  console.log('🧪 Testando configuração de domínio do Resend...')
  
  try {
    const result = await testResendDomain()
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
      console.log('   ❌ Erro de validação - possivelmente domínio não verificado')
      if (result.data.message && result.data.message.includes('domain')) {
        console.log('   💡 O domínio elastiquality.vercel.app pode não estar verificado no Resend')
      }
    } else {
      console.log('   ❌ Erro na API do Resend')
    }
    
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`)
  }
}

testDomain()
