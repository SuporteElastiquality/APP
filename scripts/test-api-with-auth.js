const fetch = require('node-fetch');

async function testAPIWithAuth() {
  try {
    console.log('🔍 Testando API com autenticação...');

    // Simular uma requisição para a API
    const response = await fetch('https://elastiquality.pt/api/service-requests?status=ALL', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'next-auth.session-token=test' // Simular cookie de sessão
      }
    });

    console.log('📊 Status da resposta:', response.status);
    console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.text();
    console.log('📄 Resposta:', data);

    if (response.status === 401) {
      console.log('✅ API retorna 401 (não autorizado) - comportamento esperado sem sessão válida');
    } else if (response.status === 200) {
      console.log('✅ API retorna 200 - dados carregados');
      try {
        const jsonData = JSON.parse(data);
        console.log('📊 Dados parseados:', jsonData);
      } catch (e) {
        console.log('❌ Erro ao fazer parse do JSON:', e.message);
      }
    } else {
      console.log('❌ Status inesperado:', response.status);
    }

  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
  }
}

testAPIWithAuth();
