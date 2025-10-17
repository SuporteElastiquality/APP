const { PrismaClient } = require('@prisma/client');

async function testElastiqualitySearch() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testando busca de profissionais...\n');
    
    // Verificar se Elastiquality existe
    const elastiquality = await prisma.user.findUnique({
      where: { email: 'elastiquality@elastiquality.pt' },
      include: {
        professionalProfile: true
      }
    });
    
    if (elastiquality) {
      console.log('✅ Elastiquality encontrada:');
      console.log('   Nome:', elastiquality.name);
      console.log('   Email:', elastiquality.email);
      console.log('   Tipo:', elastiquality.userType);
      console.log('   Perfil Profissional:', elastiquality.professionalProfile ? 'Sim' : 'Não');
      
      if (elastiquality.professionalProfile) {
        console.log('   Categoria:', elastiquality.professionalProfile.category);
        console.log('   Especialidades:', elastiquality.professionalProfile.specialties);
        console.log('   Distrito:', elastiquality.professionalProfile.district);
        console.log('   Conselho:', elastiquality.professionalProfile.council);
        console.log('   Freguesia:', elastiquality.professionalProfile.parish);
        console.log('   Verificado:', elastiquality.professionalProfile.isVerified);
        console.log('   Premium:', elastiquality.professionalProfile.isPremium);
        console.log('   Ativo:', elastiquality.professionalProfile.isActive);
        console.log('   Rating:', elastiquality.professionalProfile.rating);
      }
    } else {
      console.log('❌ Elastiquality não encontrada!');
    }
    
    console.log('\n🔍 Testando diferentes cenários de busca...\n');
    
    // Simular diferentes buscas
    const searchScenarios = [
      { service: 'pedreiro', location: 'Corroios', category: 'construcao-reforma' },
      { service: 'eletricista', location: 'Seixal', category: 'construcao-reforma' },
      { service: 'limpeza', location: 'Lisboa', category: 'limpeza' },
      { service: '', location: '', category: '' },
      { service: 'pintor', location: 'Setúbal', category: 'construcao-reforma' }
    ];
    
    for (const scenario of searchScenarios) {
      console.log(`📋 Cenário: Serviço="${scenario.service}", Localização="${scenario.location}", Categoria="${scenario.category}"`);
      
      // Buscar profissionais
      const professionals = await prisma.user.findMany({
        where: {
          userType: 'PROFESSIONAL',
          professionalProfile: {
            isNot: null
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
        },
        take: 100
      });
      
      // Separar Elastiquality
      const elastiqualityProf = professionals.find(prof => prof.email === 'elastiquality@elastiquality.pt');
      const otherProfessionals = professionals.filter(prof => prof.email !== 'elastiquality@elastiquality.pt');
      
      // Filtrar outros profissionais
      let filteredOtherProfessionals = otherProfessionals;
      
      if (scenario.category.trim()) {
        filteredOtherProfessionals = otherProfessionals.filter(prof => 
          prof.professionalProfile?.category?.toLowerCase().includes(scenario.category.toLowerCase())
        );
      }
      
      if (scenario.service.trim()) {
        filteredOtherProfessionals = filteredOtherProfessionals.filter(prof => 
          prof.professionalProfile?.specialties?.toLowerCase().includes(scenario.service.toLowerCase())
        );
      }
      
      if (scenario.location.trim()) {
        const locationLower = scenario.location.toLowerCase();
        filteredOtherProfessionals = filteredOtherProfessionals.filter(prof => {
          const profile = prof.professionalProfile;
          return profile?.district?.toLowerCase().includes(locationLower) ||
                 profile?.council?.toLowerCase().includes(locationLower) ||
                 profile?.parish?.toLowerCase().includes(locationLower);
        });
      }
      
      // Combinar resultados
      const finalResults = elastiqualityProf 
        ? [elastiqualityProf, ...filteredOtherProfessionals]
        : filteredOtherProfessionals;
      
      console.log(`   ✅ Total de profissionais encontrados: ${finalResults.length}`);
      console.log(`   🏆 Elastiquality aparece: ${elastiqualityProf ? 'SIM' : 'NÃO'}`);
      
      if (elastiqualityProf) {
        console.log(`   📍 Posição da Elastiquality: 1º lugar`);
      }
      
      console.log('   📋 Primeiros 3 profissionais:');
      finalResults.slice(0, 3).forEach((prof, index) => {
        const isElastiquality = prof.email === 'elastiquality@elastiquality.pt';
        console.log(`      ${index + 1}. ${prof.name} ${isElastiquality ? '(ELASTIQUALITY)' : ''}`);
      });
      
      console.log('');
    }
    
    console.log('✅ Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testElastiqualitySearch();
