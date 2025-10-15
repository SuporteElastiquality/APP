# 🔗 Corrigir URL do Webhook Stripe

## ⚠️ Problema Identificado
A URL do webhook está incorreta na configuração do Stripe.

## 🔧 Correção Necessária

### URL Atual (Incorreta):
```
https://appelastiquality.vercel.app/
```

### URL Correta:
```
https://appelastiquality.vercel.app/api/webhooks/stripe
```

## 📋 Passo a Passo

### 1. Acessar Dashboard do Stripe
1. Vá para: https://dashboard.stripe.com/webhooks
2. Faça login na sua conta Stripe

### 2. Editar Webhook
1. Encontre o webhook com ID: `we_1SlbtLL2gcFNnf7ztDBL1mow`
2. Clique no webhook para abrir os detalhes

### 3. Atualizar URL
1. Na seção **"Endpoint URL"**
2. Altere de: `https://appelastiquality.vercel.app/`
3. Para: `https://appelastiquality.vercel.app/api/webhooks/stripe`
4. Clique em **"Save"**

### 4. Verificar Eventos
Certifique-se de que estes eventos estão selecionados:
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`
- ✅ `payment_intent.canceled`

## ✅ Verificação
Após corrigir:
1. A URL deve apontar para `/api/webhooks/stripe`
2. Os eventos devem estar selecionados
3. O webhook deve estar ativo

## 🧪 Teste
Para testar se está funcionando:
1. Configure as variáveis de ambiente (chaves do Stripe)
2. Faça um pagamento de teste
3. Verifique os logs do webhook no Stripe Dashboard

## 📞 Suporte
- Dashboard Stripe: https://dashboard.stripe.com/webhooks
- Documentação: https://stripe.com/docs/webhooks
