import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendSystemNotification } from '@/lib/notification-email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, title, message, actionUrl, recipientEmail } = body

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
        await sendSystemNotification({
          recipientName: session.user.name || 'Usuário',
          recipientEmail,
          title,
          message,
          actionUrl
        })
      } catch (error) {
        console.error('Erro ao enviar notificação por email:', error)
        return NextResponse.json(
          { error: 'Erro ao enviar notificação por email' },
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
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
