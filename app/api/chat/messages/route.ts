import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { messageSchema, messageQuerySchema, validateData } from '@/lib/validations'
import { sendNewMessageNotification } from '@/lib/notification-email'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const queryData = {
      roomId: searchParams.get('roomId'),
      limit: searchParams.get('limit') || '50',
      offset: searchParams.get('offset') || '0'
    }

    // Validar parâmetros de query com Zod
    const validation = messageQuerySchema.safeParse(queryData)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { roomId, limit, offset } = validation.data!

    // Verificar se o usuário tem acesso ao chat
    const room = await prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        participants: {
          some: {
            id: session.user.id
          }
        }
      }
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Buscar mensagens
    const messages = await prisma.message.findMany({
      where: {
        roomId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: limit,
      skip: offset
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validar dados com Zod
    const validation = validateData(messageSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.errors },
        { status: 400 }
      )
    }

    const { roomId, content, type } = validation.data!

    // Verificar se o usuário tem acesso ao chat e buscar participantes
    const room = await prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        participants: {
          some: {
            id: session.user.id
          }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Criar mensagem
    const message = await prisma.message.create({
      data: {
        roomId,
        senderId: session.user.id,
        content,
        type
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Atualizar última mensagem do chat
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { lastMessage: new Date() }
    })

    // Enviar notificação por email para o destinatário
    const recipient = room.participants.find(p => p.id !== session.user.id)
    if (recipient && recipient.name && recipient.email) {
      try {
        await sendNewMessageNotification({
          recipientName: recipient.name,
          recipientEmail: recipient.email,
          senderName: session.user.name || 'Usuário',
          messagePreview: content,
          conversationUrl: `${process.env.NEXTAUTH_URL}/messages?room=${roomId}`
        })
      } catch (error) {
        console.error('Erro ao enviar notificação de email:', error)
        // Não falhar a criação da mensagem se o email falhar
      }
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    )
  }
}
