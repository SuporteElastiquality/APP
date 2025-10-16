// Verificar logs do Resend
const { Resend } = require('resend')

const resend = new Resend('re_BkdZuoJY_DuGJw5VbWroACMMxEL8MnxF9')

async function checkResendLogs() {
  console.log('📊 Verificando logs do Resend...\n')
  
  try {
    // Tentar listar emails enviados (pode não funcionar com API key restrita)
    console.log('🔍 Tentando listar emails enviados...')
    
    const emails = await resend.emails.list({
      limit: 10
    })
    
    console.log('✅ Emails encontrados:', emails.data?.length || 0)
    
    if (emails.data && emails.data.length > 0) {
      emails.data.forEach((email, index) => {
        console.log(`${index + 1}. Para: ${email.to}`)
        console.log(`   - Assunto: ${email.subject}`)
        console.log(`   - Status: ${email.last_event}`)
        console.log(`   - Enviado em: ${email.created_at}`)
        console.log('')
      })
    }
    
  } catch (error) {
    console.log('❌ Erro ao verificar logs:', error.message)
    
    if (error.message.includes('restricted')) {
      console.log('💡 A API key está restrita e não permite listar emails')
      console.log('✅ Isso é normal para chaves de produção')
    }
  }
  
  console.log('\n🏁 Verificação concluída!')
}

checkResendLogs()
