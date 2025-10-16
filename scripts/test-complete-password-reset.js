// Teste completo do sistema de recuperação de senha
const { Resend } = require('resend')
const { PrismaClient } = require('@prisma/client')

const resend = new Resend('re_BkdZuoJY_DuGJw5VbWroACMMxEL8MnxF9')
const prisma = new PrismaClient()

async function testCompletePasswordReset() {
  console.log('🔐 Teste completo do sistema de recuperação de senha...\n')
  
  const testEmail = 'jdterra@outlook.com'
  
  try {
    // 1. Verificar usuário
    console.log('1️⃣ Verificando usuário...')
    const user = await prisma.user.findUnique({
      where: { email: testEmail }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }
    
    console.log('✅ Usuário encontrado:', user.name)
    
    // 2. Gerar token de recuperação
    console.log('\n2️⃣ Gerando token de recuperação...')
    const resetToken = 'complete-test-' + Date.now()
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hora
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })
    
    console.log('✅ Token gerado e salvo:', resetToken)
    
    // 3. Enviar email
    console.log('\n3️⃣ Enviando email de recuperação...')
    const resetUrl = `https://appelastiquality-le8vwrd10-suporte-elastiquality.vercel.app/auth/reset-password?token=${resetToken}`
    
    const emailResult = await resend.emails.send({
      from: 'Elastiquality <noreply@elastiquality.pt>',
      to: [testEmail],
      subject: 'Recuperação de senha - Elastiquality 🔐',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6; font-size: 28px;">Recuperação de Senha</h1>
          </div>
          
          <div style="background: #F8FAFC; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #1E293B; margin-bottom: 15px;">Olá, ${user.name}! 👋</h2>
            <p style="color: #64748B; line-height: 1.6; margin-bottom: 20px;">
              Recebemos uma solicitação para redefinir a senha da sua conta Elastiquality.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="color: #64748B; margin-bottom: 20px;">
                Clique no botão abaixo para redefinir sua senha:
              </p>
              <a href="${resetUrl}" 
                 style="display: inline-block; background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Redefinir Senha
              </a>
            </div>
            
            <div style="background: #FEF3C7; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #92400E; margin: 0; font-size: 14px;">
                <strong>⚠️ Importante:</strong> Este link expira em 1 hora por motivos de segurança.
              </p>
            </div>
            
            <p style="color: #64748B; line-height: 1.6; font-size: 14px;">
              Se você não solicitou esta recuperação de senha, pode ignorar este email. 
              Sua senha permanecerá inalterada.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
            <p style="color: #94A3B8; font-size: 14px;">
              Este email foi enviado pela Elastiquality. Se você tiver dúvidas, entre em contato conosco.
            </p>
          </div>
        </div>
      `
    })
    
    if (emailResult.data?.id) {
      console.log('✅ Email enviado com sucesso!')
      console.log('📧 ID do email:', emailResult.data.id)
    } else {
      console.log('❌ Falha no envio do email')
      return
    }
    
    // 4. Testar validação do token
    console.log('\n4️⃣ Testando validação do token...')
    const validateResponse = await fetch(`https://appelastiquality-le8vwrd10-suporte-elastiquality.vercel.app/api/auth/validate-reset-token?token=${resetToken}`)
    
    if (validateResponse.ok) {
      console.log('✅ Token válido - pode ser usado para reset')
    } else {
      console.log('❌ Token inválido:', await validateResponse.text())
      return
    }
    
    // 5. Resumo final
    console.log('\n🎉 TESTE COMPLETO REALIZADO COM SUCESSO!')
    console.log('📧 Email enviado para:', testEmail)
    console.log('🔗 Link de recuperação:', resetUrl)
    console.log('⏰ Token expira em:', resetTokenExpiry.toISOString())
    console.log('\n💡 Instruções para o usuário:')
    console.log('1. Verifique a caixa de entrada de', testEmail)
    console.log('2. Clique no link "Redefinir Senha"')
    console.log('3. Digite uma nova senha')
    console.log('4. Confirme a nova senha')
    console.log('5. Clique em "Redefinir senha"')
    
  } catch (error) {
    console.log('❌ Erro no teste:', error.message)
  } finally {
    await prisma.$disconnect()
  }
  
  console.log('\n🏁 Teste concluído!')
}

testCompletePasswordReset()
