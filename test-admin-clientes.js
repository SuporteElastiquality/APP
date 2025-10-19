// Teste da gestão de clientes no admin
console.log('🧪 Testando gestão de clientes no admin...');

const testAdminClientes = async () => {
  try {
    console.log('\n1. Testando API de clientes...');
    
    // Simular requisição para a API
    const response = await fetch('http://localhost:3000/api/admin/clientes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API de clientes funcionando!');
      console.log(`📊 Total de usuários: ${data.total}`);
      console.log(`👥 Clientes apenas: ${data.clientesOnly}`);
      
      if (data.clientes && data.clientes.length > 0) {
        console.log('\n📋 Primeiros 3 clientes:');
        data.clientes.slice(0, 3).forEach((cliente, index) => {
          console.log(`${index + 1}. ${cliente.name} (${cliente.email}) - ${cliente.userType}`);
        });
      }
    } else {
      console.log('❌ Erro na API:', response.status, response.statusText);
    }

  } catch (error) {
    console.log('❌ Erro ao testar:', error.message);
  }
};

// Verificar se o servidor está rodando
const checkServer = async () => {
  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ Servidor local rodando!');
      await testAdminClientes();
    } else {
      console.log('❌ Servidor não está respondendo');
    }
  } catch (error) {
    console.log('❌ Servidor não está rodando. Execute: npm run dev');
  }
};

checkServer();
