import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendSystemNotification } from '@/lib/notification-email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, message, actionUrl, recipientEmail, recipientName } = body

    console.log('Recebida requisição de notificação:', { type, title, message, recipientEmail })

    // Validar dados básicos
    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Tipo, título e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Enviar notificação por email
    if (recipientEmail) {
      try {
        console.log('Enviando notificação por email para:', recipientEmail)
        const result = await sendSystemNotification({
          recipientName: recipientName || 'Usuário',
          recipientEmail,
          title,
          message,
          actionUrl
        })
        console.log('Resultado do envio de email:', result)
      } catch (error) {
        console.error('Erro ao enviar notificação por email:', error)
        return NextResponse.json(
          { error: 'Erro ao enviar notificação por email', details: error.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Notificação enviada com sucesso' 
    })
  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification', details: error.message },
      { status: 500 }
    )
  }
}
