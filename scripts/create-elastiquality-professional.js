const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createElastiqualityProfessional() {
  try {
    console.log('🌱 Criando usuário profissional Elastiquality...')

    // Verificar se já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'elastiquality@elastiquality.pt' }
    })

    if (existingUser) {
      console.log('⏭️  Usuário Elastiquality já existe, atualizando...')
      
      // Atualizar para profissional se não for
      if (existingUser.userType !== 'PROFESSIONAL') {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { userType: 'PROFESSIONAL' }
        })
        console.log('✅ Tipo de usuário atualizado para PROFESSIONAL')
      }

      // Verificar/atualizar perfil profissional
      const existingProfile = await prisma.professionalProfile.findUnique({
        where: { userId: existingUser.id }
      })

      if (existingProfile) {
        await prisma.professionalProfile.update({
          where: { userId: existingUser.id },
          data: {
            district: 'Lisboa',
            council: 'Lisboa',
            parish: 'Lisboa',
            specialties: 'Canalizações,Eletricidade,Pintura,Carpintaria,Alvenaria,Telhados,Aquecimento,Ar Condicionado,Jardinagem,Limpeza,Mudanças,Reparações Gerais,Construção,Renovação,Manutenção,Instalações,Reparações Automóveis,Informática,Fotografia,Catering,Organização de Eventos,Design,Consultoria',
            experience: 'Elastiquality é a plataforma líder em Portugal para conectar clientes com profissionais de serviços. Como intermediador oficial, garantimos a qualidade e confiabilidade de todos os serviços oferecidos através da nossa rede de profissionais verificados.',
            rating: 5.0,
            totalReviews: 1000,
            completedJobs: 5000,
            isVerified: true,
            isActive: true,
            isPremium: true
          }
        })
        console.log('✅ Perfil profissional atualizado')
      } else {
        await prisma.professionalProfile.create({
          data: {
            userId: existingUser.id,
            district: 'Lisboa',
            council: 'Lisboa',
            parish: 'Lisboa',
            specialties: 'Canalizações,Eletricidade,Pintura,Carpintaria,Alvenaria,Telhados,Aquecimento,Ar Condicionado,Jardinagem,Limpeza,Mudanças,Reparações Gerais,Construção,Renovação,Manutenção,Instalações,Reparações Automóveis,Informática,Fotografia,Catering,Organização de Eventos,Design,Consultoria',
            experience: 'Elastiquality é a plataforma líder em Portugal para conectar clientes com profissionais de serviços. Como intermediador oficial, garantimos a qualidade e confiabilidade de todos os serviços oferecidos através da nossa rede de profissionais verificados.',
            rating: 5.0,
            totalReviews: 1000,
            completedJobs: 5000,
            isVerified: true,
            isActive: true,
            isPremium: true
          }
        })
        console.log('✅ Perfil profissional criado')
      }

      console.log('🎉 Usuário Elastiquality atualizado com sucesso!')
      return
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash('Elastiquality2024!', 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: 'Elastiquality',
        email: 'elastiquality@elastiquality.pt',
        phone: '912345678',
        password: hashedPassword,
        userType: 'PROFESSIONAL',
      }
    })

    console.log('✅ Usuário Elastiquality criado com sucesso')

    // Criar perfil profissional
    await prisma.professionalProfile.create({
      data: {
        userId: user.id,
        district: 'Lisboa',
        council: 'Lisboa',
        parish: 'Lisboa',
        specialties: 'Canalizações,Eletricidade,Pintura,Carpintaria,Alvenaria,Telhados,Aquecimento,Ar Condicionado,Jardinagem,Limpeza,Mudanças,Reparações Gerais,Construção,Renovação,Manutenção,Instalações,Reparações Automóveis,Informática,Fotografia,Catering,Organização de Eventos,Design,Consultoria',
        experience: 'Elastiquality é a plataforma líder em Portugal para conectar clientes com profissionais de serviços. Como intermediador oficial, garantimos a qualidade e confiabilidade de todos os serviços oferecidos através da nossa rede de profissionais verificados.',
        rating: 5.0,
        totalReviews: 1000,
        completedJobs: 5000,
        isVerified: true,
        isActive: true,
        isPremium: true
      }
    })

    console.log('✅ Perfil profissional Elastiquality criado com sucesso')
    console.log('🎉 Usuário profissional Elastiquality criado com sucesso!')
    console.log('📧 Email: elastiquality@elastiquality.pt')
    console.log('🔑 Senha: Elastiquality2024!')
    console.log('⭐ Rating: 5.0 (1000 avaliações)')
    console.log('🏆 Status: Verificado, Ativo, Premium')
    console.log('🔧 Especialidades: Todas as categorias de serviços')

  } catch (error) {
    console.error('❌ Erro ao criar usuário Elastiquality:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createElastiqualityProfessional()
