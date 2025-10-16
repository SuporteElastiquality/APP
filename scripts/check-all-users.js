// Verificar todos os usuários no banco de dados
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAllUsers() {
  console.log('🔍 Verificando todos os usuários no banco de dados...\n')
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        createdAt: true,
        emailVerified: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`📊 Total de usuários encontrados: ${users.length}\n`)
    
    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado no banco de dados')
      console.log('💡 O banco pode ter sido resetado durante as atualizações do schema')
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`)
        console.log(`   - Tipo: ${user.userType}`)
        console.log(`   - Criado em: ${user.createdAt.toISOString()}`)
        console.log(`   - Email verificado: ${user.emailVerified ? 'Sim' : 'Não'}`)
        console.log('')
      })
    }
    
  } catch (error) {
    console.log('❌ Erro ao buscar usuários:', error.message)
  } finally {
    await prisma.$disconnect()
  }
  
  console.log('🏁 Verificação concluída!')
}

checkAllUsers()
