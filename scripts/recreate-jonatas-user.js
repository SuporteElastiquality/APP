// Recriar usuário Jonatas Dias Terra
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function recreateJonatasUser() {
  console.log('👤 Recriando usuário Jonatas Dias Terra...\n')
  
  try {
    // Verificar se já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'jdterra@outlook.com' }
    })
    
    if (existingUser) {
      console.log('✅ Usuário já existe:', existingUser.name)
      return existingUser
    }
    
    // Criar usuário
    const hashedPassword = await bcrypt.hash('Jonatas2024!', 12)
    
    const user = await prisma.user.create({
      data: {
        name: 'Jonatas Dias Terra',
        email: 'jdterra@outlook.com',
        password: hashedPassword,
        userType: 'PROFESSIONAL',
        emailVerified: new Date(),
        phone: '912345678',
        professionalProfile: {
          create: {
            district: 'Lisboa',
            council: 'Lisboa',
            parish: 'Lisboa',
            address: 'Rua de Teste, 123',
            postalCode: '1000-001',
            specialties: 'Canalizações, Eletricidade, Pintura, Carpintaria, Alvenaria',
            experience: 'Profissional experiente em diversos serviços',
            bio: 'Profissional dedicado e experiente',
            rating: 4.8,
            totalReviews: 25,
            completedJobs: 150,
            isVerified: true,
            isActive: true,
            isPremium: false
          }
        }
      }
    })
    
    console.log('✅ Usuário criado com sucesso:')
    console.log('   - Nome:', user.name)
    console.log('   - Email:', user.email)
    console.log('   - Tipo:', user.userType)
    console.log('   - ID:', user.id)
    console.log('   - Senha: Jonatas2024!')
    
    return user
    
  } catch (error) {
    console.log('❌ Erro ao criar usuário:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

recreateJonatasUser()
