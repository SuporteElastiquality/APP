const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function correctUserBalance() {
  try {
    console.log('🔧 Corrigindo saldo do usuário kmterra@gmail.com...\n');

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: 'kmterra@gmail.com' }
    });

    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }

    console.log(`👤 Usuário: ${user.name} (${user.email})`);

    // Deletar todas as moedas atuais
    const deletedCoins = await prisma.coin.deleteMany({
      where: { userId: user.id }
    });

    console.log(`🗑️ Removidas ${deletedCoins.count} moedas existentes`);

    // Adicionar exatamente 1 moeda
    await prisma.coin.create({
      data: {
        userId: user.id,
        amount: 1,
        type: 'CREDIT',
        description: 'Compra de 1 quality - Correção',
        source: 'stripe_payment',
      },
    });

    console.log('✅ Adicionada 1 quality');

    // Verificar saldo
    const totalCoins = await prisma.coin.aggregate({
      where: { userId: user.id },
      _sum: { amount: true }
    });

    console.log('\n💎 Saldo final:');
    console.log(`   Total: ${totalCoins._sum.amount || 0} quality`);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

correctUserBalance();
