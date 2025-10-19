const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugClientRequests() {
  try {
    console.log('🔍 Investigando solicitações do cliente jdterra@outlook.com...');

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

    console.log('👤 Usuário encontrado:', user);

    // 2. Buscar todas as solicitações deste cliente
    const allRequests = await prisma.serviceRequest.findMany({
      where: {
        clientId: user.id
      },
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`\n📊 Total de solicitações encontradas: ${allRequests.length}`);

    if (allRequests.length > 0) {
      allRequests.forEach((request, index) => {
        console.log(`\n${index + 1}. Solicitação ID: ${request.id}`);
        console.log(`   Título: ${request.title}`);
        console.log(`   Status: ${request.status}`);
        console.log(`   Cliente: ${request.client.name} (${request.client.email})`);
        console.log(`   Serviço: ${request.service.name} - ${request.service.category.name}`);
        console.log(`   Criada em: ${request.createdAt}`);
        console.log(`   Distrito: ${request.district}, Conselho: ${request.council}`);
      });
    } else {
      console.log('❌ Nenhuma solicitação encontrada para este cliente');
    }

    // 3. Verificar se há solicitações com status diferentes
    const statusCounts = await prisma.serviceRequest.groupBy({
      by: ['status'],
      where: {
        clientId: user.id
      },
      _count: {
        status: true
      }
    });

    console.log('\n📈 Contagem por status:');
    statusCounts.forEach(status => {
      console.log(`   ${status.status}: ${status._count.status}`);
    });

    // 4. Testar a query que a API usa
    console.log('\n🔍 Testando query da API...');
    const apiQuery = await prisma.serviceRequest.findMany({
      where: {
        clientId: user.id,
        status: {
          in: ['PENDING', 'IN_PROGRESS']
        }
      },
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

    console.log(`📊 Solicitações retornadas pela query da API: ${apiQuery.length}`);
    if (apiQuery.length > 0) {
      apiQuery.forEach((request, index) => {
        console.log(`   ${index + 1}. ${request.title} (${request.status})`);
      });
    }

  } catch (error) {
    console.error('❌ Erro ao investigar solicitações:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugClientRequests();
