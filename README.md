# Elastiquality 2.0 - Plataforma Completa

Uma plataforma completa que conecta clientes com profissionais de serviços em Portugal, com aplicativo web e mobile.

> **Test Update**: This is a small test commit to verify repository access and deployment pipeline.

## 🚀 Funcionalidades

### Para Clientes
- ✅ Busca por profissionais por categoria e localização
- ✅ Sistema de solicitações de serviço
- ✅ Chat em tempo real com profissionais
- ✅ Sistema de avaliações e reviews
- ✅ Pagamento direto ao profissional (sem taxa da plataforma)

### Para Profissionais
- ✅ Perfil profissional completo
- ✅ Sistema de propostas para solicitações
- ✅ Chat direto com clientes
- ✅ Sistema de moedas Elastiquality (para ver perfis de clientes)
- ✅ Dashboard de gestão

### Funcionalidades Técnicas
- ✅ Autenticação com NextAuth.js (Google + Credenciais)
- ✅ Banco de dados PostgreSQL com Prisma
- ✅ Pagamentos com Stripe (EUR)
- ✅ Chat em tempo real
- ✅ Design responsivo
- ✅ API REST completa
- ✅ Sistema de notificações

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: PostgreSQL
- **Autenticação**: NextAuth.js
- **Pagamentos**: Stripe
- **Chat**: Socket.io (preparado)
- **Deploy**: Vercel
- **Mobile**: React Native (Expo)

## 📱 Mobile App

O projeto inclui um aplicativo móvel completo desenvolvido em React Native com Expo, mantendo a mesma API e funcionalidades da versão web.

### Estrutura do Mobile App
```
mobile-app/
├── src/
│   └── screens/
│       └── HomeScreen.tsx
├── App.tsx
├── app.json
├── package.json
└── README.md
```

## 🚀 Deploy

### Vercel
1. Conecte o repositório GitHub à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Variáveis de Ambiente Necessárias
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🏗️ Instalação Local

1. Clone o repositório
```bash
git clone https://github.com/SuporteElastiquality/APP.git
cd APP
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
# Edite o arquivo .env.local com suas credenciais
```

4. Configure o banco de dados
```bash
npx prisma generate
npx prisma db push
```

5. Execute o projeto
```bash
npm run dev
```

## 📊 Estrutura do Projeto

### Web App
- **app/**: Páginas Next.js 14 (App Router)
- **components/**: Componentes React reutilizáveis
- **lib/**: Utilitários e configurações
- **prisma/**: Schema do banco de dados
- **public/**: Assets estáticos

### Mobile App
- **mobile-app/**: Aplicativo React Native
- **src/screens/**: Telas do aplicativo
- **App.tsx**: Componente principal

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto, entre em contato através do GitHub Issues.

## 📄 Licença

Este projeto é proprietário da Elastiquality. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para conectar profissionais e clientes em Portugal**
