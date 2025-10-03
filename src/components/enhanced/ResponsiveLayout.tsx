'use client';

import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Smartphone,
  Tablet,
  Monitor as Desktop,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    time: string;
    unread: boolean;
  }>;
  onLogout?: () => void;
}

export default function ResponsiveLayout({
  children,
  sidebar,
  header,
  user,
  notifications = [],
  onLogout,
}: ResponsiveLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && isMobile) {
        const sidebar = document.getElementById('mobile-sidebar');
        const menuButton = document.getElementById('mobile-menu-button');
        
        if (sidebar && !sidebar.contains(event.target as Node) && 
            menuButton && !menuButton.contains(event.target as Node)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, isMobile]);

  const unreadNotifications = notifications.filter(n => n.unread).length;

  const getDeviceIcon = () => {
    if (isMobile) return Smartphone;
    if (isTablet) return Tablet;
    return Desktop;
  };

  const DeviceIcon = getDeviceIcon();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex h-full flex-col bg-white shadow-xl lg:shadow-none border-r border-gray-200">
          {/* Mobile close button */}
          {isMobile && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          )}
          
          {/* Sidebar content */}
          <div id="mobile-sidebar" className="flex-1 overflow-y-auto">
            {sidebar}
          </div>

          {/* Device indicator (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <DeviceIcon className="w-4 h-4" />
                <span>
                  {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'} View
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        'transition-all duration-300',
        'lg:ml-64'
      )}>
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Left side */}
              <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <Button
                  id="mobile-menu-button"
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Menu className="w-5 h-5" />
                </Button>

                {/* Custom header content */}
                {header}

                {/* Search bar (hidden on mobile) */}
                <div className="hidden md:block">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-2 lg:space-x-4">

                {/* Notifications */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </Button>

                  {/* Notifications dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={cn(
                                'p-4 border-b border-gray-200 hover:bg-gray-50',
                                notification.unread && 'bg-blue-50'
                              )}
                            >
                              <div className="flex items-start space-x-3">
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User menu */}
                {user && (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 max-w-xs"
                    >
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <User className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.role}
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </Button>

                    {/* User dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="p-4 border-b border-gray-200 lg:hidden">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <User className="w-4 h-4 mr-3" />
                            Profile
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Settings className="w-4 h-4 mr-3" />
                            Settings
                          </button>
                          <hr className="my-2 border-gray-200" />
                          <button
                            onClick={onLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>

        {/* Mobile search (shown when needed) */}
        {isMobile && (
          <div className="md:hidden px-4 py-3 bg-white border-t border-gray-200 sticky bottom-0">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}