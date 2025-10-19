# 🔥 Configurar Firebase no Vercel

## 📋 Variáveis de Ambiente para Adicionar

Acesse [Vercel Dashboard](https://vercel.com/dashboard) > Seu Projeto > Settings > Environment Variables

### Adicione estas 6 variáveis:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1yei7zC8Pba1nWyxB5G1htG3JPR-Kp6g
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=elastiquality.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-293430826625
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=elastiquality.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=293430826625
NEXT_PUBLIC_FIREBASE_APP_ID=1:293430826625:web:a66d75e332822974dcdf80
```

## 🎯 Passo a Passo:

1. **Acesse o Vercel Dashboard**
2. **Selecione seu projeto** `appelastiquality`
3. **Vá em Settings** (Configurações)
4. **Clique em Environment Variables** (Variáveis de Ambiente)
5. **Adicione cada variável** uma por uma:
   - Nome: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Valor: `AIzaSyC1yei7zC8Pba1nWyxB5G1htG3JPR-Kp6g`
   - Environment: `Production`
   - Clique em **Save**

6. **Repita para todas as 6 variáveis**

## ✅ Após Configurar:

1. **Faça redeploy** do projeto
2. **Teste o cadastro** com `jonatasdt@hotmail.com`
3. **Verifique se recebe** o email de verificação via Firebase

## 🔧 Verificar se Funcionou:

1. Acesse `https://elastiquality.pt/auth/signup`
2. Crie uma conta com `jonatasdt@hotmail.com`
3. Verifique se recebe o email de verificação
4. Clique no link para verificar a conta

## 🚨 Se Não Funcionar:

1. Verifique se todas as variáveis estão corretas
2. Confirme se o redeploy foi feito
3. Verifique os logs do Vercel
4. Teste com outro email

## 📞 Suporte:

Se precisar de ajuda, me avise que posso:
- Verificar as configurações
- Fazer o deploy
- Testar o sistema
