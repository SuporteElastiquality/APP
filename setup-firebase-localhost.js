const fs = require('fs');
const path = require('path');

console.log('🔥 Configurando Firebase no localhost...');

// Configurações do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyC1yei7zC8Pba1nWyxB5G1htG3JPR-Kp6g',
  authDomain: 'elastiquality.firebaseapp.com',
  projectId: 'project-293430826625',
  storageBucket: 'elastiquality.appspot.com',
  messagingSenderId: '293430826625',
  appId: '1:293430826625:web:a66d75e332822974dcdf80'
};

// Conteúdo do .env.local
const envContent = `# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=${firebaseConfig.apiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${firebaseConfig.projectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${firebaseConfig.appId}

# Stripe (Configure suas próprias chaves)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your_publishable_key_here"
STRIPE_SECRET_KEY="sk_live_your_secret_key_here"
STRIPE_WEBHOOK_SECRET="your-webhook-secret"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Elastiquality"
`;

try {
  // Criar arquivo .env.local
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Arquivo .env.local criado com sucesso!');
  
  // Verificar se o arquivo foi criado
  if (fs.existsSync('.env.local')) {
    console.log('✅ Firebase configurado no localhost!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Execute: npm run dev');
    console.log('2. Acesse: http://localhost:3000');
    console.log('3. Teste o cadastro com jonatasdt@hotmail.com');
    console.log('4. Verifique se recebe o email de verificação via Firebase');
  } else {
    console.log('❌ Erro ao criar arquivo .env.local');
  }
} catch (error) {
  console.error('❌ Erro ao configurar Firebase:', error.message);
}
