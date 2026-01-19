// hooks/useSocket.ts
import { useState, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

interface UseSocketOptions {
  autoConnect?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export function useSocket(url: string, options: UseSocketOptions = {}) {
  const {
    autoConnect = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000
  } = options;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const socketInstance = io(url, {
      autoConnect,
      reconnectionAttempts,
      reconnectionDelay,
      transports: ['websocket', 'polling']
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socketInstance.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socketInstance.on('typing', (data: { userId: string; isTyping: boolean }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    });

    socketInstance.on('stop-typing', (userId: string) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [url, autoConnect, reconnectionAttempts, reconnectionDelay]);

  const joinRoom = useCallback((roomId: string) => {
    if (socket) {
      socket.emit('join', roomId);
    }
  }, [socket]);

  const joinConversation = useCallback((userId: string, receiverId: string) => {
    if (socket) {
      socket.emit('join-conversation', { userId, receiverId });
    }
  }, [socket]);

  const sendMessage = useCallback((senderId: string, receiverId: string, content: string) => {
    if (socket) {
      socket.emit('message', { senderId, receiverId, content });
    }
  }, [socket]);

  const sendTyping = useCallback((receiverId: string, isTyping: boolean) => {
    if (socket) {
      socket.emit('typing', { receiverId, isTyping });
    }
  }, [socket]);

  const sendStopTyping = useCallback((receiverId: string) => {
    if (socket) {
      socket.emit('stop-typing', { receiverId });
    }
  }, [socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
    }
  }, [socket]);

  const reconnect = useCallback(() => {
    if (socket) {
      socket.connect();
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    messages,
    typingUsers: Array.from(typingUsers),
    joinRoom,
    joinConversation,
    sendMessage,
    sendTyping,
    sendStopTyping,
    disconnect,
    reconnect
  };
}