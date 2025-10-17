'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MessageCircle, Send, User, Clock, Search, Plus } from 'lucide-react'
import Button from '@/components/Button'
import Input from '@/components/Input'

interface ChatRoom {
  id: string
  type: string
  lastMessage: string
  participants: Array<{
    id: string
    name: string
    image: string | null
    userType: string
  }>
  messages: Array<{
    id: string
    content: string
    createdAt: string
    sender: {
      id: string
      name: string
    }
  }>
}

interface Message {
  id: string
  content: string
  type: string
  createdAt: string
  sender: {
    id: string
    name: string
    image: string | null
  }
}

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [targetProfessional, setTargetProfessional] = useState<string | null>(null)
  const [targetName, setTargetName] = useState<string | null>(null)

  // Redirecionar se não autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  // Carregar parâmetros da URL
  useEffect(() => {
    const professional = searchParams.get('professional')
    const name = searchParams.get('name')
    
    if (professional && name) {
      setTargetProfessional(professional)
      setTargetName(name)
    }
  }, [searchParams])

  // Carregar salas de chat e criar conversa se necessário
  useEffect(() => {
    if (session?.user?.id) {
      loadChatRooms()
    }
  }, [session, targetProfessional, targetName])

  // Carregar mensagens quando uma sala é selecionada
  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id)
    }
  }, [selectedRoom])

  const loadChatRooms = async () => {
    try {
      const response = await fetch('/api/chat/rooms')
      if (response.ok) {
        const data = await response.json()
        setRooms(data)
        
        // Se há um profissional alvo, procurar ou criar conversa
        if (targetProfessional && targetName) {
          const existingRoom = data.find((room: ChatRoom) => 
            room.participants.some(p => p.id === targetProfessional)
          )
          
          if (existingRoom) {
            setSelectedRoom(existingRoom)
          } else {
            // Criar nova conversa
            await createNewConversation()
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar salas de chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewConversation = async () => {
    if (!targetProfessional || !session?.user?.id) {
      console.log('Não é possível criar conversa:', { targetProfessional, userId: session?.user?.id })
      return
    }

    console.log('Criando nova conversa com:', targetProfessional)

    try {
      const response = await fetch('/api/chat/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId: targetProfessional,
          type: 'DIRECT'
        }),
      })

      if (response.ok) {
        const newRoom = await response.json()
        console.log('Conversa criada com sucesso:', newRoom)
        setSelectedRoom(newRoom)
        // Recarregar lista de salas
        await loadChatRooms()
      } else {
        const errorData = await response.json()
        console.error('Erro ao criar conversa:', errorData)
      }
    } catch (error) {
      console.error('Erro ao criar conversa:', error)
    }
  }

  const loadMessages = async (roomId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?roomId=${roomId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || sending) return

    setSending(true)
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          content: newMessage.trim(),
          type: 'TEXT'
        }),
      })

      if (response.ok) {
        const message = await response.json()
        setMessages(prev => [...prev, message])
        setNewMessage('')
        
        // Atualizar lista de salas
        loadChatRooms()
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const filteredRooms = rooms.filter(room => {
    if (!searchQuery) return true
    const participant = room.participants[0]
    return participant?.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex">
          {/* Sidebar - Lista de conversas */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-900">Mensagens</h1>
              <div className="mt-3">
                <Input
                  placeholder="Buscar conversas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredRooms.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhuma conversa encontrada</p>
                </div>
              ) : (
                filteredRooms.map((room) => {
                  const participant = room.participants[0]
                  const lastMessage = room.messages[0]
                  
                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedRoom?.id === room.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          {participant?.image ? (
                            <img
                              src={participant.image}
                              alt={participant.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-primary-600" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {participant?.name.split(' ')[0]}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : ''}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-500 truncate">
                            {lastMessage ? lastMessage.content : 'Nenhuma mensagem'}
                          </p>
                          
                          <div className="flex items-center mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              participant?.userType === 'PROFESSIONAL' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {participant?.userType === 'PROFESSIONAL' ? 'Profissional' : 'Cliente'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Área principal - Chat */}
          <div className="flex-1 flex flex-col">
            {selectedRoom ? (
              <>
                {/* Header do chat */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      {selectedRoom.participants[0]?.image ? (
                        <img
                          src={selectedRoom.participants[0].image}
                          alt={selectedRoom.participants[0].name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        {selectedRoom.participants[0]?.name.split(' ')[0]}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedRoom.participants[0]?.userType === 'PROFESSIONAL' ? 'Profissional' : 'Cliente'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Nenhuma mensagem ainda</p>
                      <p className="text-sm">Envie uma mensagem para começar a conversa</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender.id === session?.user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender.id === session?.user?.id
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender.id === session?.user?.id
                              ? 'text-primary-100'
                              : 'text-gray-500'
                          }`}>
                            {new Date(message.createdAt).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input de mensagem */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="px-4"
                    >
                      {sending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">
                    {targetProfessional && targetName ? 'Iniciando conversa...' : 'Selecione uma conversa'}
                  </h3>
                  <p className="mb-4">
                    {targetProfessional && targetName 
                      ? `Criando conversa com ${targetName}...`
                      : 'Escolha uma conversa da lista para começar a conversar'
                    }
                  </p>
                  {targetProfessional && targetName && (
                    <Button 
                      onClick={createNewConversation}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      Iniciar Conversa com {targetName}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
