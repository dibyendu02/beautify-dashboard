'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Check,
  AlertCircle,
  Calendar,
  DollarSign,
  MessageSquare,
  Package,
  Star,
  Trash2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { socketService } from '@/services/socket';
import { formatRelativeTime, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'message' | 'review' | 'system' | 'promotion';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  actionUrl?: string;
}

const notificationIcons = {
  booking: Calendar,
  payment: DollarSign,
  message: MessageSquare,
  review: Star,
  system: AlertCircle,
  promotion: Package,
};

const priorityColors = {
  low: 'text-gray-600',
  medium: 'text-blue-600',
  high: 'text-orange-600',
  urgent: 'text-red-600',
};

const priorityBadgeColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in a real app, this would come from an API
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'booking',
      title: 'New Booking Request',
      message: 'Sarah Johnson requested a haircut appointment for tomorrow at 2:00 PM',
      data: { bookingId: 'booking_123', customerId: 'customer_456' },
      read: false,
      priority: 'high',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      actionUrl: '/merchant/bookings',
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $85.00 received for booking #12345',
      data: { paymentId: 'payment_789', amount: 85.00 },
      read: false,
      priority: 'medium',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      actionUrl: '/merchant/payments',
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      message: 'Mike Brown sent you a message about his upcoming appointment',
      data: { chatId: 'chat_abc', customerId: 'customer_def' },
      read: true,
      priority: 'medium',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      actionUrl: '/merchant/messages',
    },
    {
      id: '4',
      type: 'review',
      title: 'New Review',
      message: 'Emma Davis left a 5-star review for your facial service',
      data: { reviewId: 'review_ghi', rating: 5 },
      read: true,
      priority: 'low',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/merchant/reviews',
    },
    {
      id: '5',
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 12:00 AM to 2:00 AM',
      read: false,
      priority: 'urgent',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      type: 'promotion',
      title: 'Promotion Ends Soon',
      message: 'Your "Summer Special" promotion ends in 3 days',
      data: { promotionId: 'promo_jkl' },
      read: true,
      priority: 'medium',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/merchant/promotions',
    },
  ];

  useEffect(() => {
    // Load notifications
    setNotifications(mockNotifications);
    setIsLoading(false);

    // Setup real-time listeners
    const unsubscribeBooking = socketService.onBookingUpdate((booking) => {
      addNotification({
        id: `booking_${booking._id}_${Date.now()}`,
        type: 'booking',
        title: 'Booking Update',
        message: `Booking status changed to ${booking.status}`,
        data: { bookingId: booking._id },
        read: false,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        actionUrl: '/merchant/bookings',
      });
    });

    const unsubscribePayment = socketService.onPaymentUpdate((payment) => {
      addNotification({
        id: `payment_${payment._id}_${Date.now()}`,
        type: 'payment',
        title: 'Payment Received',
        message: `Payment of $${payment.amount} received`,
        data: { paymentId: payment._id },
        read: false,
        priority: 'high',
        createdAt: new Date().toISOString(),
        actionUrl: '/merchant/payments',
      });
    });

    const unsubscribeMessage = socketService.onNewMessage((message) => {
      if (window.location.pathname !== `/merchant/chat/${message.chatId}`) {
        addNotification({
          id: `message_${message.id}_${Date.now()}`,
          type: 'message',
          title: 'New Message',
          message: `${message.senderName} sent you a message`,
          data: { chatId: message.chatId, customerId: message.senderId },
          read: false,
          priority: 'medium',
          createdAt: new Date().toISOString(),
          actionUrl: '/merchant/messages',
        });
      }
    });

    return () => {
      unsubscribeBooking();
      unsubscribePayment();
      unsubscribeMessage();
    };
  }, []);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    // Show toast for high/urgent priority notifications
    if (notification.priority === 'high' || notification.priority === 'urgent') {
      toast(notification.title, {
        icon: notification.priority === 'urgent'
          ? React.createElement(AlertTriangle, { className: 'w-5 h-5 text-red-500' })
          : React.createElement(Info, { className: 'w-5 h-5 text-blue-500' }),
        duration: 5000,
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
      toast.success('All notifications cleared');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    
    setIsOpen(false);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={cn(
                    'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    filter === 'all'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={cn(
                    'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    filter === 'unread'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="flex items-center justify-between mt-3">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={markAllAsRead}
                      disabled={unreadCount === 0}
                      className="text-xs"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Mark all read
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clearAll}
                      className="text-xs text-red-600"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear all
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => {
                    const Icon = notificationIcons[notification.type];
                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          'p-4 hover:bg-gray-50 cursor-pointer transition-colors relative',
                          !notification.read && 'bg-blue-50'
                        )}
                      >
                        {!notification.read && (
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        
                        <div className="flex items-start space-x-3 pl-4">
                          <div className={cn(
                            'p-2 rounded-full flex-shrink-0',
                            notification.type === 'booking' && 'bg-blue-100 text-blue-600',
                            notification.type === 'payment' && 'bg-green-100 text-green-600',
                            notification.type === 'message' && 'bg-purple-100 text-purple-600',
                            notification.type === 'review' && 'bg-yellow-100 text-yellow-600',
                            notification.type === 'system' && 'bg-red-100 text-red-600',
                            notification.type === 'promotion' && 'bg-indigo-100 text-indigo-600'
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              {notification.priority !== 'low' && (
                                <span className={cn(
                                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                  priorityBadgeColors[notification.priority]
                                )}>
                                  {notification.priority}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatRelativeTime(notification.createdAt)}
                            </p>
                          </div>

                          <div className="flex-shrink-0 flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!notification.read) {
                                  markAsRead(notification.id);
                                }
                              }}
                              className={cn(
                                'p-1 rounded hover:bg-gray-200 transition-colors',
                                notification.read && 'opacity-50'
                              )}
                            >
                              <Check className="w-3 h-3 text-gray-500" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 rounded hover:bg-red-100 transition-colors"
                            >
                              <X className="w-3 h-3 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    window.location.href = '/merchant/notifications';
                    setIsOpen(false);
                  }}
                  className="w-full text-center"
                >
                  View all notifications
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}