const fetch = require('node-fetch').default;

async function testGeographicSearch() {
  console.log('🌍 Testando busca geográfica de profissionais...\n');

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
      name: 'Busca geográfica - Lisboa (38.7223, -9.1393)',
      url: 'https://elastiquality.pt/api/search/professionals?service=Reparações&lat=38.7223&lng=-9.1393&page=1&limit=12'
    },
    {
      name: 'Busca geográfica - Porto (41.1579, -8.6291)',
      url: 'https://elastiquality.pt/api/search/professionals?service=Reparações&lat=41.1579&lng=-8.6291&page=1&limit=12'
    },
    {
      name: 'Busca sem filtros geográficos',
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
        console.log(`   🌍 Filtro geográfico: ${data.filters?.hasGeographicFilter ? 'Sim' : 'Não'}`);
        console.log(`   📏 Raio: ${data.filters?.radiusKm || 'N/A'}km`);
        
        if (data.professionals && data.professionals.length > 0) {
          const prof = data.professionals[0];
          console.log(`   👤 Primeiro profissional: ${prof.name}`);
          console.log(`   🏷️ Categoria: ${prof.category || 'N/A'}`);
          console.log(`   📍 Localização: ${prof.location.district}, ${prof.location.council}`);
          if (prof.coordinates?.latitude && prof.coordinates?.longitude) {
            console.log(`   🗺️ Coordenadas: ${prof.coordinates.latitude}, ${prof.coordinates.longitude}`);
          }
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
      console.log(`   ✅ Categorias encontradas: ${data.total}`);
      console.log(`   📋 Primeiras 3 categorias:`);
      data.categories.slice(0, 3).forEach(cat => {
        console.log(`      - ${cat.icon} ${cat.name}: ${cat.description}`);
      });
    } else {
      console.log(`   ❌ Erro: ${data.error}`);
    }
  } catch (error) {
    console.log(`   ❌ Erro de conexão: ${error.message}`);
  }
  
  console.log('\n🏁 Teste concluído!');
}

testGeographicSearch();
