import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: 'Elastiquality <noreply@elastiquality.pt>',
      to: [email],
      subject: 'Bem-vindo ao Elastiquality! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6; font-size: 28px; margin: 0 0 20px 0;">Bem-vindo à</h1>
            <img src="https://appelastiquality-rpimnnckw-suporte-elastiquality.vercel.app/logo.png" 
                 alt="Elastiquality" 
                 style="height: 60px;">
          </div>
          
          <div style="background: #F8FAFC; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #1E293B; margin-bottom: 15px;">Olá, ${name}! 👋</h2>
            <p style="color: #64748B; line-height: 1.6; margin-bottom: 20px;">
              Sua conta foi criada com sucesso! Agora você pode acessar todos os nossos serviços 
              e conectar-se com profissionais certificados em Portugal.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #3B82F6; margin-bottom: 15px;">🎯 O que você pode fazer agora:</h3>
              <ul style="color: #64748B; line-height: 1.8;">
                <li>Explorar serviços disponíveis</li>
                <li>Encontrar profissionais na sua região</li>
                <li>Contratar serviços com segurança</li>
                <li>Acompanhar seus pedidos em tempo real</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://elastiquality.pt" 
                 style="background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Aceder Minha Conta
              </a>
            </div>
          </div>
          
          <div style="text-align: center; color: #94A3B8; font-size: 14px; margin-top: 30px;">
            <p>Este email foi enviado automaticamente. Não responda a este email.</p>
            <p>© 2024 Elastiquality. Todos os direitos reservados.</p>
          </div>
        </div>
      `
    })
    
    console.log('Welcome email sent successfully to:', email)
    return { success: true }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}

export async function sendNewsletterEmail(email: string, name: string, content: string) {
  try {
    await resend.emails.send({
      from: 'Elastiquality Newsletter <newsletter@elastiquality.vercel.app>',
      to: [email],
      subject: '📰 Newsletter Elastiquality - Novidades e Dicas',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6; font-size: 24px;">📰 Newsletter Elastiquality</h1>
          </div>
          
          <div style="background: #F8FAFC; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #1E293B; margin-bottom: 15px;">Olá, ${name}! 👋</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              ${content}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://appelastiquality.vercel.app" 
                 style="background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Visitar Elastiquality
              </a>
            </div>
          </div>
          
          <div style="text-align: center; color: #94A3B8; font-size: 14px; margin-top: 30px;">
            <p>Recebeu este email porque está inscrito na nossa newsletter.</p>
            <p><a href="#" style="color: #94A3B8;">Cancelar inscrição</a> | <a href="#" style="color: #94A3B8;">Preferências</a></p>
            <p>© 2024 Elastiquality. Todos os direitos reservados.</p>
          </div>
        </div>
      `
    })
    
    console.log('Newsletter sent successfully to:', email)
    return { success: true }
  } catch (error) {
    console.error('Error sending newsletter:', error)
    return { success: false, error }
  }
}

export async function sendPasswordResetEmail(email: string, name: string, resetToken: string) {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL || 'https://elastiquality.pt'}/auth/reset-password?token=${resetToken}`
    
    await resend.emails.send({
      from: 'Elastiquality <noreply@elastiquality.pt>',
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

export async function sendEmailVerification(email: string, token: string, name: string) {
  try {
    const verificationUrl = `https://elastiquality.pt/api/auth/verify-email?token=${token}`
    
    await resend.emails.send({
      from: 'Elastiquality <noreply@elastiquality.pt>',
      to: [email],
      subject: '📧 Verifique seu email - Elastiquality',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://appelastiquality-rpimnnckw-suporte-elastiquality.vercel.app/logo.png" 
                 alt="Elastiquality" 
                 style="height: 60px;">
          </div>
          
          <div style="background: #F8FAFC; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #1E293B; margin-bottom: 15px;">Verifique seu email, ${name}! 📧</h2>
            <p style="color: #64748B; line-height: 1.6; margin-bottom: 20px;">
              Para completar seu cadastro e garantir a segurança da sua conta, 
              precisamos verificar seu endereço de email.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="color: #64748B; margin-bottom: 20px;">Clique no botão abaixo para verificar seu email:</p>
              <a href="${verificationUrl}" 
                 style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Verificar Email
              </a>
            </div>
            
            <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #92400E; margin: 0; font-size: 14px;">
                <strong>⚠️ Importante:</strong> Este link expira em 24 horas. 
                Se não conseguir clicar no botão, copie e cole este link no seu navegador:
              </p>
              <p style="color: #92400E; margin: 10px 0 0 0; font-size: 12px; word-break: break-all;">
                ${verificationUrl}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; color: #94A3B8; font-size: 14px; margin-top: 30px;">
            <p>Este email foi enviado automaticamente. Não responda a este email.</p>
            <p>© 2024 Elastiquality. Todos os direitos reservados.</p>
          </div>
        </div>
      `
    })
    
    console.log(`Email de verificação enviado para ${email}`)
    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar email de verificação:', error)
    return { success: false, error }
  }
}
