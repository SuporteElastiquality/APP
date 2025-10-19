const sgMail = require('@sendgrid/mail');

async function testSendGrid() {
  try {
    console.log('🔍 Testando SendGrid...');
    
    // Verificar se a API key está configurada
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.log('❌ SENDGRID_API_KEY não encontrada nas variáveis de ambiente');
      console.log('📝 Para configurar SendGrid:');
      console.log('1. Acesse https://app.sendgrid.com/');
      console.log('2. Crie uma conta gratuita');
      console.log('3. Gere uma API Key');
      console.log('4. Adicione SENDGRID_API_KEY nas variáveis de ambiente');
      return;
    }
    
    console.log('✅ SENDGRID_API_KEY encontrada:', apiKey.substring(0, 10) + '...');
    
    sgMail.setApiKey(apiKey);
    
    // Testar envio de email
    console.log('📧 Enviando email de teste via SendGrid...');
    const msg = {
      to: 'jonatasdt@hotmail.com',
      from: {
        email: 'noreply@elastiquality.pt',
        name: 'Elastiquality'
      },
      subject: 'Teste SendGrid - Elastiquality',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Teste SendGrid</h1>
          <p>Este é um email de teste enviado via SendGrid.</p>
          <p><strong>Código de teste:</strong> 123456</p>
        </div>
      `
    };
    
    const result = await sgMail.send(msg);
    console.log('✅ Email enviado com sucesso via SendGrid:', result);
    
  } catch (error) {
    console.error('❌ Erro ao enviar email via SendGrid:', error.message);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.body);
    }
  }
}

testSendGrid();
