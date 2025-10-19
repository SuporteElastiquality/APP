const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🔍 Testando API de solicitações...');

    // Simular uma requisição como se fosse do frontend
    const response = await fetch('https://elastiquality.pt/api/service-requests?status=ALL', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Nota: Esta requisição não terá autenticação, então deve retornar erro 401
      }
    });

    console.log('📊 Status da resposta:', response.status);
    console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.text();
    console.log('📄 Resposta:', data);

    if (response.status === 401) {
      console.log('✅ API está funcionando corretamente - retornou 401 (não autorizado)');
    } else {
      console.log('❌ Resposta inesperada da API');
    }

  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
  }
}

testAPI();
