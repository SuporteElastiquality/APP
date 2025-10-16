const { PrismaClient } = require('@prisma/client');

async function testSimpleSearch() {
  console.log('🧪 Testando busca simples no banco de dados...');
  
  const prisma = new PrismaClient();
  
  try {
    // Teste 1: Buscar todos os profissionais
    console.log('\n1. Buscando todos os profissionais...');
    const allProfessionals = await prisma.user.findMany({
      where: {
        userType: 'PROFESSIONAL',
        professionalProfile: {
          isNot: null,
          isActive: true
        }
      },
      include: {
        professionalProfile: {
          select: {
            specialties: true,
            experience: true,
            district: true,
            council: true,
            parish: true,
            category: true,
            rating: true,
            completedJobs: true,
            isVerified: true,
            isPremium: true
          }
        }
      }
    });
    
    console.log(`✅ Profissionais encontrados: ${allProfessionals.length}`);
    
    if (allProfessionals.length > 0) {
      const prof = allProfessionals[0];
      console.log(`👤 Primeiro profissional: ${prof.name}`);
      console.log(`📧 Email: ${prof.email}`);
      console.log(`🏷️ Categoria: ${prof.professionalProfile?.category || 'N/A'}`);
      console.log(`📍 Localização: ${prof.professionalProfile?.parish}, ${prof.professionalProfile?.council}, ${prof.professionalProfile?.district}`);
    }
    
    // Teste 2: Buscar por categoria
    console.log('\n2. Buscando por categoria "reparacoes"...');
    const byCategory = await prisma.user.findMany({
      where: {
        userType: 'PROFESSIONAL',
        professionalProfile: {
          isNot: null,
          isActive: true,
          category: {
            contains: 'reparacoes',
            mode: 'insensitive'
          }
        }
      },
      include: {
        professionalProfile: {
          select: {
            specialties: true,
            experience: true,
            district: true,
            council: true,
            parish: true,
            category: true,
            rating: true,
            completedJobs: true,
            isVerified: true,
            isPremium: true
          }
        }
      }
    });
    
    console.log(`✅ Profissionais por categoria: ${byCategory.length}`);
    
    // Teste 3: Buscar por especialidade
    console.log('\n3. Buscando por especialidade "Reparações"...');
    const bySpecialty = await prisma.user.findMany({
      where: {
        userType: 'PROFESSIONAL',
        professionalProfile: {
          isNot: null,
          isActive: true,
          specialties: {
            contains: 'Reparações',
            mode: 'insensitive'
          }
        }
      },
      include: {
        professionalProfile: {
          select: {
            specialties: true,
            experience: true,
            district: true,
            council: true,
            parish: true,
            category: true,
            rating: true,
            completedJobs: true,
            isVerified: true,
            isPremium: true
          }
        }
      }
    });
    
    console.log(`✅ Profissionais por especialidade: ${bySpecialty.length}`);
    
    // Teste 4: Buscar por localização
    console.log('\n4. Buscando por localização "Lisboa"...');
    const byLocation = await prisma.user.findMany({
      where: {
        userType: 'PROFESSIONAL',
        professionalProfile: {
          isNot: null,
          isActive: true,
          OR: [
            { district: { contains: 'Lisboa', mode: 'insensitive' } },
            { council: { contains: 'Lisboa', mode: 'insensitive' } },
            { parish: { contains: 'Lisboa', mode: 'insensitive' } }
          ]
        }
      },
      include: {
        professionalProfile: {
          select: {
            specialties: true,
            experience: true,
            district: true,
            council: true,
            parish: true,
            category: true,
            rating: true,
            completedJobs: true,
            isVerified: true,
            isPremium: true
          }
        }
      }
    });
    
    console.log(`✅ Profissionais por localização: ${byLocation.length}`);
    
    if (byLocation.length > 0) {
      const prof = byLocation[0];
      console.log(`👤 Primeiro profissional: ${prof.name}`);
      console.log(`📍 Localização: ${prof.professionalProfile?.parish}, ${prof.professionalProfile?.council}, ${prof.professionalProfile?.district}`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSimpleSearch();