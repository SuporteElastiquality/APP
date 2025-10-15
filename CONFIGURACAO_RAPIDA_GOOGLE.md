# 🚀 Configuração Rápida - Google OAuth para Elastiquality

**Projeto:** `appelastiquality-2`

## 📋 **Links Diretos (Clique para acessar)**

### 1. **Habilitar API**
🔗 [Google People API](https://console.cloud.google.com/apis/library/people.googleapis.com?project=appelastiquality-2)
- Clique em "Habilitar"

### 2. **Configurar Tela de Consentimento**
🔗 [Tela de Consentimento OAuth](https://console.cloud.google.com/apis/credentials/consent?project=appelastiquality-2)
- Escolha **"Externo"**
- Clique em **"Criar"**

**Preencha:**
- Nome do aplicativo: `Elastiquality`
- Email de suporte: `seu-email@exemplo.com`
- Domínio do desenvolvedor: `elastiquality.com`

### 3. **Criar Credenciais**
🔗 [Credenciais OAuth 2.0](https://console.cloud.google.com/apis/credentials?project=appelastiquality-2)
- Clique em **"Criar credenciais"** → **"ID do cliente OAuth 2.0"**
- Tipo: **"Aplicativo da Web"**

**URIs de redirecionamento:**
```
http://localhost:3000/api/auth/callback/google
https://elastiquality.vercel.app/api/auth/callback/google
```

### 4. **Configurar Variáveis de Ambiente** ✅

**Arquivo `.env.local` configurado:**
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="8e8850d595766b8b8cd7b7b7fb999dc0ff1e3ce7364137deb8d1a0e166ba1e82"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Status:** ✅ Configurado e pronto para uso!

### 5. **Testar**
```bash
npm run dev
# Acesse: http://localhost:3000/auth/signin
# Clique em "Continuar com Google"
```

## ✅ **Checklist de Configuração**

- [ ] Google People API habilitada
- [ ] Tela de consentimento OAuth configurada (Externo)
- [ ] Credenciais OAuth 2.0 criadas
- [ ] URIs de redirecionamento adicionadas
- [ ] Variáveis de ambiente configuradas
- [ ] Teste de login funcionando

## 🆘 **Problemas Comuns**

**Erro: "redirect_uri_mismatch"**
- Verifique se as URIs estão exatamente como configuradas

**Erro: "invalid_client"**
- Verifique se GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão corretos

**Erro: "access_denied"**
- Verifique se a tela de consentimento está configurada

---

**🎯 Objetivo:** Permitir que clientes e profissionais se registrem usando Google OAuth
