// Verificar se a chave da API do Resend está configurada
console.log('🔑 Verificando configuração do Resend...')

const apiKey = process.env.RESEND_API_KEY || 're_BkdZuoJY_DuGJw5VbWroACMMxEL8MnxF9'

console.log(`   Chave da API: ${apiKey ? 'Configurada' : 'Não configurada'}`)
console.log(`   Tamanho da chave: ${apiKey ? apiKey.length : 0} caracteres`)
console.log(`   Prefixo: ${apiKey ? apiKey.substring(0, 10) + '...' : 'N/A'}`)

if (apiKey && apiKey.startsWith('re_')) {
  console.log('   ✅ Formato da chave parece correto')
} else {
  console.log('   ❌ Formato da chave pode estar incorreto')
}

// Testar com curl
const { exec } = require('child_process')

const curlCommand = `curl -X POST https://api.resend.com/emails \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "Elastiquality <noreply@elastiquality.vercel.app>",
    "to": ["jdterra@outlook.com"],
    "subject": "Teste de Email - Elastiquality",
    "html": "<h1>Teste de Email</h1><p>Este é um teste de envio de email.</p>"
  }'`

console.log('\n🧪 Testando com curl...')
console.log('Comando:', curlCommand)

exec(curlCommand, (error, stdout, stderr) => {
  if (error) {
    console.log('   ❌ Erro no curl:', error.message)
    return
  }
  
  if (stderr) {
    console.log('   ⚠️ Stderr:', stderr)
  }
  
  console.log('   📤 Resposta:', stdout)
})
