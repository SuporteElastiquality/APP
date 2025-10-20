const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAPIDirect() {
  try {
    console.log('🔍 Testando API diretamente...');

    // 1. Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: 'jdterra@outlook.com' },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true
      }
    });

    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }

    console.log('👤 Usuário:', user);

    // 2. Simular a query exata que a API faz
    const whereClause = {
      clientId: user.id
    };

    console.log('🔍 Where clause:', whereClause);

    const requests = await prisma.serviceRequest.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            name: true,
            email: true
          }
        },
        service: {
          select: {
            name: true,
            category: {
              select: {
                name: true
              }
            }
          }
        },
        proposals: {
          select: {
            id: true,
            price: true,
            description: true,
            estimatedTime: true,
            status: true,
            professional: {
              select: {
                id: true,
                name: true,
                professionalProfile: {
                  select: {
                    rating: true,
                    totalReviews: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`\n📊 Solicitações encontradas: ${requests.length}`);

    if (requests.length > 0) {
      requests.forEach((request, index) => {
        console.log(`\n${index + 1}. Solicitação:`);
        console.log(`   ID: ${request.id}`);
        console.log(`   Título: ${request.title}`);
        console.log(`   Status: ${request.status}`);
        console.log(`   Cliente: ${request.client.name} (${request.client.email})`);
        console.log(`   Serviço: ${request.service.name} - ${request.service.category.name}`);
        console.log(`   Propostas: ${request.proposals?.length || 0}`);
        console.log(`   Criada em: ${request.createdAt}`);
      });
    } else {
      console.log('❌ Nenhuma solicitação encontrada');
    }

    // 3. Verificar se há problema com o clientId
    console.log('\n🔍 Verificando se clientId está correto...');
    const allRequests = await prisma.serviceRequest.findMany({
      where: {},
      select: {
        id: true,
        title: true,
        clientId: true,
        client: {
          select: {
            email: true
          }
        }
      }
    });

    console.log('📋 Todas as solicitações no banco:');
    allRequests.forEach((req, index) => {
      console.log(`   ${index + 1}. ID: ${req.id}, Cliente: ${req.client.email} (${req.clientId})`);
    });

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPIDirect();
