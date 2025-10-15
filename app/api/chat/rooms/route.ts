import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { chatRoomSchema, validateData } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Buscar chats do usuário
    const rooms = await prisma.chatRoom.findMany({
      where: {
        participants: {
          some: {
            id: session.user.id
          }
        }
      },
      include: {
        participants: {
          where: {
            id: {
              not: session.user.id
            }
          },
          select: {
            id: true,
            name: true,
            image: true,
            userType: true
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        lastMessage: 'desc'
      }
    })

    return NextResponse.json(rooms)
  } catch (error) {
    console.error('Error fetching chat rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat rooms' },
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
    const validation = validateData(chatRoomSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.errors },
        { status: 400 }
      )
    }

    const { participantId, type } = validation.data!

    // Verificar se já existe um chat entre os usuários
    const existingRoom = await prisma.chatRoom.findFirst({
      where: {
        type: 'DIRECT',
        participants: {
          every: {
            id: {
              in: [session.user.id, participantId]
            }
          }
        }
      },
      include: {
        participants: true
      }
    })

    if (existingRoom) {
      return NextResponse.json(existingRoom)
    }

    // Verificar se o participante existe
    const participant = await prisma.user.findUnique({
      where: { id: participantId }
    })

    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 })
    }

    // Criar novo chat
    const room = await prisma.chatRoom.create({
      data: {
        type,
        participants: {
          connect: [
            { id: session.user.id },
            { id: participantId }
          ]
        }
      },
      include: {
        participants: {
          where: {
            id: {
              not: session.user.id
            }
          },
          select: {
            id: true,
            name: true,
            image: true,
            userType: true
          }
        }
      }
    })

    return NextResponse.json(room)
  } catch (error) {
    console.error('Error creating chat room:', error)
    return NextResponse.json(
      { error: 'Failed to create chat room' },
      { status: 500 }
    )
  }
}
