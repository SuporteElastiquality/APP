# Guia de Teste das Notificações

## Como Testar o Sistema de Notificações

### 1. Teste de Notificações Visuais

**Passo 1:** Faça login com dois usuários diferentes em abas separadas:
- **Cliente:** `jdterra@outlook.com`
- **Profissional:** `elastiquality@elastiquality.pt`

**Passo 2:** Na aba do cliente, vá para a página de mensagens e envie uma mensagem

**Passo 3:** Na aba do profissional, verifique:
- ✅ **Sino de notificação** no canto superior direito
- ✅ **Badge vermelho** com número de notificações
- ✅ **Clique no sino** para ver a notificação
- ✅ **Notificação aparece** com preview da mensagem

### 2. Teste de Notificações por Email

**Passo 1:** Envie uma mensagem de um usuário para outro

**Passo 2:** Verifique o email do destinatário:
- ✅ **Email recebido** em até 1 minuto
- ✅ **Assunto:** "Nova mensagem de [Nome] - Elastiquality"
- ✅ **Preview da mensagem** no corpo do email
- ✅ **Link funcional** para a conversa

### 3. Debug e Logs

**Para verificar se está funcionando:**

1. **Abra o Console do navegador** (F12)
2. **Procure por logs:**
   - `"Verificando novas mensagens..."`
   - `"Salas encontradas: X"`
   - `"Adicionando notificação para: [Nome]"`
   - `"Enviando notificação de email:"`

### 4. Problemas Comuns e Soluções

**Problema:** Notificações não aparecem
- **Solução:** Verifique se o usuário está logado e se há mensagens recentes

**Problema:** Emails não são enviados
- **Solução:** Verifique se `RESEND_API_KEY` está configurada no Vercel

**Problema:** Polling não funciona
- **Solução:** Verifique se há erros no console do navegador

### 5. Configurações Importantes

**Variáveis de Ambiente Necessárias:**
- `RESEND_API_KEY` - Para envio de emails
- `NEXTAUTH_URL` - Para links nos emails
- `NEXTAUTH_SECRET` - Para autenticação

**Intervalos de Verificação:**
- **Polling:** A cada 30 segundos
- **Mensagens recentes:** Últimos 60 segundos
- **Tolerância de duplicatas:** 5 segundos

### 6. Teste Manual de Email

**Para testar emails diretamente:**

```bash
curl -X POST https://elastiquality.pt/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "system",
    "title": "Teste de Notificação",
    "message": "Esta é uma notificação de teste",
    "recipientEmail": "jdterra@outlook.com"
  }'
```

### 7. Verificação de Status

**URLs para verificar:**
- **Produção:** https://elastiquality-57jdwv7mb-suporte-elastiquality.vercel.app
- **Logs:** https://vercel.com/suporte-elastiquality/appelastiquality/Cjvwc57hSYu3WVDHq63VA2rMNV1F

**Status esperado:**
- ✅ Notificações visuais funcionando
- ✅ Emails sendo enviados
- ✅ Polling ativo
- ✅ Logs aparecendo no console
