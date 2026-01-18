'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Search, User, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { getConversations, sendMessage } from '@/actions/messages'
import { useSocket } from '@/hooks/useSocket'
import { Button } from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Conversation {
  id: string
  otherUser: {
    id: string
    name: string
    email: string
  }
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const socket = useSocket()
  const currentUserId = 'user-id' // Get from auth context

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('message', (message: any) => {
        if (
          (message.senderId === selectedConversation && message.receiverId === currentUserId) ||
          (message.receiverId === selectedConversation && message.senderId === currentUserId)
        ) {
          setMessages(prev => [...prev, message])
          scrollToBottom()
        }
      })
    }

    return () => {
      if (socket) {
        socket.off('message')
      }
    }
  }, [socket, selectedConversation, currentUserId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversations = async () => {
    try {
      setIsLoading(true)
      const data = await getConversations()
      setConversations(data)
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0].otherUser.id)
        loadMessages(data[0].otherUser.id)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/messages/${userId}`)
      const data = await response.json()
      setMessages(data.messages)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSelectConversation = (userId: string) => {
    setSelectedConversation(userId)
    loadMessages(userId)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const message = await sendMessage(selectedConversation, newMessage)
      setMessages(prev => [...prev, message])
      setNewMessage('')
      
      // Update conversation list
      setConversations(prev => prev.map(conv => {
        if (conv.otherUser.id === selectedConversation) {
          return {
            ...conv,
            lastMessage: newMessage,
            lastMessageTime: new Date(),
            unreadCount: 0
          }
        }
        return conv
      }))
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-6">
        {/* Conversations List */}
        <div className="md:col-span-1 card overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100%-5rem)]">
            {isLoading ? (
              <LoadingSpinner />
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No conversations yet
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.otherUser.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === conv.otherUser.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold truncate">
                          {conv.otherUser.name}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDistanceToNow(new Date(conv.lastMessageTime), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 card overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-bold">
                    {conversations.find(c => c.otherUser.id === selectedConversation)?.otherUser.name}
                  </h3>
                  <p className="text-sm text-gray-600">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                        msg.senderId === currentUserId
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <div className={`text-xs mt-1 ${
                        msg.senderId === currentUserId ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        <Clock className="inline h-3 w-3 mr-1" />
                        {new Date(msg.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 input-field"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="btn-primary"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-600 text-center">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}