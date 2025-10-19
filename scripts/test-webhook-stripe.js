const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testWebhook() {
  try {
    console.log('🔍 Testando webhook do Stripe...\n');

    // Buscar transações pendentes
    const pendingTransactions = await prisma.transaction.findMany({
      where: {
        status: 'PENDING',
        stripePaymentIntentId: {
          not: null
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
      },
      take: 5
    });

    console.log('⏳ Transações pendentes encontradas:');
    if (pendingTransactions.length === 0) {
      console.log('   Nenhuma transação pendente encontrada');
    } else {
      pendingTransactions.forEach((tx, index) => {
        console.log(`   ${index + 1}. ID: ${tx.id}`);
        console.log(`      Usuário: ${tx.user.name} (${tx.user.email})`);
        console.log(`      Valor: €${tx.amount}`);
        console.log(`      Moedas: ${tx.coins}`);
        console.log(`      Stripe Payment Intent: ${tx.stripePaymentIntentId}`);
        console.log(`      Data: ${tx.createdAt}`);
        console.log('      ---');
      });
    }

    // Verificar se há transações com Checkout Session ID
    const checkoutTransactions = await prisma.transaction.findMany({
      where: {
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
      },
      take: 5
    });

    console.log('\n🛒 Transações com Checkout Session ID:');
    if (checkoutTransactions.length === 0) {
      console.log('   Nenhuma transação com Checkout Session encontrada');
    } else {
      checkoutTransactions.forEach((tx, index) => {
        console.log(`   ${index + 1}. ID: ${tx.id}`);
        console.log(`      Usuário: ${tx.user.name} (${tx.user.email})`);
        console.log(`      Status: ${tx.status}`);
        console.log(`      Valor: €${tx.amount}`);
        console.log(`      Moedas: ${tx.coins}`);
        console.log(`      Checkout Session: ${tx.stripePaymentIntentId}`);
        console.log(`      Data: ${tx.createdAt}`);
        console.log('      ---');
      });
    }

    // Verificar configuração do webhook
    console.log('\n⚙️ Configuração do Webhook:');
    console.log(`   STRIPE_WEBHOOK_SECRET: ${process.env.STRIPE_WEBHOOK_SECRET ? '✅ Configurado' : '❌ Não configurado'}`);
    console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || '❌ Não configurado'}`);
    console.log(`   Webhook URL: ${process.env.NEXTAUTH_URL}/api/webhooks/stripe`);

    console.log('\n📋 Eventos que o webhook deve processar:');
    console.log('   - checkout.session.completed (para Checkout Sessions)');
    console.log('   - payment_intent.succeeded (para Payment Intents)');
    console.log('   - payment_intent.payment_failed (para falhas)');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testWebhook();
