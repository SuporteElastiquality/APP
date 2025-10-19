const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTransaction() {
  try {
    console.log('🔍 Verificando transações para kmterra@gmail.com...\n');

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: {
        email: 'kmterra@gmail.com'
      },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true
      }
    });

    if (!user) {
      console.log('❌ Usuário kmterra@gmail.com não encontrado');
      return;
    }

    console.log(`👤 Usuário: ${user.name} (${user.email})`);
    console.log(`📋 Tipo: ${user.userType}\n`);

    // Buscar transações recentes
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    console.log('💳 Transações encontradas:');
    if (transactions.length === 0) {
      console.log('   Nenhuma transação encontrada');
    } else {
      transactions.forEach((tx, index) => {
        console.log(`   ${index + 1}. ID: ${tx.id}`);
        console.log(`      Status: ${tx.status}`);
        console.log(`      Valor: €${tx.amount}`);
        console.log(`      Moedas: ${tx.coins}`);
        console.log(`      Stripe Payment Intent: ${tx.stripePaymentIntentId}`);
        console.log(`      Stripe Charge: ${tx.stripeChargeId}`);
        console.log(`      Data: ${tx.createdAt}`);
        console.log('      ---');
      });
    }

    // Buscar moedas do usuário
    const coins = await prisma.coin.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    console.log('\n💰 Moedas creditadas:');
    if (coins.length === 0) {
      console.log('   Nenhuma moeda encontrada');
    } else {
      coins.forEach((coin, index) => {
        console.log(`   ${index + 1}. ID: ${coin.id}`);
        console.log(`      Tipo: ${coin.type}`);
        console.log(`      Quantidade: ${coin.amount}`);
        console.log(`      Descrição: ${coin.description}`);
        console.log(`      Fonte: ${coin.source}`);
        console.log(`      Data: ${coin.createdAt}`);
        console.log('      ---');
      });
    }

    // Calcular saldo total
    const totalCoins = await prisma.coin.aggregate({
      where: {
        userId: user.id
      },
      _sum: {
        amount: true
      }
    });

    console.log(`\n💎 Saldo total de moedas: ${totalCoins._sum.amount || 0}`);

    // Verificar webhooks recentes
    console.log('\n🔔 Verificando logs de webhook...');
    console.log('   (Verifique os logs do Vercel para webhooks do Stripe)');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTransaction();
