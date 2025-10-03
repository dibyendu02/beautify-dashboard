'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Filter,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  DollarSign,
  MessageSquare,
  Star,
  AlertCircle,
  Package,
  Settings,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  X,
  Eye,
  Archive,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { cn, formatDate, formatDateTime } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'message' | 'review' | 'system' | 'promotion' | 'customer' | 'order';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  archived: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  actionUrl?: string;
  actionText?: string;
  imageUrl?: string;
  sender?: {
    name: string;
    avatar?: string;
  };
}

interface NotificationStats {
  total: number;
  unread: number;
  today: number;
  thisWeek: number;
  archived: number;
}

const notificationTypeConfig = {
  booking: {
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Booking'
  },
  payment: {
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Payment'
  },
  message: {
    icon: MessageSquare,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Message'
  },
  review: {
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: 'Review'
  },
  system: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: 'System'
  },
  promotion: {
    icon: Package,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    label: 'Promotion'
  },
  customer: {
    icon: Users,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    label: 'Customer'
  },
  order: {
    icon: Package,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'Order'
  },
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const filterOptions = [
  { value: 'all', label: 'All Notifications' },
  { value: 'unread', label: 'Unread' },
  { value: 'today', label: 'Today' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'archived', label: 'Archived' },
];

const typeFilters = [
  { value: 'all', label: 'All Types' },
  { value: 'booking', label: 'Bookings' },
  { value: 'payment', label: 'Payments' },
  { value: 'message', label: 'Messages' },
  { value: 'review', label: 'Reviews' },
  { value: 'customer', label: 'Customers' },
  { value: 'order', label: 'Orders' },
  { value: 'system', label: 'System' },
];

