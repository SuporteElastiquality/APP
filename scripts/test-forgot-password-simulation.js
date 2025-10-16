// Simulação exata do que a API de recuperação de senha faz
const { PrismaClient } = require('@prisma/client')
// Simular a função de envio de email
async function sendPasswordResetEmail(email, name, resetToken) {
  const { Resend } = require('resend')
  const resend = new Resend('re_BkdZuoJY_DuGJw5VbWroACMMxEL8MnxF9')
  
  try {
    const resetUrl = `https://appelastiquality.vercel.app/auth/reset-password?token=${resetToken}`
    
    const result = await resend.emails.send({
      from: 'Elastiquality <onboarding@resend.dev>',
      to: [email],
      subject: 'Recuperação de senha - Elastiquality 🔐',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6; font-size: 28px;">Recuperação de Senha</h1>
          </div>
          
          <div style="background: #F8FAFC; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #1E293B; margin-bottom: 15px;">Olá, ${name}! 👋</h2>
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
    
    console.log(`Email de recuperação enviado para ${email}`)
    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}
const crypto = require('crypto')

const prisma = new PrismaClient()

async function simulateForgotPassword() {
  try {
    console.log('🧪 Simulando processo de recuperação de senha...')
    
    const email = 'jdterra@outlook.com'
    
    // 1. Buscar usuário pelo email
    console.log(`\n1. Buscando usuário: ${email}`)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado!')
      return
    }
    
    console.log('✅ Usuário encontrado:', user.name)
    
    // 2. Gerar token de recuperação
    console.log('\n2. Gerando token de recuperação...')
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hora
    
    console.log('✅ Token gerado:', resetToken.substring(0, 10) + '...')
    console.log('✅ Expira em:', resetTokenExpiry.toISOString())
    
    // 3. Salvar token no banco de dados
    console.log('\n3. Salvando token no banco de dados...')
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })
    
    console.log('✅ Token salvo no banco de dados')
    
    // 4. Enviar email de recuperação
    console.log('\n4. Enviando email de recuperação...')
    try {
      const result = await sendPasswordResetEmail(email, user.name || 'Usuário', resetToken)
      
      if (result.success) {
        console.log('✅ Email enviado com sucesso!')
        console.log('📧 Verifique sua caixa de entrada!')
      } else {
        console.log('❌ Erro ao enviar email:', result.error)
      }
    } catch (emailError) {
      console.log('❌ Erro ao enviar email:', emailError.message)
    }
    
  } catch (error) {
    console.error('❌ Erro na simulação:', error)
  } finally {
    await prisma.$disconnect()
  }
}

simulateForgotPassword()
