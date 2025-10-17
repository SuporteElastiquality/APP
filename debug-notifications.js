const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugNotifications() {
  try {
    console.log('=== DEBUG NOTIFICAÇÕES ===\n')

    // 1. Verificar usuários existentes
    console.log('1. USUÁRIOS EXISTENTES:')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        userType: true
      }
    })
    console.log(users)
    console.log()

    // 2. Verificar salas de chat
    console.log('2. SALAS DE CHAT:')
    const rooms = await prisma.chatRoom.findMany({
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })
    console.log(JSON.stringify(rooms, null, 2))
    console.log()

    // 3. Verificar mensagens recentes
    console.log('3. MENSAGENS RECENTES:')
    const recentMessages = await prisma.message.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        room: {
          include: {
            participants: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })
    console.log(JSON.stringify(recentMessages, null, 2))
    console.log()

    // 4. Testar envio de email
    console.log('4. TESTANDO ENVIO DE EMAIL:')
    const testEmail = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'system',
            title: 'Teste de Notificação',
            message: 'Esta é uma notificação de teste',
            recipientEmail: 'jdterra@outlook.com'
          }),
        })
        
        const result = await response.json()
        console.log('Resultado do teste de email:', result)
      } catch (error) {
        console.error('Erro no teste de email:', error)
      }
    }
    
    await testEmail()

  } catch (error) {
    console.error('Erro no debug:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugNotifications()
