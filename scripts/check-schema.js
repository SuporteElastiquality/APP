const { PrismaClient } = require('@prisma/client');

async function checkSchema() {
  console.log('🔍 Verificando schema do banco de dados...');
  
  const prisma = new PrismaClient();
  
  try {
    // Verificar se conseguimos buscar usuários
    console.log('\n1. Buscando usuários...');
    const users = await prisma.user.findMany({
      take: 1
    });
    console.log(`✅ Usuários encontrados: ${users.length}`);
    
    // Verificar se conseguimos buscar perfis profissionais
    console.log('\n2. Buscando perfis profissionais...');
    const profiles = await prisma.professionalProfile.findMany({
      take: 1
    });
    console.log(`✅ Perfis profissionais encontrados: ${profiles.length}`);
    
    if (profiles.length > 0) {
      const profile = profiles[0];
      console.log('📋 Campos disponíveis no perfil:');
      console.log(`   - id: ${profile.id}`);
      console.log(`   - district: ${profile.district}`);
      console.log(`   - council: ${profile.council}`);
      console.log(`   - parish: ${profile.parish}`);
      console.log(`   - category: ${profile.category}`);
      console.log(`   - specialties: ${profile.specialties}`);
      console.log(`   - isVerified: ${profile.isVerified}`);
      console.log(`   - isPremium: ${profile.isPremium}`);
      console.log(`   - isActive: ${profile.isActive}`);
    }
    
    // Tentar buscar com filtro simples
    console.log('\n3. Buscando profissionais com filtro simples...');
    const professionals = await prisma.user.findMany({
      where: {
        userType: 'PROFESSIONAL',
        professionalProfile: {
          isNot: null
        }
      },
      include: {
        professionalProfile: true
      },
      take: 1
    });
    console.log(`✅ Profissionais encontrados: ${professionals.length}`);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();
