const fetch = require('node-fetch').default;

async function testAdministrativeSearch() {
  console.log('🏛️ Testando busca com ordenação administrativa de profissionais...\n');

  const testCases = [
    {
      name: 'Busca por categoria "Reparações"',
      url: 'https://elastiquality.pt/api/search/professionals?category=reparacoes&page=1&limit=12'
    },
    {
      name: 'Busca por serviço "Eletricidade" em Lisboa',
      url: 'https://elastiquality.pt/api/search/professionals?service=Eletricidade&location=Lisboa&page=1&limit=12'
    },
    {
      name: 'Busca por serviço "Reparações" em Lisboa',
      url: 'https://elastiquality.pt/api/search/professionals?service=Reparações&location=Lisboa&page=1&limit=12'
    },
    {
      name: 'Busca por serviço "Reparações" em Porto',
      url: 'https://elastiquality.pt/api/search/professionals?service=Reparações&location=Porto&page=1&limit=12'
    },
    {
      name: 'Busca por serviço "Reparações" sem localização específica',
      url: 'https://elastiquality.pt/api/search/professionals?service=Reparações&page=1&limit=12'
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
        console.log(`   📊 Total: ${data.pagination?.total || 0}`);
        console.log(`   📄 Página: ${data.pagination?.page || 1}/${data.pagination?.totalPages || 1}`);
        console.log(`   🏛️ Ordenação administrativa: ${data.filters?.hasAdministrativeSorting ? 'Sim' : 'Não'}`);
        
        if (data.professionals && data.professionals.length > 0) {
          const prof = data.professionals[0];
          console.log(`   👤 Primeiro profissional: ${prof.name}`);
          console.log(`   🏷️ Categoria: ${prof.category || 'N/A'}`);
          console.log(`   📍 Localização: ${prof.location.parish}, ${prof.location.council}, ${prof.location.district}`);
        }
      } else {
        console.log(`   ❌ Erro: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.log(`   ❌ Erro de conexão: ${error.message}`);
    }
    
    console.log('');
  }

  // Testar API de categorias
  console.log('🏷️ Testando API de categorias...');
  try {
    const response = await fetch('https://elastiquality.pt/api/categories');
    const data = await response.json();
    
    if (response.ok) {
      console.log(`   ✅ Categorias encontradas: ${data.length}`);
      console.log(`   📋 Primeiras 3 categorias:`);
      data.slice(0, 3).forEach(cat => {
        console.log(`      - ${cat.name} (${cat.id})`);
      });
    } else {
      console.log(`   ❌ Erro: ${data.error}`);
    }
  } catch (error) {
    console.log(`   ❌ Erro de conexão: ${error.message}`);
  }
  
  console.log('\n🏁 Teste concluído!');
}

testAdministrativeSearch();
