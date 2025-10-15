# 🔗 Guia Completo: Configuração do Webhook Stripe

## 📋 Visão Geral

Este guia te ajudará a configurar completamente o webhook do Stripe para o Elastiquality 2.0, permitindo que o sistema processe automaticamente pagamentos, falhas e outros eventos importantes.

## 🎯 O que o Webhook Faz

O webhook do Stripe permite que nossa aplicação:
- ✅ Receba notificações em tempo real sobre pagamentos
- ✅ Atualize automaticamente o status das transações
- ✅ Adicione moedas aos usuários após pagamento bem-sucedido
- ✅ Gerencie falhas de pagamento
- ✅ Mantenha sincronização entre Stripe e banco de dados

## 🛠️ Configuração Passo a Passo

### 1. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Obter Chaves do Stripe

#### 2.1 Acessar Dashboard do Stripe
1. Acesse: https://dashboard.stripe.com/
2. Faça login na sua conta Stripe

#### 2.2 Obter Chaves de API
1. No menu lateral, clique em **"Developers"** → **"API keys"**
2. Copie:
   - **Secret key** (começa com `sk_test_` para modo teste)
   - **Publishable key** (começa com `pk_test_` para modo teste)

### 3. Configurar Webhook no Stripe

#### 3.1 Criar Webhook
1. No dashboard do Stripe, vá para **"Developers"** → **"Webhooks"**
2. Clique em **"Add endpoint"**

#### 3.2 Configurar Endpoint
- **Endpoint URL**: `https://seu-dominio.com/api/webhooks/stripe`
  - Para desenvolvimento local: `https://seu-ngrok-url.ngrok.io/api/webhooks/stripe`
- **Description**: `Elastiquality Payment Webhook`

#### 3.3 Selecionar Eventos
Selecione os seguintes eventos:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`
- `payment_intent.requires_action`

#### 3.4 Obter Webhook Secret
1. Após criar o webhook, clique nele
2. Na seção **"Signing secret"**, clique em **"Reveal"**
3. Copie o secret (começa com `whsec_`)

### 4. Configuração para Desenvolvimento Local

#### 4.1 Instalar ngrok
```bash
# Via npm (global)
npm install -g ngrok

# Ou baixar de: https://ngrok.com/download
```

#### 4.2 Expor Aplicação Local
```bash
# Em um terminal separado
ngrok http 3000
```

#### 4.3 Configurar Webhook com ngrok
1. Use a URL do ngrok: `https://abc123.ngrok.io/api/webhooks/stripe`
2. Configure no dashboard do Stripe
3. Copie o webhook secret para `.env`

### 5. Testar Webhook

#### 5.1 Teste Manual
```bash
# Testar endpoint do webhook
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

#### 5.2 Teste com Stripe CLI (Opcional)
```bash
# Instalar Stripe CLI
# https://stripe.com/docs/stripe-cli

# Fazer login
stripe login

# Escutar webhooks localmente
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 6. Verificar Configuração

#### 6.1 Verificar Variáveis
```bash
# Verificar se as variáveis estão carregadas
node -e "console.log(process.env.STRIPE_SECRET_KEY ? '✅ STRIPE_SECRET_KEY' : '❌ STRIPE_SECRET_KEY')"
node -e "console.log(process.env.STRIPE_WEBHOOK_SECRET ? '✅ STRIPE_WEBHOOK_SECRET' : '❌ STRIPE_WEBHOOK_SECRET')"
```

#### 6.2 Testar Pagamento
1. Acesse: `http://localhost:3000/pricing`
2. Tente fazer um pagamento de teste
3. Verifique os logs do servidor para confirmar que o webhook foi processado

## 🔧 Configuração Avançada

### 1. Adicionar Mais Eventos (Opcional)

Se quiser monitorar mais eventos, adicione ao webhook:
- `customer.created`
- `customer.updated`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### 2. Configurar Retry Policy

O Stripe automaticamente tenta reenviar webhooks que falharam:
- **Tentativas**: 3 tentativas
- **Intervalo**: Exponencial (1min, 5min, 30min)
- **Timeout**: 30 segundos

### 3. Logs e Monitoramento

#### 3.1 Verificar Logs do Webhook
No dashboard do Stripe:
1. Vá para **"Developers"** → **"Webhooks"**
2. Clique no seu webhook
3. Veja a aba **"Logs"** para histórico de tentativas

#### 3.2 Logs da Aplicação
```javascript
// Adicionar logs detalhados no webhook
console.log('Webhook recebido:', event.type)
console.log('Dados do evento:', event.data.object)
```

## 🚨 Troubleshooting

### Problema: "Invalid signature"
**Solução:**
- Verifique se `STRIPE_WEBHOOK_SECRET` está correto
- Confirme que o webhook foi criado corretamente no Stripe

### Problema: "Webhook not receiving events"
**Solução:**
- Verifique se a URL do webhook está acessível
- Confirme que os eventos estão selecionados
- Teste com ngrok se estiver em desenvolvimento local

### Problema: "Database connection error"
**Solução:**
- Verifique se `DATABASE_URL` está configurado
- Confirme que o Prisma está funcionando
- Execute `npx prisma generate` se necessário

## 📊 Estrutura do Webhook Atual

O webhook atual (`/api/webhooks/stripe/route.ts`) processa:

### Eventos Suportados:
1. **`payment_intent.succeeded`**
   - Atualiza transação como `COMPLETED`
   - Adiciona moedas ao usuário (1 EUR = 10 moedas)
   - Registra no banco de dados

2. **`payment_intent.payment_failed`**
   - Atualiza transação como `FAILED`
   - Registra falha no banco

### Dados Processados:
- `stripePaymentIntentId`: ID do pagamento no Stripe
- `stripeChargeId`: ID da cobrança
- `amount`: Valor da transação
- `userId`: ID do usuário
- `coinsAmount`: Quantidade de moedas a adicionar

## 🔄 Fluxo Completo

1. **Usuário inicia pagamento** → `/pricing`
2. **Cria PaymentIntent** → `/api/create-payment-intent`
3. **Stripe processa pagamento** → Stripe Dashboard
4. **Webhook notifica sucesso** → `/api/webhooks/stripe`
5. **Sistema atualiza banco** → Prisma
6. **Usuário recebe moedas** → Tabela `Coin`

## ✅ Checklist de Configuração

- [ ] Variáveis de ambiente configuradas
- [ ] Webhook criado no Stripe Dashboard
- [ ] Eventos selecionados corretamente
- [ ] Webhook secret copiado
- [ ] URL do webhook configurada
- [ ] Teste de pagamento realizado
- [ ] Logs verificados
- [ ] Banco de dados atualizado corretamente

## 🎉 Próximos Passos

Após configurar o webhook:
1. Teste com pagamentos reais
2. Monitore os logs regularmente
3. Configure alertas para falhas
4. Considere adicionar mais eventos conforme necessário

---

**📞 Suporte:**
- Documentação Stripe: https://stripe.com/docs/webhooks
- Dashboard Stripe: https://dashboard.stripe.com/
- Logs de Webhook: https://dashboard.stripe.com/webhooks

**🔗 Links Úteis:**
- [Testar Webhooks](https://stripe.com/docs/webhooks/test)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [ngrok](https://ngrok.com/)
