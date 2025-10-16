const https = require('https')

function testFinalProduction() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email: 'jdterra@outlook.com' })
    
    const options = {
      hostname: 'appelastiquality-gl5pyrqb7-suporte-elastiquality.vercel.app',
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

async function testFinal() {
  console.log('🧪 Teste final da API de recuperação de senha em produção...')
  console.log('📧 URL:', 'https://appelastiquality-gl5pyrqb7-suporte-elastiquality.vercel.app')
  
  try {
    const result = await testFinalProduction()
    console.log(`   Status: ${result.status}`)
    console.log(`   Headers:`, result.headers['content-type'])
    console.log(`   Data:`, JSON.stringify(result.data, null, 2))
    
    if (result.parseError) {
      console.log(`   Parse Error: ${result.parseError}`)
    }
    
    if (result.status === 200) {
      console.log('   ✅ API funcionando perfeitamente!')
      console.log('   📧 Email deve ter sido enviado para jdterra@outlook.com')
      console.log('   📧 Verifique sua caixa de entrada!')
    } else {
      console.log('   ❌ Erro na API')
    }
    
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`)
  }
}

testFinal()
