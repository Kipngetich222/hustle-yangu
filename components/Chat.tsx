// components/Chat.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Image as ImageIcon, Paperclip, Smile, X } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    name: string;
  };
}

interface ChatProps {
  conversationId?: string;
  receiverId?: string;
  receiverName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Chat({ 
  conversationId, 
  receiverId, 
  receiverName, 
  isOpen, 
  onClose 
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (receiverId) {
      loadMessages();
      joinChat();
    }
  }, [receiverId]);

  useEffect(() => {
    if (socket && receiverId) {
      socket.on('message', handleNewMessage);
      socket.on('typing', handleTyping);
      socket.on('stop-typing', handleStopTyping);

      return () => {
        socket.off('message', handleNewMessage);
        socket.off('typing', handleTyping);
        socket.off('stop-typing', handleStopTyping);
      };
    }
  }, [socket, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!receiverId) return;
    
    try {
      const response = await fetch(`/api/messages/${receiverId}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const joinChat = () => {
    if (socket && receiverId) {
      socket.emit('join-conversation', {
        userId: user?.id,
        receiverId,
      });
    }
  };

  const handleNewMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
    
    // Mark as read
    if (message.senderId !== user?.id) {
      markAsRead(message.id);
    }
  };

  const handleTyping = (data: { userId: string; isTyping: boolean }) => {
    if (data.userId !== user?.id) {
      setIsTyping(data.isTyping);
      setTypingUser(data.userId);
    }
  };

  const handleStopTyping = (userId: string) => {
    if (userId !== user?.id) {
      setIsTyping(false);
      setTypingUser(null);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !receiverId || !socket) return;

    const messageData = {
      senderId: user?.id,
      receiverId,
      content: newMessage.trim(),
    };

    try {
      socket.emit('message', messageData);
      setNewMessage('');
      stopTyping();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendTypingIndicator = () => {
    if (socket && receiverId) {
      socket.emit('typing', {
        receiverId,
        isTyping: true,
      });
    }
  };

  const stopTyping = () => {
    if (socket && receiverId) {
      socket.emit('stop-typing', {
        receiverId,
        isTyping: false,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Handle file upload logic here
    const file = files[0];
    console.log('File selected:', file.name);
    
    // You can upload to Cloudinary or your file storage service
  };

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/read`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col border">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="font-semibold">{receiverName?.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-bold">{receiverName}</h3>
            <div className="flex items-center gap-1 text-sm opacity-90">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <span>{isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Send className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold">No messages yet</p>
            <p className="text-sm">Start a conversation with {receiverName}</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === user?.id;
            const messageTime = new Date(message.createdAt);
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                    isOwnMessage
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <div className={`text-xs mt-1 flex justify-end ${
                    isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {format(messageTime, 'HH:mm')}
                    {isOwnMessage && message.isRead && (
                      <span className="ml-1">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {/* Typing Indicator */}
        {isTyping && typingUser && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-lg rounded-bl-none p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                if (e.target.value.trim()) {
                  sendTypingIndicator();
                } else {
                  stopTyping();
                }
              }}
              onKeyDown={handleKeyDown}
              onBlur={stopTyping}
              placeholder="Type your message..."
              className="w-full border rounded-lg py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32"
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1 hover:bg-gray-100 rounded"
                type="button"
              >
                <Paperclip className="h-4 w-4 text-gray-500" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded" type="button">
                <ImageIcon className="h-4 w-4 text-gray-500" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded" type="button">
                <Smile className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            multiple
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </div>
  );
}