'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Send, Paperclip, Smile, MoreVertical, Coins, Unlock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Button from './Button'

interface Message {
  id: string
  content: string
  senderId: string
  sender: {
    id: string
    name: string
    image?: string
  }
  createdAt: string
  type: 'TEXT' | 'IMAGE' | 'FILE'
  isRead: boolean
}

interface ChatProps {
  roomId: string
  messages: Message[]
  onSendMessage: (content: string, type?: 'TEXT' | 'IMAGE' | 'FILE') => void
  onMarkAsRead: (messageId: string) => void
  otherUserId: string
  userType: 'CLIENT' | 'PROFESSIONAL'
}

export default function RestrictedChat({ 
  roomId, 
  messages, 
  onSendMessage, 
  onMarkAsRead, 
  otherUserId,
  userType 
}: ChatProps) {
  const { data: session } = useSession()
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [contactUnlocked, setContactUnlocked] = useState(false)
  const [userCoins, setUserCoins] = useState(0)
  const [otherUser, setOtherUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Marcar mensagens como lidas quando o chat é aberto
    const unreadMessages = messages.filter(
      msg => msg.senderId !== session?.user?.id && !msg.isRead
    )
    unreadMessages.forEach(msg => onMarkAsRead(msg.id))
  }, [roomId, messages, session?.user?.id, onMarkAsRead])

  useEffect(() => {
    // Verificar se contato já foi desbloqueado
    checkContactStatus()
    // Carregar saldo de moedas se for profissional
    if (userType === 'PROFESSIONAL') {
      loadUserCoins()
    }
    // Carregar dados do outro usuário
    loadOtherUser()
  }, [otherUserId, userType])

  const checkContactStatus = async () => {
    if (userType !== 'PROFESSIONAL') return

    try {
      const response = await fetch('/api/coins/unlock-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: otherUserId })
      })

      if (response.ok) {
        const data = await response.json()
        setContactUnlocked(data.alreadyUnlocked || false)
      }
    } catch (error) {
      console.error('Erro ao verificar status do contato:', error)
    }
  }

  const loadUserCoins = async () => {
    try {
      const response = await fetch('/api/coins/balance')
      if (response.ok) {
        const data = await response.json()
        setUserCoins(data.balance)
      }
    } catch (error) {
      console.error('Erro ao carregar moedas:', error)
    }
  }

  const loadOtherUser = async () => {
    try {
      const response = await fetch(`/api/users/${otherUserId}`)
      if (response.ok) {
        const data = await response.json()
        setOtherUser(data)
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error)
    }
  }

  const handleUnlockContact = async () => {
    if (userType !== 'PROFESSIONAL' || userCoins < 1) return

    try {
      const response = await fetch('/api/coins/unlock-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: otherUserId })
      })

      if (response.ok) {
        const data = await response.json()
        setContactUnlocked(true)
        setUserCoins(data.remainingCoins)
        alert('Contato desbloqueado com sucesso!')
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao desbloquear contato')
      }
    } catch (error) {
      console.error('Erro ao desbloquear contato:', error)
      alert('Erro ao desbloquear contato')
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim())
      setNewMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  const formatMessageTime = (date: string) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true, 
      locale: ptBR 
    })
  }

  // Função para obter nome restrito
  const getRestrictedName = (name: string, isOwn: boolean) => {
    if (isOwn) return name // Sempre mostrar nome completo do próprio usuário
    
    if (userType === 'CLIENT') {
      // Clientes veem apenas primeiro nome dos profissionais
      return name.split(' ')[0]
    } else if (userType === 'PROFESSIONAL') {
      if (contactUnlocked) {
        // Profissionais veem nome completo apenas se desbloqueado
        return name
      } else {
        // Profissionais veem apenas primeiro nome se não desbloqueado
        return name.split(' ')[0]
      }
    }
    
    return name
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Faça login para acessar o chat</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            {otherUser?.image ? (
              <img
                src={otherUser.image}
                alt={getRestrictedName(otherUser.name || 'Usuário', false)}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-primary-600 font-medium">
                {getRestrictedName(otherUser?.name || 'U', false).charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {getRestrictedName(otherUser?.name || 'Usuário', false)}
            </h3>
            <p className="text-sm text-gray-500">
              {userType === 'CLIENT' ? 'Profissional' : 'Cliente'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {userType === 'PROFESSIONAL' && (
            <div className="flex items-center space-x-2 text-sm">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">{userCoins} moedas</span>
            </div>
          )}
          
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Unlock Contact Banner (for Professionals) */}
      {userType === 'PROFESSIONAL' && !contactUnlocked && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Unlock className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Desbloqueie o contato</h4>
                <p className="text-sm text-gray-600">
                  Use 1 moeda para ver dados completos do cliente
                </p>
              </div>
            </div>
            <Button
              onClick={handleUnlockContact}
              disabled={userCoins < 1}
              className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-4 py-2"
            >
              <Coins className="w-4 h-4 mr-1" />
              Desbloquear (1 moeda)
            </Button>
          </div>
        </div>
      )}

      {/* Contact Info (if unlocked) */}
      {userType === 'PROFESSIONAL' && contactUnlocked && otherUser && (
        <div className="bg-green-50 border-b border-green-200 p-4">
          <h4 className="font-medium text-green-900 mb-2">Contato Desbloqueado</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-700 font-medium">Nome:</span>
              <p className="text-green-800">{otherUser.name}</p>
            </div>
            <div>
              <span className="text-green-700 font-medium">Email:</span>
              <p className="text-green-800">{otherUser.email}</p>
            </div>
            <div>
              <span className="text-green-700 font-medium">Telefone:</span>
              <p className="text-green-800">{otherUser.phone || 'Não informado'}</p>
            </div>
            <div>
              <span className="text-green-700 font-medium">Localização:</span>
              <p className="text-green-800">
                {otherUser.clientProfile?.district || 'Não informado'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Inicie uma conversa
              </h3>
              <p className="text-gray-500">
                Envie uma mensagem para começar a conversa
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === session.user?.id
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {!isOwn && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      {message.sender.image ? (
                        <img
                          src={message.sender.image}
                          alt={getRestrictedName(message.sender.name, false)}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-600">
                          {getRestrictedName(message.sender.name, false).charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className={`space-y-1 ${isOwn ? 'items-end' : 'items-start'}`}>
                    {!isOwn && (
                      <p className="text-xs text-gray-500 px-2">
                        {getRestrictedName(message.sender.name, false)}
                      </p>
                    )}
                    
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    <div className={`flex items-center space-x-1 px-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-gray-400">
                        {formatMessageTime(message.createdAt)}
                      </span>
                      {isOwn && (
                        <div className={`w-2 h-2 rounded-full ${
                          message.isRead ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {getRestrictedName(otherUser?.name || 'U', false).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
              rows={1}
              maxLength={1000}
            />
            
            <div className="absolute right-3 bottom-3 flex space-x-1">
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        <p className="text-xs text-gray-400 mt-2">
          {newMessage.length}/1000 caracteres
        </p>
      </div>
    </div>
  )
}
