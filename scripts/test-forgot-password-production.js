const https = require('https')

function testForgotPasswordProduction() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email: 'jdterra@outlook.com' })
    
    const options = {
      hostname: 'appelastiquality-dvim6q40b-suporte-elastiquality.vercel.app',
      port: 443,
      path: '/api/auth/forgot-password',
      method: 'POST',
      headers: {
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

async function testProduction() {
  console.log('🧪 Testando API de recuperação de senha na produção...')
  
  try {
    const result = await testForgotPasswordProduction()
    console.log(`   Status: ${result.status}`)
    console.log(`   Headers:`, result.headers['content-type'])
    console.log(`   Data:`, JSON.stringify(result.data, null, 2))
    
    if (result.parseError) {
      console.log(`   Parse Error: ${result.parseError}`)
    }
    
    if (result.status === 200) {
      console.log('   ✅ API funcionando!')
    } else {
      console.log('   ❌ Erro na API')
    }
    
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`)
  }
}

testProduction()
