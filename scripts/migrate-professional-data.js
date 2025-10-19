const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateProfessionalData() {
  try {
    console.log('Iniciando migração dos dados de profissionais...')

    // Buscar todos os perfis profissionais existentes
    const professionals = await prisma.professionalProfile.findMany({
      include: {
        user: true
      }
    })

    console.log(`Encontrados ${professionals.length} profissionais para migrar`)

    for (const professional of professionals) {
      console.log(`Migrando profissional: ${professional.user.name}`)
      
      // Migrar dados existentes
      const updateData = {
        // Manter dados existentes
        district: professional.district,
        council: professional.council,
        parish: professional.parish,
        address: professional.address,
        houseNumber: professional.houseNumber,
        apartment: professional.apartment,
        postalCode: professional.postalCode,
        experience: professional.experience,
        bio: professional.bio,
        rating: professional.rating,
        totalReviews: professional.totalReviews,
        completedJobs: professional.completedJobs,
        isVerified: professional.isVerified,
        isActive: professional.isActive,
        isPremium: professional.isPremium,
        
        // Novos campos com valores padrão
        workDistricts: [professional.district], // Usar o distrito atual como padrão
        categories: professional.category ? [professional.category] : ['construcao-reforma'],
        services: professional.specialties ? professional.specialties.split(',').map(s => s.trim()).filter(s => s.length > 0) : []
      }

      await prisma.professionalProfile.update({
        where: { id: professional.id },
        data: updateData
      })

      console.log(`  ✓ ${professional.user.name} migrado com sucesso`)
    }

    console.log('Migração concluída!')
  } catch (error) {
    console.error('Erro durante a migração:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateProfessionalData()
