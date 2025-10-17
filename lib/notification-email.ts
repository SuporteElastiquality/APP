import { Resend } from 'resend'
import { NewMessageEmail } from '@/emails/NewMessageEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

interface NewMessageNotificationData {
  recipientName: string
  recipientEmail: string
  senderName: string
  messagePreview: string
  conversationUrl: string
}

export async function sendNewMessageNotification({
  recipientName,
  recipientEmail,
  senderName,
  messagePreview,
  conversationUrl
}: NewMessageNotificationData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Elastiquality <notificacoes@elastiquality.pt>',
      to: [recipientEmail],
      subject: `Nova mensagem de ${senderName} - Elastiquality`,
      react: NewMessageEmail({
        recipientName,
        senderName,
        messagePreview,
        conversationUrl
      }),
    })

    if (error) {
      console.error('Erro ao enviar notificação de mensagem:', error)
      return { success: false, error }
    }

    console.log('Notificação de mensagem enviada:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao enviar notificação de mensagem:', error)
    return { success: false, error }
  }
}

interface SystemNotificationData {
  recipientName: string
  recipientEmail: string
  title: string
  message: string
  actionUrl?: string
}

export async function sendSystemNotification({
  recipientName,
  recipientEmail,
  title,
  message,
  actionUrl
}: SystemNotificationData) {
  try {
    console.log('Tentando enviar notificação do sistema:', {
      recipientName,
      recipientEmail,
      title,
      message
    })

    // Verificar se a API key está configurada
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY não configurada!')
      return { success: false, error: 'RESEND_API_KEY não configurada' }
    }

    const { data, error } = await resend.emails.send({
      from: 'Elastiquality <notificacoes@elastiquality.pt>',
      to: [recipientEmail],
      subject: `${title} - Elastiquality`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://elastiquality.pt/logo.png" alt="Elastiquality" style="height: 60px;">
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin: 0 0 10px 0;">${title}</h2>
            <p style="color: #374151; margin: 0; line-height: 1.5;">${message}</p>
          </div>
          
          ${actionUrl ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${actionUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
                Ver Detalhes
              </a>
            </div>
          ` : ''}
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>Esta é uma notificação automática da Elastiquality.</p>
            <p>Se você não deseja receber estas notificações, entre em contato conosco.</p>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('Erro ao enviar notificação do sistema:', error)
      return { success: false, error }
    }

    console.log('Notificação do sistema enviada com sucesso:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao enviar notificação do sistema:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
