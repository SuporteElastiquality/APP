// Limpar dados fictícios do usuário Jonatas
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanFakeData() {
  console.log('🧹 Limpando dados fictícios do usuário Jonatas...\n')
  
  try {
    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: 'jdterra@outlook.com' },
      include: {
        professionalProfile: true
      }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }
    
    console.log('✅ Usuário encontrado:', user.name)
    
    // Limpar dados fictícios do perfil profissional
    if (user.professionalProfile) {
      await prisma.professionalProfile.update({
        where: { userId: user.id },
        data: {
          district: '',
          council: '',
          parish: '',
          address: '',
          postalCode: '',
          specialties: '',
          experience: '',
          bio: '',
          rating: 0,
          totalReviews: 0,
          completedJobs: 0,
          isVerified: false,
          isActive: true,
          isPremium: false
        }
      })
      
      console.log('✅ Dados fictícios removidos do perfil profissional')
    }
    
    // Limpar dados fictícios do usuário
    await prisma.user.update({
      where: { id: user.id },
      data: {
        phone: null
      }
    })
    
    console.log('✅ Dados fictícios removidos do usuário')
    console.log('✅ Usuário limpo e pronto para preenchimento real')
    
  } catch (error) {
    console.log('❌ Erro ao limpar dados:', error.message)
  } finally {
    await prisma.$disconnect()
  }
  
  console.log('\n🏁 Limpeza concluída!')
}

cleanFakeData()
