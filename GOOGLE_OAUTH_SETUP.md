# 🔐 Configuração do Google OAuth - Elastiquality

Este guia explica como configurar o login com Google para clientes e profissionais.

## 📋 **Pré-requisitos**

- Conta Google (pessoal ou G Suite)
- Acesso ao [Google Cloud Console](https://console.cloud.google.com/)

## 🚀 **Passo a Passo**

### 1. **Projeto Google Cloud (Já Criado)**

✅ **Projeto existente:** `appelastiquality-2`
- ID do projeto: `appelastiquality-2`
- Status: Ativo e configurado

**Para acessar diretamente:**
- [Google Cloud Console - Projeto appelastiquality-2](https://console.cloud.google.com/home/dashboard?project=appelastiquality-2)

### 2. **Habilitar Google+ API**

1. Acesse: [APIs e Serviços - Bibliotecas](https://console.cloud.google.com/apis/library?project=appelastiquality-2)
2. Pesquise por "Google+ API" ou "Google People API"
3. Clique em "Habilitar"

**Nota:** O Google+ API foi descontinuado. Use **"Google People API"** em vez disso.

### 3. **Configurar Tela de Consentimento OAuth**

1. **Acesse diretamente:** [Tela de Consentimento OAuth](https://console.cloud.google.com/apis/credentials/consent?project=appelastiquality-2)
2. **Escolha "Externo"** (para usuários fora da organização)
3. **Clique em "Criar"**

**Alternativa:** No menu lateral, vá em "APIs e Serviços" → "Tela de consentimento OAuth"

**Preencha os campos obrigatórios:**
- Nome do aplicativo: `Elastiquality`
- Email de suporte: `seu-email@exemplo.com`
- Domínio do desenvolvedor: `elastiquality.com` (ou seu domínio)

**Adicione escopos:**
- `userinfo.email`
- `userinfo.profile`

### 4. **Criar Credenciais OAuth 2.0**

1. **Acesse diretamente:** [Credenciais OAuth 2.0](https://console.cloud.google.com/apis/credentials?project=appelastiquality-2)
2. **Clique em "Criar credenciais"** → **"ID do cliente OAuth 2.0"**
3. **Tipo de aplicativo:** "Aplicativo da Web"

**Configurar URIs de redirecionamento autorizados:**
```
http://localhost:3000/api/auth/callback/google
https://seu-dominio.vercel.app/api/auth/callback/google
```

### 5. **Configurar Variáveis de Ambiente**

Crie/edite o arquivo `.env.local`:

```env
# Google OAuth
GOOGLE_CLIENT_ID="seu-client-id-aqui"
GOOGLE_CLIENT_SECRET="seu-client-secret-aqui"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
```

### 6. **Testar a Configuração**

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse `http://localhost:3000/auth/signin`
3. Clique em "Continuar com Google"
4. Teste o fluxo completo de registro

## 🔄 **Fluxo de Registro com Google**

### **Para Novos Usuários:**
1. Usuário clica em "Continuar com Google"
2. Autoriza o aplicativo no Google
3. É redirecionado para `/auth/google-signup`
4. Escolhe tipo de usuário (Cliente ou Profissional)
5. Preenche dados adicionais (telefone, localização, etc.)
6. Perfil é completado e usuário é redirecionado para dashboard

### **Para Usuários Existentes:**
1. Usuário clica em "Continuar com Google"
2. Se já tem perfil completo, vai direto para dashboard
3. Se perfil incompleto, vai para página de completar perfil

## 🛡️ **Segurança**

### **Validações Implementadas:**
- ✅ Verificação de email único
- ✅ Validação de telefone português
- ✅ Validação de localização (distrito, concelho, freguesia)
- ✅ Validação de especialidades para profissionais
- ✅ Redirecionamento seguro baseado no status do perfil

### **Dados Coletados:**
- **Básicos:** Nome, email, foto (do Google)
- **Adicionais:** Telefone, localização, tipo de usuário
- **Profissionais:** Especialidades, experiência, biografia

## 🚨 **Problemas Comuns**

### **Erro: "redirect_uri_mismatch"**
- Verifique se a URI de redirecionamento está correta no Google Console
- Certifique-se de que `NEXTAUTH_URL` está configurado corretamente

### **Erro: "invalid_client"**
- Verifique se `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos
- Certifique-se de que as credenciais são para o projeto correto

### **Erro: "access_denied"**
- Verifique se a tela de consentimento OAuth está configurada
- Certifique-se de que os escopos necessários estão habilitados

## 📱 **Para Produção**

### **Configurações de Produção:**
1. Adicione o domínio de produção nas URIs de redirecionamento
2. Configure `NEXTAUTH_URL` para o domínio de produção
3. Use credenciais de produção (não de desenvolvimento)

### **Exemplo para Vercel:**
```env
NEXTAUTH_URL="https://elastiquality.vercel.app"
GOOGLE_CLIENT_ID="seu-client-id-producao"
GOOGLE_CLIENT_SECRET="seu-client-secret-producao"
```

## 🔧 **Manutenção**

### **Renovação de Credenciais:**
- As credenciais OAuth 2.0 não expiram automaticamente
- Renove apenas se necessário por questões de segurança

### **Monitoramento:**
- Monitore logs de autenticação
- Verifique métricas de conversão de registro
- Acompanhe erros de autenticação

## 📞 **Suporte**

Se encontrar problemas:
1. Verifique os logs do console
2. Confirme as configurações do Google Console
3. Teste com diferentes navegadores
4. Verifique as variáveis de ambiente

---

**✅ Configuração concluída!** Agora clientes e profissionais podem se registrar usando suas contas Google de forma segura e intuitiva.
