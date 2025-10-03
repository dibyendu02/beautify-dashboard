'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  LogOut,
  Home,
  Users,
  Store,
  Calendar,
  BarChart3,
  FileText,
  Database,
  Settings,
  Filter,
  Search,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'system' | 'merchant' | 'user' | 'payment';
  priority: 'low' | 'medium' | 'high';
}

export default function NotificationsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'merchant' | 'user' | 'payment'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Demo notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'System Maintenance Scheduled',
      message: 'System maintenance is scheduled for tonight at 2:00 AM EST. Expected downtime: 30 minutes.',
      time: '2 hours ago',
      unread: true,
      type: 'system',
      priority: 'high'
    },
    {
      id: '2',
      title: 'New Merchant Application',
      message: 'Glamour Beauty Studio has submitted a new merchant application for review.',
      time: '4 hours ago',
      unread: true,
      type: 'merchant',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'User Registration Spike',
      message: '150+ new users registered in the last 24 hours. Monitor system performance.',
      time: '6 hours ago',
      unread: false,
      type: 'user',
      priority: 'low'
    },
    {
      id: '4',
      title: 'Payment Dispute Resolved',
      message: 'Payment dispute #PD-2024-001 has been resolved in favor of the merchant.',
      time: '8 hours ago',
      unread: false,
      type: 'payment',
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected from IP: 192.168.1.100',
      time: '12 hours ago',
      unread: true,
      type: 'system',
      priority: 'high'
    },
    {
      id: '6',
      title: 'Merchant Verification Complete',
      message: 'Elite Hair Salon has completed verification and is now active on the platform.',
      time: '1 day ago',
      unread: false,
      type: 'merchant',
      priority: 'low'
    },
    {
      id: '7',
      title: 'Revenue Milestone Reached',
      message: 'Platform has reached €500,000 in total revenue this month!',
      time: '2 days ago',
      unread: false,
      type: 'system',
      priority: 'low'
    },
    {
      id: '8',
      title: 'Chargeback Alert',
      message: 'New chargeback request received for transaction #TXN-89765. Requires immediate attention.',
      time: '3 days ago',
      unread: false,
      type: 'payment',
      priority: 'high'
    },
    // Additional demo notifications for pagination testing
    ...Array.from({ length: 40 }, (_, i) => ({
      id: `${9 + i}`,
      title: [
        'System Update Available',
        'New Merchant Registration',
        'Payment Processing Alert',
        'User Feedback Received',
        'Security Scan Complete',
        'Backup Process Finished',
        'API Rate Limit Warning',
        'Database Optimization Complete'
      ][i % 8],
      message: [
        'A new system update is available and ready for installation.',
        'A new merchant has registered and is awaiting approval.',
        'Payment processing system is experiencing minor delays.',
        'New user feedback has been submitted for review.',
        'Weekly security scan has completed successfully.',
        'Automated backup process has finished without errors.',
        'API rate limit approaching threshold for several endpoints.',
        'Database optimization has completed, performance improved.'
      ][i % 8],
      time: `${Math.floor(i / 8) + 4} days ago`,
      unread: Math.random() > 0.6,
      type: ['system', 'merchant', 'payment', 'user'][i % 4] as 'system' | 'merchant' | 'user' | 'payment',
      priority: ['low', 'medium', 'high'][i % 3] as 'low' | 'medium' | 'high'
    }))
  ]);


  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'merchant':
        return <Store className="w-5 h-5 text-blue-500" />;
      case 'user':
        return <Users className="w-5 h-5 text-green-500" />;
      case 'payment':
        return <CheckCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, unread: false })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesFilter = filter === 'all' || 
        (filter === 'unread' && notification.unread) ||
        (filter !== 'unread' && notification.type === filter);
      
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  }, [notifications, filter, searchTerm]);

  // Paginate filtered notifications
  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNotifications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotifications, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <AdminLayout notifications={notifications}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All notifications are read'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              onClick={markAllAsRead}
              variant="outline" 
              size="sm"
              disabled={unreadCount === 0}
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="all">All Notifications</option>
                    <option value="unread">Unread Only</option>
                    <option value="system">System</option>
                    <option value="merchant">Merchant</option>
                    <option value="user">User</option>
                    <option value="payment">Payment</option>
                  </select>
                </div>
                
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notifications found</p>
                </div>
              ) : (
                paginatedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'bg-white rounded-xl p-4 shadow-sm border border-gray-200 border-l-4 transition-all hover:shadow-md',
                      getPriorityColor(notification.priority),
                      notification.unread && 'ring-2 ring-blue-100'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <span className={cn(
                              'px-2 py-1 text-xs font-medium rounded-full',
                              notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            )}>
                              {notification.priority}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-400">
                              {notification.time}
                            </span>
                            <span className={cn(
                              'px-2 py-1 text-xs font-medium rounded-full',
                              notification.type === 'system' ? 'bg-orange-100 text-orange-800' :
                              notification.type === 'merchant' ? 'bg-blue-100 text-blue-800' :
                              notification.type === 'user' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            )}>
                              {notification.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {notification.unread && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {filteredNotifications.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredNotifications.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  showItemsPerPageSelector={true}
                  showTotalItems={true}
                  showPageNumbers={true}
                  maxPageNumbers={7}
                />
              </div>
            )}
          </div>
        </div>
    </AdminLayout>
  );
}