# ⚡ Configuração Rápida - Webhook Stripe

## 🚀 Setup em 5 Minutos

### 1. Configurar Variáveis (.env)
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Criar Webhook no Stripe
1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique em **"Add endpoint"**
3. URL: `https://seu-dominio.com/api/webhooks/stripe`
4. Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copie o **Signing secret**

### 3. Para Desenvolvimento Local
```bash
# Instalar ngrok
npm install -g ngrok

# Expor aplicação
ngrok http 3000

# Usar URL do ngrok no webhook do Stripe
```

### 4. Testar
```bash
# Executar teste
node test-webhook-stripe.js
```

## ✅ Checklist
- [ ] Variáveis configuradas
- [ ] Webhook criado no Stripe
- [ ] URL configurada corretamente
- [ ] Eventos selecionados
- [ ] Teste executado com sucesso

## 🔗 Links Úteis
- [Dashboard Stripe](https://dashboard.stripe.com/webhooks)
- [ngrok](https://ngrok.com/)
- [Guia Completo](./CONFIGURACAO_WEBHOOK_STRIPE.md)