const priorityFilters = [
  { value: 'all', label: 'All Priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    today: 0,
    thisWeek: 0,
    archived: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Demo notifications data
  const demoNotifications: Notification[] = [
    {
      id: '1',
      type: 'booking',
      title: 'New Booking Request',
      message: 'Sarah Johnson has requested a haircut and style appointment for tomorrow at 2:00 PM. The estimated duration is 90 minutes and the total cost is €85.00.',
      data: { 
        bookingId: 'booking_123', 
        customerId: 'customer_456',
        amount: 85.00,
        date: '2024-01-16T14:00:00Z',
        service: 'Haircut & Style'
      },
      read: false,
      archived: false,
      priority: 'high',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      actionUrl: '/merchant/bookings',
      actionText: 'View Booking',
      sender: {
        name: 'Sarah Johnson',
        avatar: undefined,
      },
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of €85.00 has been successfully received for booking #12345. The payment was processed via credit card and will be transferred to your account within 2-3 business days.',
      data: { 
        paymentId: 'payment_789', 
        amount: 85.00,
        bookingId: 'booking_123',
        method: 'Credit Card'
      },
      read: false,
      archived: false,
      priority: 'medium',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      actionUrl: '/merchant/payments',
      actionText: 'View Payment',
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message from Customer',
      message: 'Mike Brown sent you a message: "Hi! I need to reschedule my appointment for next week. Could you please let me know what slots are available? Thanks!"',
      data: { 
        chatId: 'chat_abc', 
        customerId: 'customer_def',
        messagePreview: 'Hi! I need to reschedule my appointment...'
      },
      read: true,
      archived: false,
      priority: 'medium',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      actionUrl: '/merchant/messages',
      actionText: 'Reply to Message',
      sender: {
        name: 'Mike Brown',
        avatar: undefined,
      },
    },
    {
      id: '4',
      type: 'review',
      title: 'New 5-Star Review',
      message: 'Emma Davis left a fantastic 5-star review for your facial treatment service: "Amazing experience! The facial was so relaxing and my skin feels incredible. Highly recommend!"',
      data: { 
        reviewId: 'review_ghi', 
        rating: 5,
        service: 'Facial Treatment',
        customerId: 'customer_emma'
      },
      read: true,
      archived: false,
      priority: 'low',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/merchant/reviews',
      actionText: 'View Review',
      sender: {
        name: 'Emma Davis',
        avatar: undefined,
      },
    },
    {
      id: '5',
      type: 'system',
      title: 'Scheduled System Maintenance',
      message: 'Important: Scheduled maintenance will occur tonight from 12:00 AM to 2:00 AM EST. During this time, the booking system may be temporarily unavailable. We apologize for any inconvenience.',
      read: false,
      archived: false,
      priority: 'urgent',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      type: 'promotion',
      title: 'Promotion Ending Soon',
      message: 'Your "Summer Special - 20% Off All Services" promotion ends in 3 days. Consider extending it or creating a new promotion to maintain customer interest.',
      data: { 
        promotionId: 'promo_jkl',
        discount: 20,
        expiryDate: '2024-01-19T23:59:59Z'
      },
      read: true,
      archived: false,
      priority: 'medium',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/merchant/promotions',
      actionText: 'Manage Promotions',
    },
    {
      id: '7',
      type: 'customer',
      title: 'New Customer Registration',
      message: 'Jennifer Smith has just registered and is interested in your nail care services. She has indicated availability for appointments this week.',
      data: { 
        customerId: 'customer_jen',
        services: ['Manicure', 'Pedicure', 'Nail Art'],
        preferredTime: 'afternoons'
      },
      read: false,
      archived: false,
      priority: 'low',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/merchant/customers',
      actionText: 'View Customer',
      sender: {
        name: 'Jennifer Smith',
        avatar: undefined,
      },
    },
    {
      id: '8',
      type: 'order',
      title: 'Product Order Received',
      message: 'New product order #ORD-2024-001 for €145.00. Customer ordered Premium Hair Care Bundle and Express Shipping. Order requires processing within 24 hours.',
      data: { 
        orderId: 'ORD-2024-001',
        amount: 145.00,
        products: ['Premium Hair Care Bundle'],
        shipping: 'Express',
        customerId: 'customer_lisa'
      },
      read: true,
      archived: false,
      priority: 'high',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/merchant/orders',
      actionText: 'Process Order',
      sender: {
        name: 'Lisa Martinez',
        avatar: undefined,
      },
    },
    {
      id: '9',
      type: 'booking',
      title: 'Appointment Cancellation',
      message: 'Unfortunately, Alex Thompson has cancelled their massage appointment scheduled for today at 4:00 PM. A cancellation fee may apply according to your policy.',
      data: { 
        bookingId: 'booking_cancelled',
        customerId: 'customer_alex',
        originalAmount: 120.00,
        cancellationFee: 30.00,
        reason: 'Personal emergency'
      },
      read: false,
      archived: false,
      priority: 'medium',
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/merchant/bookings',
      actionText: 'View Details',
      sender: {
        name: 'Alex Thompson',
        avatar: undefined,
      },
    },
    {
      id: '10',
      type: 'system',
      title: 'Profile Verification Update',
      message: 'Your business profile verification has been approved! You can now access all premium features including advanced analytics and priority customer support.',
      read: true,
      archived: false,
      priority: 'high',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/merchant/profile',
      actionText: 'View Profile',
    },
  ];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setNotifications(demoNotifications);
      
      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);
      
      const newStats: NotificationStats = {
        total: demoNotifications.length,
        unread: demoNotifications.filter(n => !n.read).length,
        today: demoNotifications.filter(n => new Date(n.createdAt) >= today).length,
        thisWeek: demoNotifications.filter(n => new Date(n.createdAt) >= thisWeek).length,
        archived: demoNotifications.filter(n => n.archived).length,
      };
      
      setStats(newStats);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = (notificationIds: string[]) => {
    setNotifications(prev =>
      prev.map(notification =>
        notificationIds.includes(notification.id)
          ? { ...notification, read: true, updatedAt: new Date().toISOString() }
          : notification
      )
    );
    
    setStats(prev => ({ 
      ...prev, 
      unread: prev.unread - notificationIds.filter(id => 
        notifications.find(n => n.id === id && !n.read)
      ).length 
    }));
    
    toast.success(`${notificationIds.length} notification${notificationIds.length > 1 ? 's' : ''} marked as read`);
  };

  const handleMarkAsUnread = (notificationIds: string[]) => {
    setNotifications(prev =>
      prev.map(notification =>
        notificationIds.includes(notification.id)
          ? { ...notification, read: false, updatedAt: new Date().toISOString() }
          : notification
      )
    );
    
    setStats(prev => ({ 
      ...prev, 
      unread: prev.unread + notificationIds.filter(id => 
        notifications.find(n => n.id === id && n.read)
      ).length 
    }));
    
    toast.success(`${notificationIds.length} notification${notificationIds.length > 1 ? 's' : ''} marked as unread`);
  };

  const handleArchive = (notificationIds: string[]) => {
    setNotifications(prev =>
      prev.map(notification =>
        notificationIds.includes(notification.id)
          ? { ...notification, archived: true, updatedAt: new Date().toISOString() }
          : notification
      )
    );
    
    setStats(prev => ({ 
      ...prev, 
      archived: prev.archived + notificationIds.length 
    }));
    
    toast.success(`${notificationIds.length} notification${notificationIds.length > 1 ? 's' : ''} archived`);
  };

  const handleDelete = (notificationIds: string[]) => {
    if (confirm(`Are you sure you want to delete ${notificationIds.length} notification${notificationIds.length > 1 ? 's' : ''}? This action cannot be undone.`)) {
      const deletedNotifications = notifications.filter(n => notificationIds.includes(n.id));
      const unreadDeleted = deletedNotifications.filter(n => !n.read).length;
      const archivedDeleted = deletedNotifications.filter(n => n.archived).length;
      
      setNotifications(prev =>
        prev.filter(notification => !notificationIds.includes(notification.id))
      );
      
      setStats(prev => ({ 
        total: prev.total - notificationIds.length,
        unread: prev.unread - unreadDeleted,
        archived: prev.archived - archivedDeleted,
        today: prev.today, // Could be updated based on date logic
        thisWeek: prev.thisWeek, // Could be updated based on date logic
      }));
      
      setSelectedNotifications([]);
      toast.success(`${notificationIds.length} notification${notificationIds.length > 1 ? 's' : ''} deleted`);
    }
  };

  const handleMarkAllAsRead = () => {
    const unreadNotifications = filteredNotifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      handleMarkAsRead(unreadNotifications.map(n => n.id));
    }
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
    setIsSelectAll(!isSelectAll);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead([notification.id]);
    }
    
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    // Apply search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.type.toLowerCase().includes(query) ||
        notification.sender?.name?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);

      switch (filter) {
        case 'unread':
          filtered = filtered.filter(n => !n.read);
          break;
        case 'today':
          filtered = filtered.filter(n => new Date(n.createdAt) >= today);
          break;
        case 'thisWeek':
          filtered = filtered.filter(n => new Date(n.createdAt) >= thisWeek);
          break;
        case 'archived':
          filtered = filtered.filter(n => n.archived);
          break;
      }
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(n => n.priority === priorityFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  useEffect(() => {
    setIsSelectAll(
      filteredNotifications.length > 0 && 
      filteredNotifications.every(n => selectedNotifications.includes(n.id))
    );
  }, [filteredNotifications, selectedNotifications]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with your business activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'card' ? 'list' : 'card')}
          >
            {viewMode === 'card' ? 'List View' : 'Card View'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && 'bg-primary-50 border-primary-200')}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-xl font-bold text-gray-900">{stats.unread}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-xl font-bold text-gray-900">{stats.today}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-xl font-bold text-gray-900">{stats.thisWeek}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Archive className="w-5 h-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Archived</p>
              <p className="text-xl font-bold text-gray-900">{stats.archived}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                  filter === option.value
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {typeFilters.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {priorityFilters.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-primary-700">
                {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleMarkAsRead(selectedNotifications)}
                className="text-primary-700 hover:text-primary-800"
              >
                <Check className="w-4 h-4 mr-1" />
                Mark Read
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleMarkAsUnread(selectedNotifications)}
                className="text-primary-700 hover:text-primary-800"
              >
                <Eye className="w-4 h-4 mr-1" />
                Mark Unread
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleArchive(selectedNotifications)}
                className="text-primary-700 hover:text-primary-800"
              >
                <Archive className="w-4 h-4 mr-1" />
                Archive
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(selectedNotifications)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header with controls */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isSelectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Select all ({filteredNotifications.length})
                </span>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMarkAllAsRead}
                disabled={filteredNotifications.filter(n => !n.read).length === 0}
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {searchTerm || filter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'You\'re all caught up!'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const config = notificationTypeConfig[notification.type];
              const Icon = config.icon;
              const isExpanded = expandedNotification === notification.id;

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'relative transition-colors',
                    !notification.read && 'bg-blue-50',
                    notification.archived && 'opacity-60'
                  )}
                >
                  {!notification.read && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                  )}

                  <div className={cn(
                    'p-4 hover:bg-gray-50 cursor-pointer transition-colors',
                    viewMode === 'card' ? 'pb-6' : 'py-3'
                  )}>
                    <div className="flex items-start space-x-3 pl-4">
                      {/* Selection checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => handleSelectNotification(notification.id)}
                        className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        onClick={(e) => e.stopPropagation()}
                      />

                      {/* Icon */}
                      <div className={cn(
                        'p-2 rounded-full flex-shrink-0',
                        config.bgColor
                      )}>
                        <Icon className={cn('w-4 h-4', config.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className={cn(
                                'text-sm font-medium',
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              )}>
                                {notification.title}
                              </p>
                              {notification.priority !== 'low' && (
                                <span className={cn(
                                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                  priorityColors[notification.priority]
                                )}>
                                  {notification.priority}
                                </span>
                              )}
                              <span className={cn(
                                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                'bg-gray-100 text-gray-700'
                              )}>
                                {config.label}
                              </span>
                            </div>

                            <p className={cn(
                              'text-sm text-gray-600 mb-2',
                              viewMode === 'list' && !isExpanded && 'line-clamp-1'
                            )}>
                              {isExpanded || viewMode === 'card' 
                                ? notification.message 
                                : notification.message.length > 100 
                                  ? `${notification.message.substring(0, 100)}...`
                                  : notification.message
                              }
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>{formatDateTime(notification.createdAt)}</span>
                                {notification.sender && (
                                  <span>from {notification.sender.name}</span>
                                )}
                              </div>

                              <div className="flex items-center space-x-2">
                                {viewMode === 'list' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedNotification(
                                        isExpanded ? null : notification.id
                                      );
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </button>
                                )}

                                {notification.actionUrl && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNotificationClick(notification);
                                    }}
                                    className="text-primary-600 hover:text-primary-700"
                                  >
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    {notification.actionText || 'View'}
                                  </Button>
                                )}

                                <div className="relative">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}