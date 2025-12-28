'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Menu, Bell, Search, Settings, Shield, User, Activity, ClipboardList, CreditCard, Cog, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock admin notifications
  const notifications = [
    {
      id: 1,
      title: 'New merchant application',
      message: 'Beauty Salon XYZ has submitted a new application',
      time: '2 min ago',
      unread: true,
      type: 'application',
    },
    {
      id: 2,
      title: 'Payment dispute reported',
      message: 'Customer John Doe reported a payment issue',
      time: '15 min ago',
      unread: true,
      type: 'payment',
    },
    {
      id: 3,
      title: 'System maintenance completed',
      message: 'Database optimization completed successfully',
      time: '1 hour ago',
      unread: false,
      type: 'system',
    },
    {
      id: 4,
      title: 'High traffic alert',
      message: 'Platform experiencing 150% above normal traffic',
      time: '2 hours ago',
      unread: false,
      type: 'alert',
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const notificationIcons: Record<string, React.ElementType> = {
    application: ClipboardList,
    payment: CreditCard,
    system: Cog,
    alert: AlertTriangle,
  };

  const notificationIconColors: Record<string, string> = {
    application: 'bg-blue-100 text-blue-600',
    payment: 'bg-green-100 text-green-600',
    system: 'bg-gray-100 text-gray-600',
    alert: 'bg-amber-100 text-amber-600',
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left side */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-black hover:text-black hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Admin Search bar */}
            <div className="hidden md:block ml-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search users, merchants, bookings..."
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* System Status */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center text-sm text-black">
                <Activity className="w-4 h-4 mr-1 text-green-500" />
                <span>System Status: </span>
                <span className="font-medium text-green-600">All Systems Operational</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-black hover:text-black hover:bg-slate-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                  <div className="p-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-black">Notifications</h3>
                      <span className="text-sm text-black">{unreadCount} unread</span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => {
                      const Icon = notificationIcons[notification.type] || Bell;
                      const iconColor = notificationIconColors[notification.type] || 'bg-gray-100 text-gray-600';
                      return (
                        <div
                          key={notification.id}
                          className={cn(
                            'p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors',
                            notification.unread && 'bg-indigo-50'
                          )}
                        >
                          <div className="flex items-start">
                            <div className={cn('p-2 rounded-full flex-shrink-0 mr-3', iconColor)}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold text-black">
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm text-black mb-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-black">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-3 border-t border-slate-200 bg-slate-50">
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              type="button"
              className="p-2 text-black hover:text-black hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-black">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-black flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </p>
                </div>
              </button>

              {/* Profile dropdown */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                  <div className="p-4 border-b border-slate-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-black">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-black">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="flex items-center w-full px-3 py-2 text-sm text-black hover:bg-slate-100 rounded-lg">
                      <User className="w-4 h-4 mr-3" />
                      Profile Settings
                    </button>
                    <button className="flex items-center w-full px-3 py-2 text-sm text-black hover:bg-slate-100 rounded-lg">
                      <Shield className="w-4 h-4 mr-3" />
                      Security
                    </button>
                    <button className="flex items-center w-full px-3 py-2 text-sm text-black hover:bg-slate-100 rounded-lg">
                      <Settings className="w-4 h-4 mr-3" />
                      Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
}