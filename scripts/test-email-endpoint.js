const https = require('https')

function makeRequest(email) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email })
    
    const options = {
      hostname: 'appelastiquality-ei5dlusei-suporte-elastiquality.vercel.app',
      port: 443,
      path: '/api/test-email',
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

async function testEmailEndpoint() {
  const emails = ['jdterra@outlook.com', 'elastiquality@elastiquality.pt']
  
  for (const email of emails) {
    console.log(`\n🧪 Testando endpoint de email para: ${email}`)
    
    try {
      const result = await makeRequest(email)
      console.log(`   Status: ${result.status}`)
      console.log(`   Headers:`, result.headers['content-type'])
      console.log(`   Data:`, result.data)
      
      if (result.parseError) {
        console.log(`   Parse Error: ${result.parseError}`)
      }
      
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`)
    }
  }
}

testEmailEndpoint()
