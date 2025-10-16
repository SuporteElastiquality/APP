const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateProfessionalCoordinates() {
  console.log('🌍 Atualizando coordenadas e categoria do profissional...\n');

  try {
    // Buscar o profissional Jonatas
    const professional = await prisma.user.findUnique({
      where: { email: 'jdterra@outlook.com' },
      include: { professionalProfile: true }
    });

    if (!professional || !professional.professionalProfile) {
      console.log('❌ Profissional não encontrado');
      return;
    }

    console.log('✅ Profissional encontrado:', professional.name);

    // Coordenadas aproximadas de Corroios, Seixal (baseado no endereço)
    const latitude = 38.6400; // Aproximadamente Corroios
    const longitude = -9.1000; // Aproximadamente Corroios

    // Atualizar com coordenadas e categoria
    await prisma.professionalProfile.update({
      where: { userId: professional.id },
      data: {
        latitude,
        longitude,
        category: 'reparacoes', // Categoria de reparações
        address: 'Rua da Liberdade, 123, Corroios, Seixal',
        postalCode: '2855-214'
      }
    });

    console.log('✅ Coordenadas e categoria atualizadas:');
    console.log(`   - Latitude: ${latitude}`);
    console.log(`   - Longitude: ${longitude}`);
    console.log(`   - Categoria: Reparações`);
    console.log(`   - Endereço: Rua da Liberdade, 123, Corroios, Seixal`);

  } catch (error) {
    console.error('❌ Erro ao atualizar coordenadas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateProfessionalCoordinates();
