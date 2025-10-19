// Sistema de notificações será implementado via Firebase
// import { NewMessageEmail } from '@/emails/NewMessageEmail'

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
    // TODO: Implementar notificações via Firebase
    console.log('📧 Notificação de nova mensagem (Firebase não implementado):')
    console.log(`Para: ${recipientName} (${recipientEmail})`)
    console.log(`De: ${senderName}`)
    console.log(`Mensagem: ${messagePreview}`)
    console.log(`URL: ${conversationUrl}`)
    
    return { success: true, data: { id: 'firebase-not-implemented' } }
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
    // TODO: Implementar notificações via Firebase
    console.log('📧 Notificação do sistema (Firebase não implementado):')
    console.log(`Para: ${recipientName} (${recipientEmail})`)
    console.log(`Título: ${title}`)
    console.log(`Mensagem: ${message}`)
    console.log(`URL: ${actionUrl || 'N/A'}`)
    
    return { success: true, data: { id: 'firebase-not-implemented' } }
  } catch (error) {
    console.error('Erro ao enviar notificação do sistema:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
