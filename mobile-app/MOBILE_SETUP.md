# 📱 Elastiquality Mobile App - React Native

Este documento explica como configurar e executar o aplicativo móvel Elastiquality usando React Native com Expo.

## 🚀 Configuração Inicial

### 1. Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI: `npm install -g @expo/cli`
- Conta no Expo (opcional, mas recomendado)

### 2. Instalação

```bash
cd mobile-app
npm install
```

### 3. Configuração do Expo

```bash
# Login no Expo (opcional)
expo login

# Iniciar o projeto
expo start
```

## 📱 Executando o App

### Desenvolvimento
```bash
# Iniciar o servidor de desenvolvimento
expo start

# Executar no iOS (requer Xcode)
expo start --ios

# Executar no Android (requer Android Studio)
expo start --android

# Executar no navegador
expo start --web
```

### Build para Produção

#### Android
```bash
# Build APK
eas build --platform android

# Build AAB (para Google Play)
eas build --platform android --profile production
```

#### iOS
```bash
# Build para iOS
eas build --platform ios

# Build para App Store
eas build --platform ios --profile production
```

## 🏗️ Estrutura do Projeto

```
mobile-app/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── screens/            # Telas do app
│   ├── navigation/         # Configuração de navegação
│   ├── context/           # Context API (Auth, Chat)
│   ├── services/          # API calls
│   ├── utils/             # Funções utilitárias
│   └── types/             # Tipos TypeScript
├── assets/                # Imagens, ícones, etc.
├── App.tsx               # Componente principal
├── app.json             # Configuração do Expo
└── package.json         # Dependências
```

## 🔧 Configurações

### Variáveis de Ambiente

Crie um arquivo `.env` na pasta `mobile-app/`:

```env
EXPO_PUBLIC_API_URL=https://your-api-domain.vercel.app
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Configuração do Stripe

```typescript
// src/services/stripe.ts
import { initStripe } from '@stripe/stripe-react-native';

initStripe({
  publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
});
```

### Configuração de Notificações

```typescript
// src/services/notifications.ts
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
```

## 📱 Funcionalidades Implementadas

### ✅ Autenticação
- Login com email/senha
- Login com Google
- Registro de usuários
- Gerenciamento de sessão

### ✅ Navegação
- Stack Navigation
- Tab Navigation
- Deep linking

### ✅ Chat
- Chat em tempo real
- Notificações push
- Histórico de mensagens

### ✅ Pagamentos
- Integração com Stripe
- Pagamentos seguros
- Histórico de transações

### ✅ Localização
- GPS para encontrar profissionais próximos
- Seleção manual de localização

### ✅ Câmera e Galeria
- Tirar fotos dos serviços
- Selecionar imagens da galeria
- Upload de arquivos

## 🎨 Design System

### Cores
```typescript
const colors = {
  primary: '#0284c7',
  secondary: '#eab308',
  success: '#22c55e',
  danger: '#ef4444',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
};
```

### Tipografia
```typescript
const typography = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 12, fontWeight: 'normal' },
};
```

## 📦 Build e Deploy

### Google Play Store

1. Configure o EAS Build
```bash
eas build:configure
```

2. Build do AAB
```bash
eas build --platform android --profile production
```

3. Submit para a Play Store
```bash
eas submit --platform android
```

### Apple App Store

1. Build para iOS
```bash
eas build --platform ios --profile production
```

2. Submit para a App Store
```bash
eas submit --platform ios
```

## 🔐 Configurações de Segurança

### App Signing
- Android: Configure o keystore no EAS
- iOS: Configure os certificados no EAS

### Permissões
```json
{
  "android": {
    "permissions": [
      "android.permission.CAMERA",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION"
    ]
  },
  "ios": {
    "infoPlist": {
      "NSLocationWhenInUseUsageDescription": "Este app precisa da sua localização para encontrar profissionais próximos.",
      "NSCameraUsageDescription": "Este app precisa da câmera para tirar fotos dos serviços."
    }
  }
}
```

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e
```

## 📊 Analytics e Crash Reporting

### Firebase Analytics
```typescript
import analytics from '@react-native-firebase/analytics';

// Evento personalizado
analytics().logEvent('service_requested', {
  service_type: 'electrician',
  location: 'lisbon',
});
```

### Crashlytics
```typescript
import crashlytics from '@react-native-firebase/crashlytics';

// Log de erro
crashlytics().recordError(error);
```

## 🚀 Performance

### Otimizações
- Lazy loading de telas
- Memoização de componentes
- Otimização de imagens
- Cache de dados

### Monitoramento
- React Native Performance
- Flipper para debugging
- Metro bundler optimization

## 📱 Compatibilidade

### Versões Suportadas
- iOS: 12.0+
- Android: API 21+ (Android 5.0)
- React Native: 0.72+
- Expo SDK: 49+

### Dispositivos Testados
- iPhone 12/13/14
- Samsung Galaxy S21/S22
- Google Pixel 6/7
- OnePlus 9/10

## 🆘 Troubleshooting

### Problemas Comuns

1. **Metro bundler não inicia**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Erro de build Android**
   ```bash
   cd android && ./gradlew clean
   ```

3. **Problemas de permissão iOS**
   - Verifique os certificados no Apple Developer
   - Atualize o provisioning profile

### Logs e Debugging
```bash
# Logs do Expo
expo logs

# Logs do React Native
npx react-native log-android
npx react-native log-ios
```

## 📞 Suporte

Para problemas específicos do app móvel:
1. Verifique a documentação do Expo
2. Consulte o GitHub Issues
3. Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ para iOS e Android**
