#!/bin/bash

echo "🚀 Configurando projeto Elastiquality..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 16+ primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Gerar cliente Prisma
echo "🗄️ Configurando banco de dados..."
npx prisma generate

# Verificar se existe arquivo .env
if [ ! -f .env.local ]; then
    echo "⚠️ Arquivo .env.local não encontrado"
    echo "📝 Criando arquivo .env.local com configurações de exemplo..."
    cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/elastiquality"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

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
EOF
    echo "✅ Arquivo .env.local criado. Configure suas credenciais antes de executar o projeto."
fi

# Executar linting
echo "🔍 Executando linting..."
npm run lint

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o banco de dados PostgreSQL"
echo "2. Atualize as credenciais no arquivo .env.local"
echo "3. Execute 'npm run dev' para iniciar o servidor de desenvolvimento"
echo "4. Acesse http://localhost:3000"
echo ""
echo "📱 Para o app móvel:"
echo "1. cd mobile-app"
echo "2. npm install"
echo "3. expo start"
echo ""
echo "🚀 Para deploy na Vercel:"
echo "1. Conecte o repositório à Vercel"
echo "2. Configure as variáveis de ambiente"
echo "3. Deploy automático!"
