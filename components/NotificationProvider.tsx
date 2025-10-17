'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Bell, X, MessageCircle } from 'lucide-react'

interface Notification {
  id: string
  type: 'message' | 'system' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const unreadCount = notifications.filter(n => !n.read).length

  // Carregar notificações do localStorage
  useEffect(() => {
    if (session?.user?.id) {
      const saved = localStorage.getItem(`notifications_${session.user.id}`)
      if (saved) {
        try {
          const parsed = JSON.parse(saved).map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }))
          setNotifications(parsed)
        } catch (error) {
          console.error('Erro ao carregar notificações:', error)
        }
      }
    }
  }, [session?.user?.id])

  // Salvar notificações no localStorage
  useEffect(() => {
    if (session?.user?.id && notifications.length > 0) {
      localStorage.setItem(`notifications_${session.user.id}`, JSON.stringify(notifications))
    }
  }, [notifications, session?.user?.id])

  // Polling para verificar novas mensagens
  useEffect(() => {
    if (!session?.user?.id) return

    const checkNewMessages = async () => {
      try {
        const response = await fetch('/api/chat/rooms')
        if (response.ok) {
          const rooms = await response.json()
          
          // Verificar se há mensagens não lidas
          for (const room of rooms) {
            if (room.messages && room.messages.length > 0) {
              const lastMessage = room.messages[0]
              const isFromOtherUser = lastMessage.sender.id !== session.user.id
              const isRecent = new Date(lastMessage.createdAt) > new Date(Date.now() - 30000) // Últimos 30 segundos
              
              if (isFromOtherUser && isRecent) {
                // Verificar se já existe notificação para esta mensagem
                const existingNotification = notifications.find(n => 
                  n.actionUrl?.includes(room.id) && 
                  n.timestamp.getTime() === new Date(lastMessage.createdAt).getTime()
                )
                
                if (!existingNotification) {
                  addNotification({
                    type: 'message',
                    title: 'Nova mensagem',
                    message: `${room.participants[0]?.name.split(' ')[0]}: ${lastMessage.content.substring(0, 50)}${lastMessage.content.length > 50 ? '...' : ''}`,
                    actionUrl: `/messages?room=${room.id}`
                  })
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Erro ao verificar mensagens:', error)
      }
    }

    // Verificar a cada 30 segundos
    const interval = setInterval(checkNewMessages, 30000)
    
    return () => clearInterval(interval)
  }, [session?.user?.id, notifications])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)) // Manter apenas 50 notificações
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-600" />
      case 'system':
        return <Bell className="w-5 h-5 text-yellow-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll
    }}>
      {children}
      
      {/* Notification Bell */}
      {session && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isOpen && (
            <div className="absolute top-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notificações</h3>
                <div className="flex space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Limpar
                  </button>
                </div>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhuma notificação</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        markAsRead(notification.id)
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {formatTime(notification.timestamp)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
