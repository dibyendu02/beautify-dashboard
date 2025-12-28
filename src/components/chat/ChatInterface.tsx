'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Phone, Video, Paperclip, Smile, MoreVertical, X, Check, CheckCheck } from 'lucide-react';
import { socketService } from '@/services/socket';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
}

interface ChatInterfaceProps {
  chatId: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  isOnline?: boolean;
  onClose?: () => void;
  className?: string;
}

export default function ChatInterface({
  chatId,
  recipientId,
  recipientName,
  recipientAvatar,
  isOnline = false,
  onClose,
  className = '',
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recipientTyping, setRecipientTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize socket connection and load messages
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Initialize socket if not connected
        if (!socketService.isSocketConnected()) {
          socketService.initialize(currentUser.id);
        }

        // Join chat room
        socketService.joinChatRoom(chatId);

        // Load existing messages
        await loadMessages();
        
        setIsConnected(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setIsLoading(false);
      }
    };

    initializeChat();

    return () => {
      socketService.leaveChatRoom(chatId);
    };
  }, [chatId, currentUser.id]);

  // Socket event listeners
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      if (message.chatId === chatId) {
        setMessages(prev => [...prev, message]);
        
        // Mark message as read if it's from the recipient
        if (message.senderId === recipientId) {
          // API call to mark message as read would go here
        }
      }
    };

    const handleTyping = (data: { chatId: string; userId: string; isTyping: boolean }) => {
      if (data.chatId === chatId && data.userId === recipientId) {
        setRecipientTyping(data.isTyping);
      }
    };

    const unsubscribeMessage = socketService.onNewMessage(handleNewMessage);
    
    // Setup typing listener
    const socket = socketService.getSocket();
    if (socket) {
      socket.on('user_typing', handleTyping);
    }

    return () => {
      unsubscribeMessage();
      if (socket) {
        socket.off('user_typing', handleTyping);
      }
    };
  }, [chatId, recipientId]);

  const loadMessages = async () => {
    try {
      // This would be an API call to load chat messages
      // For now, using mock data
      const mockMessages: Message[] = [
        {
          id: '1',
          chatId,
          senderId: recipientId,
          senderName: recipientName,
          message: 'Hi! I would like to book an appointment for tomorrow.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true,
          type: 'text',
        },
        {
          id: '2',
          chatId,
          senderId: currentUser.id,
          senderName: `${currentUser.firstName} ${currentUser.lastName}`,
          message: 'Hello! I have availability tomorrow at 2 PM. Would that work for you?',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          read: true,
          type: 'text',
        },
        {
          id: '3',
          chatId,
          senderId: recipientId,
          senderName: recipientName,
          message: 'Perfect! I\'ll take that slot. What services do you recommend?',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          read: true,
          type: 'text',
        },
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !isConnected) return;

    const message = newMessage.trim();
    setNewMessage('');

    try {
      // Create optimistic message
      const optimisticMessage: Message = {
        id: Date.now().toString(),
        chatId,
        senderId: currentUser.id,
        senderName: `${currentUser.firstName} ${currentUser.lastName}`,
        message,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'text',
      };

      setMessages(prev => [...prev, optimisticMessage]);

      // Send via socket
      socketService.sendMessage(chatId, message, recipientId);

      // Focus back on input
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== Date.now().toString()));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Handle typing indicator
    if (!isTyping) {
      setIsTyping(true);
      socketService.sendTypingIndicator(chatId, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.sendTypingIndicator(chatId, false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-96 bg-white rounded-lg shadow-sm ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-96 bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              {recipientAvatar ? (
                <img
                  src={recipientAvatar}
                  alt={recipientName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-primary-600 font-medium text-sm">
                  {recipientName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{recipientName}</h3>
            <p className="text-sm text-gray-500">
              {isOnline ? 'Online' : 'Offline'}
              {recipientTyping && ' • typing...'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreVertical className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" className="p-2" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.senderId === currentUser.id;
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isOwn
                      ? 'bg-primary-500 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                  {getMessageTime(message.timestamp)}
                  {isOwn && (
                    <span className="ml-1 inline-flex">
                      {message.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {recipientTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md">
              <div className="px-4 py-2 bg-gray-100 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2 text-gray-500">
            <Paperclip className="w-4 h-4" />
          </Button>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={!isConnected}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-500 mt-2">Not connected. Trying to reconnect...</p>
        )}
      </div>
    </div>
  );
}