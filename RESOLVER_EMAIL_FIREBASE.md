# 🚨 Resolver Problema de Email Firebase

## 🔍 **Diagnóstico:**
- ✅ Firebase configurado corretamente
- ✅ Variáveis configuradas no Vercel
- ✅ Código funcionando localmente
- ❌ **Emails não chegam em produção**

## 🎯 **Problema Principal:**
O domínio de produção não está autorizado no Firebase Console.

## 🔧 **Solução Passo a Passo:**

### 1. **Acessar Firebase Console**
1. Vá em [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto: `project-293430826625`

### 2. **Configurar Domínios Autorizados**
1. No menu lateral, clique em **"Authentication"**
2. Vá na aba **"Settings"** (Configurações)
3. Role para baixo até **"Authorized domains"** (Domínios autorizados)
4. Clique em **"Add domain"** (Adicionar domínio)
5. Adicione: `appelastiquality-lngcndqzm-suporte-elastiquality.vercel.app`
6. Adicione também: `elastiquality.pt` (se não estiver)
7. Clique em **"Done"** (Concluído)

### 3. **Verificar Email/Password**
1. Ainda em **Authentication**
2. Vá na aba **"Sign-in method"**
3. Verifique se **"Email/Password"** está ativado
4. Se não estiver, clique em **"Enable"** (Ativar)
5. Clique em **"Save"** (Salvar)

### 4. **Testar Novamente**
1. Acesse: `https://appelastiquality-lngcndqzm-suporte-elastiquality.vercel.app`
2. Crie uma conta com `jonatasdt@hotmail.com`
3. Verifique se recebe o email

## 🚨 **Se Ainda Não Funcionar:**

### **Opção 1: Verificar Logs do Vercel**
1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione o projeto `appelastiquality`
3. Vá em **Functions** → **View Function Logs**
4. Procure por erros relacionados ao Firebase

### **Opção 2: Testar com Email Diferente**
1. Tente com um email do Gmail
2. Verifique a pasta de spam
3. Teste com outro provedor de email

### **Opção 3: Verificar Configuração do Firebase**
1. No Firebase Console, vá em **Project Settings**
2. Verifique se o projeto está ativo
3. Confirme se todas as configurações estão corretas

## 📊 **Status Atual:**
- ✅ Firebase funcionando localmente
- ✅ Código implementado corretamente
- ✅ Variáveis configuradas no Vercel
- ❌ **Domínio de produção não autorizado**

## 🎯 **Próximo Passo:**
**Configure o domínio autorizado no Firebase Console** e teste novamente!

## 📞 **Se Precisar de Ajuda:**
1. Me envie uma captura de tela do Firebase Console
2. Verifique se o domínio está na lista de autorizados
3. Confirme se Email/Password está ativado
