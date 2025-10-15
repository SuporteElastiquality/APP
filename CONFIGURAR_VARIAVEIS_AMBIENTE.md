# 🔧 Configuração de Variáveis de Ambiente

## ⚠️ Problema Identificado
O webhook do Stripe está falhando porque as variáveis de ambiente não estão configuradas.

## 🚀 Solução Rápida

### 1. Criar arquivo .env
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="8e8850d595766b8b8cd7b7b7fb999dc0ff1e3ce7364137deb8d1a0e166ba1e82"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe Configuration (Configure suas próprias chaves)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key_here"
STRIPE_SECRET_KEY="sk_test_your_secret_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Configurar Chaves do Stripe

#### 2.1 Obter Chaves de Teste
1. Acesse: https://dashboard.stripe.com/test/apikeys
2. Copie:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

#### 2.2 Configurar Webhook
1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique em **"Add endpoint"**
3. URL: `https://seu-dominio.com/api/webhooks/stripe`
4. Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copie o **Signing secret** (whsec_...)

### 3. Atualizar .env
Substitua as chaves no arquivo `.env`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51ABC123..."
STRIPE_SECRET_KEY="sk_test_51ABC123..."
STRIPE_WEBHOOK_SECRET="whsec_ABC123..."
```

### 4. Reiniciar Servidor
```bash
# Parar servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

### 5. Testar Webhook
```bash
node test-webhook-stripe.js
```

## ✅ Verificação
Após configurar, o teste deve mostrar:
- ✅ STRIPE_SECRET_KEY: Configurado
- ✅ STRIPE_WEBHOOK_SECRET: Configurado
- ✅ Webhook funcionando

## 🔗 Links Úteis
- [Dashboard Stripe](https://dashboard.stripe.com/)
- [Chaves de API](https://dashboard.stripe.com/test/apikeys)
- [Webhooks](https://dashboard.stripe.com/webhooks)
