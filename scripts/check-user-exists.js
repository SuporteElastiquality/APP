const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUserExists() {
  try {
    console.log('🔍 Verificando se o usuário jdterra@outlook.com existe...')

    const user = await prisma.user.findUnique({
      where: { email: 'jdterra@outlook.com' },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        password: true,
        createdAt: true
      }
    })

    if (user) {
      console.log('✅ Usuário encontrado!')
      console.log(`   ID: ${user.id}`)
      console.log(`   Nome: ${user.name}`)
      console.log(`   Tipo: ${user.userType}`)
      console.log(`   Tem senha: ${user.password ? 'Sim' : 'Não'}`)
      console.log(`   Criado em: ${user.createdAt}`)
    } else {
      console.log('❌ Usuário não encontrado!')
    }

    // Verificar também elastiquality@elastiquality.pt
    console.log('\n🔍 Verificando se o usuário elastiquality@elastiquality.pt existe...')

    const elastiqualityUser = await prisma.user.findUnique({
      where: { email: 'elastiquality@elastiquality.pt' },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        password: true,
        createdAt: true
      }
    })

    if (elastiqualityUser) {
      console.log('✅ Usuário Elastiquality encontrado!')
      console.log(`   ID: ${elastiqualityUser.id}`)
      console.log(`   Nome: ${elastiqualityUser.name}`)
      console.log(`   Tipo: ${elastiqualityUser.userType}`)
      console.log(`   Tem senha: ${elastiqualityUser.password ? 'Sim' : 'Não'}`)
      console.log(`   Criado em: ${elastiqualityUser.createdAt}`)
    } else {
      console.log('❌ Usuário Elastiquality não encontrado!')
    }

  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserExists()
