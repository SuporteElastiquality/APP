# 🚀 Instruções de Deploy - Elastiquality

Este documento contém todas as instruções necessárias para fazer o deploy do projeto Elastiquality na Vercel e configurar o repositório GitHub.

## 📋 Checklist de Deploy

### ✅ 1. Configuração do Repositório GitHub

#### Criar Repositório
1. Acesse [GitHub](https://github.com)
2. Faça login com as credenciais fornecidas:
   - **Usuário**: `Elastiqualyt`
   - **Senha**: `DiasTerra15`
3. Crie um novo repositório: `Elastiqualityservico`
4. Clone o repositório localmente

#### Fazer Upload do Código
```bash
# Inicializar git
git init

# Adicionar arquivos
git add .

# Primeiro commit
git commit -m "Initial commit: Elastiquality platform"

# Adicionar remote
git remote add origin https://github.com/Elastiqualyt/Elastiqualityservico.git

# Push inicial
git push -u origin main
```

### ✅ 2. Configuração da Vercel

#### Conectar Repositório
1. Acesse [Vercel](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Importe o repositório `Elastiqualityservico`

#### Configurar Variáveis de Ambiente

Na Vercel, vá em **Settings > Environment Variables** e adicione:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# NextAuth.js
NEXTAUTH_URL=https://elastiquality.vercel.app
NEXTAUTH_SECRET=your-secret-key-here

# Stripe (Configure suas próprias chaves)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Google OAuth (Opcional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App
NEXT_PUBLIC_APP_URL=https://elastiquality.vercel.app
NEXT_PUBLIC_APP_NAME=Elastiquality
```

### ✅ 3. Configuração do Banco de Dados

#### Opção 1: PostgreSQL na Vercel
1. Na Vercel, vá em **Storage**
2. Crie um banco PostgreSQL
3. Copie a connection string
4. Adicione como `DATABASE_URL`

#### Opção 2: Supabase (Recomendado)
1. Acesse [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Vá em **Settings > Database**
4. Copie a connection string
5. Adicione como `DATABASE_URL`

#### Executar Migrações
```bash
# Após configurar o banco, execute:
npx prisma db push
```

### ✅ 4. Configuração do Stripe

#### Webhook Setup
1. Acesse [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá em **Developers > Webhooks**
3. Adicione endpoint: `https://elastiquality.vercel.app/api/webhooks/stripe`
4. Selecione eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copie o webhook secret
6. Adicione como `STRIPE_WEBHOOK_SECRET`

### ✅ 5. Deploy Automático

Após configurar tudo:
1. Faça push para o GitHub
2. A Vercel fará deploy automático
3. Acesse sua aplicação em `https://elastiquality.vercel.app`

## 📱 Deploy do App Móvel

### Google Play Store

#### 1. Configurar EAS Build
```bash
cd mobile-app
npm install -g eas-cli
eas login
eas build:configure
```

#### 2. Build para Android
```bash
eas build --platform android --profile production
```

#### 3. Submit para Play Store
```bash
eas submit --platform android
```

### Apple App Store

#### 1. Build para iOS
```bash
eas build --platform ios --profile production
```

#### 2. Submit para App Store
```bash
eas submit --platform ios
```

## 🔧 Configurações Adicionais

### Domínio Personalizado
1. Na Vercel, vá em **Settings > Domains**
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

### SSL/HTTPS
- Automático na Vercel
- Certificados gerenciados automaticamente

### CDN
- Automático na Vercel
- Global edge network

## 📊 Monitoramento

### Analytics
- Vercel Analytics (incluído)
- Google Analytics (opcional)
- Mixpanel (opcional)

### Error Tracking
- Sentry (recomendado)
- LogRocket (opcional)

### Performance
- Vercel Speed Insights
- Lighthouse CI

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Build Falha
```bash
# Verificar logs na Vercel
# Verificar variáveis de ambiente
# Verificar dependências
```

#### 2. Banco de Dados não Conecta
```bash
# Verificar DATABASE_URL
# Verificar se o banco está acessível
# Verificar firewall/proxy
```

#### 3. Stripe Webhook não Funciona
```bash
# Verificar URL do webhook
# Verificar eventos selecionados
# Verificar webhook secret
```

### Logs de Debug
```bash
# Logs da Vercel
vercel logs

# Logs locais
npm run dev
```

## 📞 Suporte

### Contatos
- **GitHub Issues**: Para bugs e features
- **Vercel Support**: Para problemas de deploy
- **Stripe Support**: Para problemas de pagamento

### Documentação
- [Next.js](https://nextjs.org/docs)
- [Vercel](https://vercel.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [Stripe](https://stripe.com/docs)

## 🎯 Próximos Passos

### Fase 1: MVP (Atual)
- ✅ Site funcional
- ✅ Sistema de autenticação
- ✅ Chat básico
- ✅ Pagamentos Stripe

### Fase 2: Melhorias
- [ ] App móvel completo
- [ ] Notificações push
- [ ] Sistema de avaliações
- [ ] Dashboard avançado

### Fase 3: Expansão
- [ ] Múltiplos países
- [ ] Sistema de afiliados
- [ ] API pública
- [ ] Integrações avançadas

---

**🚀 Pronto para lançar a Elastiquality!**

Siga estas instruções passo a passo e você terá uma plataforma completa de serviços funcionando em produção.
