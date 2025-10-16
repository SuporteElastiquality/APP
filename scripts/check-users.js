// Verificar usuários no banco de dados
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsers() {
  console.log('🔍 Verificando usuários no banco de dados...\n')
  
  const emails = ['claudia.simplicio@gmail.com', 'jdterra@outlook.com']
  
  for (const email of emails) {
    console.log(`📧 Verificando: ${email}`)
    
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          clientProfile: true,
          professionalProfile: true
        }
      })
      
      if (user) {
        console.log(`   ✅ Usuário encontrado:`)
        console.log(`   - ID: ${user.id}`)
        console.log(`   - Nome: ${user.name}`)
        console.log(`   - Tipo: ${user.userType}`)
        console.log(`   - Criado em: ${user.createdAt}`)
        console.log(`   - Email verificado: ${user.emailVerified ? 'Sim' : 'Não'}`)
        console.log(`   - Tem senha: ${user.password ? 'Sim' : 'Não'}`)
        
        if (user.clientProfile) {
          console.log(`   - Perfil cliente: Sim`)
          console.log(`   - Distrito: ${user.clientProfile.district}`)
          console.log(`   - Conselho: ${user.clientProfile.council}`)
        } else {
          console.log(`   - Perfil cliente: Não`)
        }
        
        if (user.professionalProfile) {
          console.log(`   - Perfil profissional: Sim`)
        } else {
          console.log(`   - Perfil profissional: Não`)
        }
      } else {
        console.log(`   ❌ Usuário não encontrado no banco de dados`)
      }
      
    } catch (error) {
      console.log(`   ❌ Erro ao buscar usuário: ${error.message}`)
    }
    
    console.log('') // Linha em branco
  }
  
  await prisma.$disconnect()
  console.log('🏁 Verificação concluída!')
}

checkUsers()