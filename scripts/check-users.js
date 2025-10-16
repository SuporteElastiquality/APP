const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    console.log('🔍 Verificando usuários no banco de dados...')

    // Verificar jdterra@outlook.com
    const jdterra = await prisma.user.findUnique({
      where: { email: 'jdterra@outlook.com' }
    })

    console.log('\n📧 Usuário jdterra@outlook.com:')
    if (jdterra) {
      console.log('✅ Usuário encontrado!')
      console.log(`   ID: ${jdterra.id}`)
      console.log(`   Nome: ${jdterra.name}`)
      console.log(`   Tipo: ${jdterra.userType}`)
      console.log(`   Tem senha: ${jdterra.password ? 'Sim' : 'Não'}`)
      console.log(`   Criado em: ${jdterra.createdAt}`)
    } else {
      console.log('❌ Usuário não encontrado!')
    }

    // Verificar elastiquality@elastiquality.pt
    const elastiquality = await prisma.user.findUnique({
      where: { email: 'elastiquality@elastiquality.pt' }
    })

    console.log('\n📧 Usuário elastiquality@elastiquality.pt:')
    if (elastiquality) {
      console.log('✅ Usuário encontrado!')
      console.log(`   ID: ${elastiquality.id}`)
      console.log(`   Nome: ${elastiquality.name}`)
      console.log(`   Tipo: ${elastiquality.userType}`)
      console.log(`   Tem senha: ${elastiquality.password ? 'Sim' : 'Não'}`)
      console.log(`   Criado em: ${elastiquality.createdAt}`)
    } else {
      console.log('❌ Usuário não encontrado!')
    }

    // Listar todos os usuários
    console.log('\n📋 Todos os usuários no banco:')
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        password: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name}) - ${user.userType} - Senha: ${user.password ? 'Sim' : 'Não'}`)
    })

  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
