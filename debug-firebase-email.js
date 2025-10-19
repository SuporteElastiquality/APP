// Debug do Firebase - verificar por que emails não chegam
console.log('🔍 Debugando Firebase - Por que emails não chegam...');

// Verificar se as variáveis estão corretas
const firebaseConfig = {
  apiKey: 'AIzaSyC1yei7zC8Pba1nWyxB5G1htG3JPR-Kp6g',
  authDomain: 'elastiquality.firebaseapp.com',
  projectId: 'project-293430826625',
  storageBucket: 'elastiquality.appspot.com',
  messagingSenderId: '293430826625',
  appId: '1:293430826625:web:a66d75e332822974dcdf80'
};

console.log('\n📋 Configurações do Firebase:');
Object.entries(firebaseConfig).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

console.log('\n🚨 Possíveis problemas:');

console.log('\n1. **Domínio não autorizado no Firebase:**');
console.log('   - Acesse: https://console.firebase.google.com');
console.log('   - Vá em Authentication > Settings');
console.log('   - Verifique se "elastiquality.pt" está em "Authorized domains"');
console.log('   - Se não estiver, adicione: elastiquality.pt');

console.log('\n2. **Email Authentication não ativado:**');
console.log('   - No Firebase Console, vá em Authentication');
console.log('   - Clique em "Sign-in method"');
console.log('   - Ative "Email/Password"');
console.log('   - Salve as configurações');

console.log('\n3. **Problema com o domínio de produção:**');
console.log('   - O Firebase pode estar configurado apenas para localhost');
console.log('   - Verifique se o domínio de produção está autorizado');

console.log('\n4. **Verificar logs do Vercel:**');
console.log('   - Acesse: https://vercel.com/dashboard');
console.log('   - Selecione o projeto');
console.log('   - Vá em Functions > View Function Logs');
console.log('   - Procure por erros relacionados ao Firebase');

console.log('\n5. **Testar com email diferente:**');
console.log('   - Tente com um email do Gmail');
console.log('   - Verifique se não está na pasta de spam');
console.log('   - Teste com outro provedor de email');

console.log('\n🔧 Para resolver:');
console.log('1. Verifique se o domínio está autorizado no Firebase');
console.log('2. Confirme se Email/Password está ativado');
console.log('3. Teste com outro email');
console.log('4. Verifique os logs do Vercel');

console.log('\n📞 Próximos passos:');
console.log('1. Vou verificar se há erros no código');
console.log('2. Vou criar um teste direto do Firebase');
console.log('3. Vou verificar se o domínio está autorizado');
