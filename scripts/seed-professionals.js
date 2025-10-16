const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const professionals = [
  {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '912345678',
    password: 'Teste123!',
    userType: 'PROFESSIONAL',
    specialties: 'Eletricidade,Instalações,Reparações Gerais',
    experience: 'Mais de 10 anos de experiência em eletricidade residencial e comercial. Especializado em instalações elétricas, reparações e manutenção preventiva.',
    district: 'Braga',
    council: 'Braga',
    parish: 'Braga',
    rating: 4.8,
    completedJobs: 156
  },
  {
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '923456789',
    password: 'Teste123!',
    userType: 'PROFESSIONAL',
    specialties: 'Canalizações,Reparações,Instalações',
    experience: 'Especialista em canalizações há 8 anos. Atendo emergências 24h e faço instalações completas.',
    district: 'Braga',
    council: 'Braga',
    parish: 'Braga',
    rating: 4.9,
    completedJobs: 203
  },
  {
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@email.com',
    phone: '934567890',
    password: 'Teste123!',
    userType: 'PROFESSIONAL',
    specialties: 'Pintura,Alvenaria,Construção',
    experience: 'Pintor profissional com 15 anos de experiência. Trabalho com tintas ecológicas e técnicas modernas.',
    district: 'Braga',
    council: 'Braga',
    parish: 'Braga',
    rating: 4.7,
    completedJobs: 89
  },
  {
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '945678901',
    password: 'Teste123!',
    userType: 'PROFESSIONAL',
    specialties: 'Jardinagem,Limpeza,Manutenção',
    experience: 'Especialista em jardinagem e paisagismo. Ofereço serviços de limpeza e manutenção de jardins.',
    district: 'Braga',
    council: 'Braga',
    parish: 'Braga',
    rating: 4.6,
    completedJobs: 124
  },
  {
    name: 'Pedro Alves',
    email: 'pedro.alves@email.com',
    phone: '956789012',
    password: 'Teste123!',
    userType: 'PROFESSIONAL',
    specialties: 'Carpintaria,Móveis,Reparações',
    experience: 'Carpinteiro especializado em móveis sob medida e reparações. Trabalho com madeiras nobres.',
    district: 'Braga',
    council: 'Braga',
    parish: 'Braga',
    rating: 4.8,
    completedJobs: 67
  },
  {
    name: 'Sofia Martins',
    email: 'sofia.martins@email.com',
    phone: '967890123',
    password: 'Teste123!',
    userType: 'PROFESSIONAL',
    specialties: 'Limpeza,Organização,Manutenção',
    experience: 'Serviços de limpeza residencial e comercial. Especializada em organização e manutenção de espaços.',
    district: 'Braga',
    council: 'Braga',
    parish: 'Braga',
    rating: 4.5,
    completedJobs: 178
  }
]

async function seedProfessionals() {
  try {
    console.log('🌱 Iniciando seed de profissionais...')

    for (const prof of professionals) {
      // Verificar se já existe
      const existing = await prisma.user.findUnique({
        where: { email: prof.email }
      })

      if (existing) {
        console.log(`⏭️  Profissional ${prof.name} já existe, pulando...`)
        continue
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(prof.password, 12)

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          name: prof.name,
          email: prof.email,
          phone: prof.phone,
          password: hashedPassword,
          userType: prof.userType,
        }
      })

      // Criar perfil profissional
      await prisma.professionalProfile.create({
        data: {
          userId: user.id,
          district: prof.district,
          council: prof.council,
          parish: prof.parish,
          specialties: prof.specialties,
          experience: prof.experience,
          rating: prof.rating,
          completedJobs: prof.completedJobs
        }
      })

      console.log(`✅ Profissional ${prof.name} criado com sucesso`)
    }

    console.log('🎉 Seed de profissionais concluído!')
  } catch (error) {
    console.error('❌ Erro no seed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedProfessionals()
