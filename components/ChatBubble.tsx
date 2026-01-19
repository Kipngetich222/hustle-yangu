// components/chatbubble.tsx
'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    name: string;
    avatar?: string;
  };
}

interface ChatBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function ChatBubble({ message, isOwnMessage }: ChatBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isOwnMessage && (
        <Avatar
          src={message.sender?.avatar}
          fallback={message.sender?.name || 'U'}
          size="sm"
        />
      )}
      
      <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : ''}`}>
        {!isOwnMessage && (
          <span className="text-xs text-gray-500 mb-1 ml-1">
            {message.sender?.name}
          </span>
        )}
        
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isOwnMessage
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        
        <div className={`flex items-center gap-2 mt-1 ${isOwnMessage ? 'justify-end' : ''}`}>
          <span className="text-xs text-gray-500">
            {format(new Date(message.createdAt), 'h:mm a')}
          </span>
          {isOwnMessage && (
            <span className="text-gray-400">
              {message.isRead ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
      
      {isOwnMessage && (
        <Avatar
          src={message.sender?.avatar}
          fallback={message.sender?.name || 'U'}
          size="sm"
        />
      )}
    </div>
  );
}