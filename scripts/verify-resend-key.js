// Verificar se a chave da API do Resend está correta
const https = require('https')

function verifyResendKey() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/domains',
      method: 'GET',
      headers: {
        'Authorization': `Bearer re_BkdZuoJY_DuGJw5VbWroACMMxEL8MnxF9`,
        'Content-Type': 'application/json'
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
    
    req.end()
  })
}

async function verifyKey() {
  console.log('🔑 Verificando chave da API do Resend...')
  
  try {
    const result = await verifyResendKey()
    console.log(`   Status: ${result.status}`)
    console.log(`   Headers:`, result.headers['content-type'])
    console.log(`   Data:`, JSON.stringify(result.data, null, 2))
    
    if (result.parseError) {
      console.log(`   Parse Error: ${result.parseError}`)
    }
    
    if (result.status === 200) {
      console.log('   ✅ Chave da API válida!')
      console.log(`   Domínios configurados: ${result.data.data ? result.data.data.length : 0}`)
    } else if (result.status === 401) {
      console.log('   ❌ Chave da API inválida ou expirada')
    } else if (result.status === 403) {
      console.log('   ❌ Acesso negado - verificar permissões da chave')
    } else {
      console.log('   ❌ Erro na API do Resend')
    }
    
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`)
  }
}

verifyKey()
