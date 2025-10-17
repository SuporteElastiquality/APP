// Teste simples para verificar notificações
console.log('=== TESTE DO SISTEMA DE NOTIFICAÇÕES ===')

// Simular adição de notificação
const testNotification = {
  id: Date.now().toString(),
  type: 'message',
  title: 'Nova mensagem',
  message: 'Elastiquality: Teste de notificação',
  timestamp: new Date(),
  read: false,
  actionUrl: '/messages?room=test'
}

console.log('Notificação de teste criada:', testNotification)

// Verificar se localStorage funciona
if (typeof localStorage !== 'undefined') {
  localStorage.setItem('notifications_test', JSON.stringify([testNotification]))
  const saved = localStorage.getItem('notifications_test')
  console.log('Notificação salva no localStorage:', JSON.parse(saved))
} else {
  console.log('localStorage não disponível (Node.js)')
}

console.log('Teste concluído!')
