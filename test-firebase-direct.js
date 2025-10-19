// Teste direto do Firebase
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, sendEmailVerification } = require('firebase/auth');

console.log('🔥 Testando Firebase diretamente...');

const firebaseConfig = {
  apiKey: 'AIzaSyC1yei7zC8Pba1nWyxB5G1htG3JPR-Kp6g',
  authDomain: 'elastiquality.firebaseapp.com',
  projectId: 'project-293430826625',
  storageBucket: 'elastiquality.appspot.com',
  messagingSenderId: '293430826625',
  appId: '1:293430826625:web:a66d75e332822974dcdf80'
};

async function testFirebase() {
  try {
    console.log('1. Inicializando Firebase...');
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    console.log('✅ Firebase inicializado com sucesso');
    
    console.log('2. Testando criação de usuário...');
    const email = 'teste@example.com';
    const password = '123456';
    
    // Nota: Este teste pode falhar se o usuário já existir
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Usuário criado:', user.email);
      
      console.log('3. Enviando email de verificação...');
      await sendEmailVerification(user);
      
      console.log('✅ Email de verificação enviado!');
      console.log('📧 Verifique o email:', email);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('⚠️ Email já existe, tentando fazer login...');
        // Aqui você faria login em vez de criar
        console.log('✅ Firebase está funcionando, mas email já existe');
      } else {
        console.error('❌ Erro ao criar usuário:', error.message);
        console.error('Código do erro:', error.code);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral do Firebase:', error.message);
    console.error('Código do erro:', error.code);
    
    if (error.code === 'auth/invalid-api-key') {
      console.log('🚨 API Key inválida!');
    } else if (error.code === 'auth/network-request-failed') {
      console.log('🚨 Problema de rede!');
    } else if (error.code === 'auth/too-many-requests') {
      console.log('🚨 Muitas tentativas!');
    }
  }
}

testFirebase();
