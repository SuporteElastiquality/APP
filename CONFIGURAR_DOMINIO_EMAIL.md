# 📧 Configuração de Domínio de Email - Elastiquality

## 🎯 **OBJETIVO:**
Configurar o domínio `elastiquality.pt` no Resend para permitir envio de emails para qualquer endereço.

---

## 🔧 **PASSO A PASSO:**

### **1. Acessar o Resend Dashboard**
1. **Vá para:** https://resend.com/domains
2. **Faça login** na sua conta Resend
3. **Clique** em "Add Domain"

### **2. Adicionar Domínio**
1. **Digite:** `elastiquality.pt`
2. **Clique** em "Add Domain"
3. **Aguarde** a verificação

### **3. Configurar Registros DNS**
O Resend vai fornecer os seguintes registros DNS para adicionar no seu provedor de domínio:

#### **📋 Registros Necessários:**

**TXT Record (Verificação):**
```
Tipo: TXT
Nome: @
Valor: [fornecido pelo Resend]
TTL: 3600
```

**MX Record (Recebimento):**
```
Tipo: MX
Nome: @
Valor: [fornecido pelo Resend]
Prioridade: 10
TTL: 3600
```

**CNAME Record (Tracking):**
```
Tipo: CNAME
Nome: resend._domainkey
Valor: [fornecido pelo Resend]
TTL: 3600
```

### **4. Verificar Configuração**
1. **Aguarde** 24-48 horas para propagação DNS
2. **Verifique** no dashboard do Resend se o domínio está ativo
3. **Teste** o envio de emails

---

## 🧪 **TESTE APÓS CONFIGURAÇÃO:**

### **Script de Teste:**
```bash
node scripts/test-email-domain.js
```

### **Teste Manual:**
1. **Acesse:** https://appelastiquality.vercel.app/auth/forgot-password
2. **Digite:** `jdterra@outlook.com`
3. **Clique:** "Enviar link de recuperação"
4. **Verifique:** Caixa de entrada

---

## 📧 **CONFIGURAÇÃO ATUAL:**

### **✅ Antes (Limitado):**
- **Domínio:** `onboarding@resend.dev`
- **Limitação:** Apenas `suporte@elastiquality.pt`
- **Status:** Funcionando com restrições

### **🎯 Depois (Completo):**
- **Domínio:** `noreply@elastiquality.pt`
- **Limitação:** Nenhuma
- **Status:** Qualquer email pode receber

---

## 🔍 **VERIFICAÇÃO DE STATUS:**

### **No Resend Dashboard:**
1. **Vá para:** https://resend.com/domains
2. **Verifique** se `elastiquality.pt` está:
   - ✅ **Verificado** (green checkmark)
   - ✅ **Ativo** (status: Active)
   - ✅ **Configurado** (DNS records OK)

### **Teste de Envio:**
```javascript
// Teste rápido
const { Resend } = require('resend')
const resend = new Resend('sua_chave_api')

const result = await resend.emails.send({
  from: 'Elastiquality <noreply@elastiquality.pt>',
  to: ['qualquer@email.com'],
  subject: 'Teste de Domínio',
  html: '<h1>Teste</h1>'
})
```

---

## ⚠️ **IMPORTANTE:**

### **Tempo de Propagação:**
- **DNS:** 24-48 horas
- **Verificação:** Imediata após DNS
- **Teste:** Após verificação completa

### **Backup:**
- **Mantenha** `onboarding@resend.dev` como fallback
- **Teste** ambos os domínios
- **Monitore** logs de envio

---

## 🎉 **RESULTADO FINAL:**

Após a configuração, você terá:
- ✅ **Emails de qualquer domínio** podem receber
- ✅ **Domínio personalizado** `elastiquality.pt`
- ✅ **Profissionalismo** na comunicação
- ✅ **Sem limitações** de destinatários

---

## 📞 **SUPORTE:**

Se precisar de ajuda:
1. **Resend Support:** https://resend.com/support
2. **Documentação:** https://resend.com/docs
3. **Status Page:** https://status.resend.com
