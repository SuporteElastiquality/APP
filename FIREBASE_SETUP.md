# 🔥 Configuração do Firebase Authentication

## Por que usar Firebase?

✅ **Mais confiável** que serviços de email externos  
✅ **Gerenciado pelo Google** - infraestrutura robusta  
✅ **Verificação automática** - sem códigos para digitar  
✅ **Funciona com todos os provedores** de email  
✅ **Gratuito** para uso básico  
✅ **Integração nativa** com Next.js  

## 🚀 Como Configurar

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Nome do projeto: `elastiquality`
4. Ative o Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Authentication

1. No painel do Firebase, vá em **Authentication**
2. Clique em **"Começar"**
3. Vá na aba **"Sign-in method"**
4. Ative **"Email/Password"**
5. Clique em **"Salvar"**

### 3. Obter Configurações

1. Vá em **Configurações do projeto** (ícone de engrenagem)
2. Role para baixo até **"Seus aplicativos"**
3. Clique em **"</>"** (Web)
4. Nome do app: `elastiquality-web`
5. Copie as configurações

### 4. Configurar Variáveis de Ambiente

Adicione no Vercel (Settings > Environment Variables):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=elastiquality.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=elastiquality
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=elastiquality.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 5. Configurar Domínio Autorizado

1. No Firebase Console, vá em **Authentication**
2. Vá na aba **"Settings"**
3. Em **"Authorized domains"**, adicione:
   - `elastiquality.pt`
   - `localhost` (para desenvolvimento)

## 🔧 Como Funciona

1. **Usuário se cadastra** no sistema local
2. **Firebase cria conta** automaticamente
3. **Email de verificação** é enviado via Firebase
4. **Usuário clica no link** no email
5. **Conta é verificada** automaticamente
6. **Login funciona** normalmente

## 📧 Vantagens sobre Resend/SendGrid

| Firebase | Resend/SendGrid |
|----------|-----------------|
| ✅ Gerenciado pelo Google | ❌ Serviço externo |
| ✅ 99.9% uptime | ❌ Pode falhar |
| ✅ Verificação automática | ❌ Precisa de códigos |
| ✅ Gratuito (10k emails/mês) | ❌ Pode ter custos |
| ✅ Integração nativa | ❌ Configuração complexa |
| ✅ Funciona com todos emails | ❌ Pode ser bloqueado |

## 🚨 Troubleshooting

### Email não chega?
1. Verifique a pasta de **spam**
2. Confirme o domínio autorizado no Firebase
3. Verifique se o email está correto

### Erro de configuração?
1. Verifique se todas as variáveis estão corretas
2. Confirme se o projeto Firebase está ativo
3. Verifique se Authentication está habilitado

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs do Firebase Console
2. Consulte a [documentação oficial](https://firebase.google.com/docs/auth)
3. Teste em ambiente de desenvolvimento primeiro

## 🎯 Status da Implementação

- ✅ Firebase configurado no projeto
- ✅ API de verificação criada
- ✅ Interface atualizada
- ✅ Componente de status criado
- ❌ Variáveis de ambiente precisam ser configuradas
- ❌ Deploy precisa ser feito após configuração
