const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function checkOrCreateAdmin() {
  try {
    console.log('🔍 Verificando usuário admin...\n')

    // Verificar se o admin já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@elastiquality.pt' }
    })

    if (existingAdmin) {
      console.log('✅ Usuário admin encontrado!')
      console.log(`📧 Email: ${existingAdmin.email}`)
      console.log(`👤 Nome: ${existingAdmin.name}`)
      console.log(`🔐 Tem senha: ${existingAdmin.password ? 'Sim' : 'Não'}`)
      console.log(`📅 Criado em: ${existingAdmin.createdAt}`)
      
      if (existingAdmin.password) {
        console.log('\n🔑 Para fazer login, use:')
        console.log('Email: admin@elastiquality.pt')
        console.log('Senha: admin123')
      } else {
        console.log('\n⚠️  Usuário admin não tem senha configurada!')
        console.log('Criando senha...')
        
        const hashedPassword = await bcrypt.hash('admin123', 12)
        await prisma.user.update({
          where: { id: existingAdmin.id },
          data: { password: hashedPassword }
        })
        
        console.log('✅ Senha criada com sucesso!')
        console.log('🔑 Para fazer login, use:')
        console.log('Email: admin@elastiquality.pt')
        console.log('Senha: admin123')
      }
    } else {
      console.log('❌ Usuário admin não encontrado!')
      console.log('Criando usuário admin...')
      
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const admin = await prisma.user.create({
        data: {
          name: 'Administrador',
          email: 'admin@elastiquality.pt',
          password: hashedPassword,
          userType: 'CLIENT', // Tipo padrão, mas com acesso admin via email
          emailVerified: new Date()
        }
      })
      
      console.log('✅ Usuário admin criado com sucesso!')
      console.log(`📧 Email: ${admin.email}`)
      console.log(`👤 Nome: ${admin.name}`)
      console.log('🔑 Para fazer login, use:')
      console.log('Email: admin@elastiquality.pt')
      console.log('Senha: admin123')
    }

    console.log('\n🌐 Acesse o painel admin em: https://elastiquality.pt/admin')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkOrCreateAdmin()
