// Testar Firebase no localhost
console.log('🔥 Testando Firebase no localhost...');

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

// Verificar se as variáveis estão carregadas
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('\n📋 Verificando variáveis de ambiente:');
let allConfigured = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: NÃO CONFIGURADA`);
    allConfigured = false;
  }
});

if (allConfigured) {
  console.log('\n✅ Firebase configurado corretamente no localhost!');
  console.log('\n🚀 Para testar:');
  console.log('1. Execute: npm run dev');
  console.log('2. Acesse: http://localhost:3000/auth/signup');
  console.log('3. Crie uma conta com jonatasdt@hotmail.com');
  console.log('4. Verifique se recebe o email de verificação via Firebase');
  console.log('5. Clique no link para verificar a conta');
} else {
  console.log('\n❌ Firebase não configurado corretamente!');
  console.log('💡 Execute: node setup-firebase-localhost.js');
}

console.log('\n🔧 Configurações do Firebase:');
console.log(`API Key: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 20)}...`);
console.log(`Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`);
console.log(`Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
console.log(`Storage Bucket: ${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`);
console.log(`Sender ID: ${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}`);
console.log(`App ID: ${process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.substring(0, 20)}...`);
