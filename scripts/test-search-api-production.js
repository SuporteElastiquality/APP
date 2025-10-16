const fetch = require('node-fetch').default;

async function testSearchAPIProduction() {
  console.log('🔍 Testando API de busca de profissionais em produção...\n');
  
  const testCases = [
    {
      name: 'Busca por Automóvel em Lisboa',
      url: 'https://elastiquality.pt/api/search/professionals?service=Automóvel&location=Lisboa&page=1&limit=12'
    },
    {
      name: 'Busca por Eletricidade em Porto',
      url: 'https://elastiquality.pt/api/search/professionals?service=Eletricidade&location=Porto&page=1&limit=12'
    },
    {
      name: 'Busca sem parâmetros (deve falhar)',
      url: 'https://elastiquality.pt/api/search/professionals?page=1&limit=12'
    }
  ];

  for (const testCase of testCases) {
    console.log(`🧪 ${testCase.name}`);
    console.log(`   URL: ${testCase.url}`);
    
    try {
      const response = await fetch(testCase.url);
      const data = await response.json();
      
      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        console.log(`   ✅ Sucesso! Profissionais encontrados: ${data.professionals?.length || 0}`);
        if (data.professionals && data.professionals.length > 0) {
          console.log(`   📋 Primeiro profissional: ${data.professionals[0].name}`);
        }
      } else {
        console.log(`   ❌ Erro: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.log(`   ❌ Erro de conexão: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('🏁 Teste concluído!');
}

testSearchAPIProduction();
