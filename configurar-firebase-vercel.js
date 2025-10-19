// Script para configurar Firebase no Vercel
const { execSync } = require('child_process');

console.log('🔥 Configurando Firebase no Vercel...');

const firebaseVars = {
  'NEXT_PUBLIC_FIREBASE_API_KEY': 'AIzaSyC1yei7zC8Pba1nWyxB5G1htG3JPR-Kp6g',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': 'elastiquality.firebaseapp.com',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID': 'project-293430826625',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': 'elastiquality.appspot.com',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': '293430826625',
  'NEXT_PUBLIC_FIREBASE_APP_ID': '1:293430826625:web:a66d75e332822974dcdf80'
};

console.log('\n📋 Variáveis do Firebase:');
Object.entries(firebaseVars).forEach(([key, value]) => {
  console.log(`${key}: ${value.substring(0, 20)}...`);
});

console.log('\n🚀 Para configurar no Vercel:');
console.log('1. Acesse: https://vercel.com/dashboard');
console.log('2. Selecione seu projeto: appelastiquality');
console.log('3. Vá em Settings > Environment Variables');
console.log('4. Adicione cada variável:');

Object.entries(firebaseVars).forEach(([key, value]) => {
  console.log(`   - Nome: ${key}`);
  console.log(`   - Valor: ${value}`);
  console.log(`   - Environment: Production`);
  console.log('');
});

console.log('5. Após adicionar todas as variáveis, faça redeploy');
console.log('6. Teste o cadastro com jonatasdt@hotmail.com');

console.log('\n✅ Firebase configurado no código!');
console.log('🎯 Próximo passo: Configurar variáveis no Vercel Dashboard');
