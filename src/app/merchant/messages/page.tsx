'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Search, 
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  senderName: string;
  isRead: boolean;
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  customerName: string;
  customerAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

// Demo data
const demoConversations: Conversation[] = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    customerAvatar: 'SJ',
    lastMessage: 'Thank you for the amazing haircut! Can I book another appointment?',
    timestamp: '10:30 AM',
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: '1',
        text: 'Hi! I would like to book a haircut appointment for this weekend.',
        timestamp: '9:15 AM',
        senderId: 'customer',
        senderName: 'Sarah Johnson',
        isRead: true,
        status: 'read'
      },
      {
        id: '2',
        text: 'Hello Sarah! I have availability on Saturday at 2 PM or Sunday at 11 AM. Which works better for you?',
        timestamp: '9:20 AM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      },
      {
        id: '3',
        text: 'Saturday at 2 PM sounds perfect! What should I prepare?',
        timestamp: '9:25 AM',
        senderId: 'customer',
        senderName: 'Sarah Johnson',
        isRead: true,
        status: 'read'
      },
      {
        id: '4',
        text: 'Great! Just come with clean hair and bring any inspiration photos you might have. See you Saturday!',
        timestamp: '9:30 AM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      },
      {
        id: '5',
        text: 'Thank you for the amazing haircut! Can I book another appointment?',
        timestamp: '10:30 AM',
        senderId: 'customer',
        senderName: 'Sarah Johnson',
        isRead: false,
        status: 'delivered'
      },
      {
        id: '6',
        text: 'I absolutely loved the layers you added!',
        timestamp: '10:32 AM',
        senderId: 'customer',
        senderName: 'Sarah Johnson',
        isRead: false,
        status: 'delivered'
      }
    ]
  },
  {
    id: '2',
    customerName: 'Maria Garcia',
    customerAvatar: 'MG',
    lastMessage: 'What products do you recommend for my skin type?',
    timestamp: 'Yesterday',
    unreadCount: 1,
    isOnline: false,
    messages: [
      {
        id: '1',
        text: 'Hi! I loved my facial last week. What products do you recommend for my skin type?',
        timestamp: 'Yesterday 3:45 PM',
        senderId: 'customer',
        senderName: 'Maria Garcia',
        isRead: false,
        status: 'delivered'
      }
    ]
  },
  {
    id: '3',
    customerName: 'Emma Wilson',
    customerAvatar: 'EW',
    lastMessage: 'Perfect! See you then.',
    timestamp: 'Monday',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: '1',
        text: 'Hi Emma! Your monthly nail appointment is coming up. Would you like to keep the same time?',
        timestamp: 'Monday 2:30 PM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      },
      {
        id: '2',
        text: 'Perfect! See you then.',
        timestamp: 'Monday 2:45 PM',
        senderId: 'customer',
        senderName: 'Emma Wilson',
        isRead: true,
        status: 'read'
      }
    ]
  },
  {
    id: '4',
    customerName: 'Jessica Brown',
    customerAvatar: 'JB',
    lastMessage: 'I need to reschedule my appointment',
    timestamp: 'Sunday',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: '1',
        text: 'I need to reschedule my appointment for tomorrow. Is Thursday available?',
        timestamp: 'Sunday 6:20 PM',
        senderId: 'customer',
        senderName: 'Jessica Brown',
        isRead: true,
        status: 'read'
      },
      {
        id: '2',
        text: 'No problem! Thursday at 3 PM is available. I\'ve updated your booking.',
        timestamp: 'Sunday 6:30 PM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      }
    ]
  },
  {
    id: '5',
    customerName: 'Aisha Patel',
    customerAvatar: 'AP',
    lastMessage: 'Can you do a traditional henna design for my wedding?',
    timestamp: '2 days ago',
    unreadCount: 3,
    isOnline: true,
    messages: [
      {
        id: '1',
        text: 'Hi! I\'m getting married next month and would love to book a bridal henna session.',
        timestamp: '2 days ago 4:15 PM',
        senderId: 'customer',
        senderName: 'Aisha Patel',
        isRead: true,
        status: 'read'
      },
      {
        id: '2',
        text: 'Congratulations! I\'d love to help with your special day. Do you have any specific designs in mind?',
        timestamp: '2 days ago 4:20 PM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      },
      {
        id: '3',
        text: 'Can you do a traditional henna design for my wedding?',
        timestamp: '2 days ago 4:25 PM',
        senderId: 'customer',
        senderName: 'Aisha Patel',
        isRead: false,
        status: 'delivered'
      },
      {
        id: '4',
        text: 'I have some reference photos I can share',
        timestamp: '2 days ago 4:26 PM',
        senderId: 'customer',
        senderName: 'Aisha Patel',
        isRead: false,
        status: 'delivered'
      },
      {
        id: '5',
        text: 'Also, do you travel to the venue or should I come to your salon?',
        timestamp: '2 days ago 4:27 PM',
        senderId: 'customer',
        senderName: 'Aisha Patel',
        isRead: false,
        status: 'delivered'
      }
    ]
  },
  {
    id: '6',
    customerName: 'Chen Wei',
    customerAvatar: 'CW',
    lastMessage: 'Thank you so much!',
    timestamp: '3 days ago',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: '1',
        text: 'Hello! I need a professional makeup look for a business photoshoot tomorrow. Are you available?',
        timestamp: '3 days ago 1:30 PM',
        senderId: 'customer',
        senderName: 'Chen Wei',
        isRead: true,
        status: 'read'
      },
      {
        id: '2',
        text: 'Yes, I have a slot at 10 AM. We can do a natural, professional look that photographs well.',
        timestamp: '3 days ago 1:35 PM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      },
      {
        id: '3',
        text: 'Perfect! Should I come with a clean face?',
        timestamp: '3 days ago 1:40 PM',
        senderId: 'customer',
        senderName: 'Chen Wei',
        isRead: true,
        status: 'read'
      },
      {
        id: '4',
        text: 'Yes, and if you have any makeup allergies, please let me know. I\'ll have setting spray for the photoshoot.',
        timestamp: '3 days ago 1:45 PM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      },
      {
        id: '5',
        text: 'Thank you so much!',
        timestamp: '3 days ago 1:46 PM',
        senderId: 'customer',
        senderName: 'Chen Wei',
        isRead: true,
        status: 'read'
      }
    ]
  },
  {
    id: '7',
    customerName: 'Isabella Rodriguez',
    customerAvatar: 'IR',
    lastMessage: 'What about eyebrow shaping?',
    timestamp: '4 days ago',
    unreadCount: 1,
    isOnline: false,
    messages: [
      {
        id: '1',
        text: 'Hi! I\'m interested in microblading. Can you tell me more about the process?',
        timestamp: '4 days ago 11:15 AM',
        senderId: 'customer',
        senderName: 'Isabella Rodriguez',
        isRead: true,
        status: 'read'
      },
      {
        id: '2',
        text: 'Hi Isabella! Microblading creates natural-looking eyebrows that last 1-2 years. The process takes about 2 hours and includes a consultation.',
        timestamp: '4 days ago 11:30 AM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      },
      {
        id: '3',
        text: 'That sounds great! What\'s the price and do you offer payment plans?',
        timestamp: '4 days ago 11:35 AM',
        senderId: 'customer',
        senderName: 'Isabella Rodriguez',
        isRead: true,
        status: 'read'
      },
      {
        id: '4',
        text: 'The full service is €350 and includes a touch-up session after 6 weeks. I do offer payment plans for treatments over €300.',
        timestamp: '4 days ago 11:40 AM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      },
      {
        id: '5',
        text: 'What about eyebrow shaping?',
        timestamp: '4 days ago 11:45 AM',
        senderId: 'customer',
        senderName: 'Isabella Rodriguez',
        isRead: false,
        status: 'delivered'
      }
    ]
  },
  {
    id: '8',
    customerName: 'Fatima Al-Zahra',
    customerAvatar: 'FA',
    lastMessage: 'Sounds perfect, I\'ll book it',
    timestamp: '5 days ago',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: '1',
        text: 'Hello! I\'m looking for a halal-certified spa treatment. Do you offer any?',
        timestamp: '5 days ago 3:00 PM',
        senderId: 'customer',
        senderName: 'Fatima Al-Zahra',
        isRead: true,
        status: 'read'
      },
      {
        id: '2',
        text: 'Yes! We have halal-certified facial treatments and use organic, halal products. We also have private treatment rooms.',
        timestamp: '5 days ago 3:05 PM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      },
      {
        id: '3',
        text: 'That\'s wonderful! Can I book a deep cleansing facial for this weekend?',
        timestamp: '5 days ago 3:10 PM',
        senderId: 'customer',
        senderName: 'Fatima Al-Zahra',
        isRead: true,
        status: 'read'
      },
      {
        id: '4',
        text: 'Absolutely! Saturday at 2 PM is available. The treatment takes 90 minutes and includes a consultation.',
        timestamp: '5 days ago 3:15 PM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      },
      {
        id: '5',
        text: 'Sounds perfect, I\'ll book it',
        timestamp: '5 days ago 3:16 PM',
        senderId: 'customer',
        senderName: 'Fatima Al-Zahra',
        isRead: true,
        status: 'read'
      }
    ]
  },
  {
    id: '9',
    customerName: 'Olivia Thompson',
    customerAvatar: 'OT',
    lastMessage: 'I\'ll bring some inspo pics!',
    timestamp: '1 week ago',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: '1',
        text: 'Hi! I want to try something completely different with my hair. I\'m thinking of going from blonde to brunette.',
        timestamp: '1 week ago 10:00 AM',
        senderId: 'customer',
        senderName: 'Olivia Thompson',
        isRead: true,
        status: 'read'
      },
      {
        id: '2',
        text: 'That\'s exciting! A dramatic color change like that will need a consultation first to assess your hair condition and plan the process.',
        timestamp: '1 week ago 10:15 AM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      },
      {
        id: '3',
        text: 'How long would the whole process take?',
        timestamp: '1 week ago 10:20 AM',
        senderId: 'customer',
        senderName: 'Olivia Thompson',
        isRead: true,
        status: 'read'
      },
      {
        id: '4',
        text: 'For a full color transformation, plan for 3-4 hours. We might need to do it in stages to keep your hair healthy.',
        timestamp: '1 week ago 10:25 AM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      },
      {
        id: '5',
        text: 'I\'ll bring some inspo pics!',
        timestamp: '1 week ago 10:30 AM',
        senderId: 'customer',
        senderName: 'Olivia Thompson',
        isRead: true,
        status: 'read'
      }
    ]
  },
  {
    id: '10',
    customerName: 'Priya Sharma',
    customerAvatar: 'PS',
    lastMessage: 'Is threading better than waxing?',
    timestamp: '1 week ago',
    unreadCount: 2,
    isOnline: false,
    messages: [
      {
        id: '1',
        text: 'Hello! I need to get my eyebrows done for a special event. What services do you offer?',
        timestamp: '1 week ago 2:30 PM',
        senderId: 'customer',
        senderName: 'Priya Sharma',
        isRead: true,
        status: 'read'
      },
      {
        id: '2',
        text: 'Hi Priya! We offer eyebrow threading, waxing, tinting, and shaping. What look are you going for?',
        timestamp: '1 week ago 2:35 PM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      },
      {
        id: '3',
        text: 'I want them to look defined but natural. Is threading better than waxing?',
        timestamp: '1 week ago 2:40 PM',
        senderId: 'customer',
        senderName: 'Priya Sharma',
        isRead: false,
        status: 'delivered'
      },
      {
        id: '4',
        text: 'Also, how long does the result typically last?',
        timestamp: '1 week ago 2:41 PM',
        senderId: 'customer',
        senderName: 'Priya Sharma',
        isRead: false,
        status: 'delivered'
      }
    ]
  },
  {
    id: '11',
    customerName: 'Sophie Martin',
    customerAvatar: 'SM',
    lastMessage: 'Do you have gift certificates?',
    timestamp: '2 weeks ago',
    unreadCount: 1,
    isOnline: false,
    messages: [
      {
        id: '1',
        text: 'Hi! I want to surprise my mom with a spa day. What packages do you recommend?',
        timestamp: '2 weeks ago 4:00 PM',
        senderId: 'customer',
        senderName: 'Sophie Martin',
        isRead: true,
        status: 'read'
      },
      {
        id: '2',
        text: 'That\'s so sweet! Our "Pamper Package" includes a facial, manicure, and scalp massage. Very popular for gifts!',
        timestamp: '2 weeks ago 4:05 PM',
        senderId: 'merchant',
        senderName: 'You',
        isRead: true,
        status: 'read'
      },
      {
        id: '3',
        text: 'Do you have gift certificates?',
        timestamp: '2 weeks ago 4:10 PM',
        senderId: 'customer',
        senderName: 'Sophie Martin',
        isRead: false,
        status: 'delivered'
      }
    ]
  }
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(demoConversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  useEffect(() => {
    // Focus input when conversation changes
    if (selectedConversation && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [selectedConversation]);

  const filteredConversations = demoConversations.filter(conversation =>
    conversation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderId: 'merchant',
        senderName: 'You',
        isRead: false,
        status: 'sent'
      };

      // In a real app, this would update the backend
      selectedConversation.messages.push(message);
      setNewMessage('');
      
      // Focus back to input after sending
      setTimeout(() => {
        messageInputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="h-full flex bg-gray-50 -m-6">
      {/* Conversations List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-3 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900 mb-3">Messages</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto min-h-0 max-h-full">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-semibold">
                      {conversation.customerAvatar}
                    </span>
                  </div>
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.customerName}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                </div>
                
                {conversation.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex-shrink-0 p-3 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-semibold">
                    {selectedConversation.customerAvatar}
                  </span>
                </div>
                {selectedConversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {selectedConversation.customerName}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedConversation.isOnline ? 'Online' : 'Last seen recently'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 min-h-0">
            {selectedConversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === 'merchant' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg shadow-sm ${
                    message.senderId === 'merchant'
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className={`flex items-center justify-end mt-1 space-x-1 ${
                    message.senderId === 'merchant' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <span className="text-xs">{message.timestamp}</span>
                    {message.senderId === 'merchant' && getMessageStatusIcon(message.status)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex-shrink-0 p-3 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <input
                  ref={messageInputRef}
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
            <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}