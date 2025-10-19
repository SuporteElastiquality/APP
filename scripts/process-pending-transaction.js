const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function processPendingTransaction() {
  try {
    console.log('🔄 Processando transação pendente mais recente...\n');

    // Buscar transação pendente mais recente com Checkout Session
    const transaction = await prisma.transaction.findFirst({
      where: {
        status: 'PENDING',
        stripePaymentIntentId: {
          startsWith: 'cs_'
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!transaction) {
      console.log('❌ Nenhuma transação pendente com Checkout Session encontrada');
      return;
    }

    console.log(`📋 Transação encontrada:`);
    console.log(`   ID: ${transaction.id}`);
    console.log(`   Usuário: ${transaction.user.name} (${transaction.user.email})`);
    console.log(`   Valor: €${transaction.amount}`);
    console.log(`   Moedas: ${transaction.coins}`);
    console.log(`   Checkout Session: ${transaction.stripePaymentIntentId}`);
    console.log(`   Data: ${transaction.createdAt}\n`);

    // Simular processamento da transação
    console.log('🔄 Atualizando status da transação...');
    await prisma.transaction.update({
      where: {
        id: transaction.id
      },
      data: {
        status: 'COMPLETED',
        stripeChargeId: 'manual_processing_' + Date.now()
      }
    });

    // Adicionar moedas ao usuário
    const coinsAmount = transaction.coins || 10; // Default para 10 moedas se não especificado
    
    console.log(`💰 Creditando ${coinsAmount} moedas para o usuário...`);
    await prisma.coin.create({
      data: {
        userId: transaction.userId,
        amount: coinsAmount,
        type: 'CREDIT',
        description: `Compra de ${coinsAmount} moedas - Processamento manual`,
        source: 'stripe_payment',
      },
    });

    console.log(`✅ Transação processada com sucesso!`);
    console.log(`   Status: COMPLETED`);
    console.log(`   Moedas creditadas: ${coinsAmount}`);

    // Verificar saldo atual
    const totalCoins = await prisma.coin.aggregate({
      where: {
        userId: transaction.userId
      },
      _sum: {
        amount: true
      }
    });

    console.log(`\n💎 Saldo total de moedas: ${totalCoins._sum.amount || 0}`);

  } catch (error) {
    console.error('❌ Erro ao processar transação:', error);
  } finally {
    await prisma.$disconnect();
  }
}

processPendingTransaction();
