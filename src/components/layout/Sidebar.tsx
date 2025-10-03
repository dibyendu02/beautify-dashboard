'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Store,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Users,
  CreditCard,
  MessageSquare,
  User,
  Bell,
} from 'lucide-react';
import Image from 'next/image';

const navigation = [
  { name: 'Dashboard', href: '/merchant', icon: LayoutDashboard },
  { name: 'Bookings', href: '/merchant/bookings', icon: Calendar },
  { name: 'Services', href: '/merchant/services', icon: Scissors },
  { name: 'Customers', href: '/merchant/customers', icon: Users },
  { name: 'Messages', href: '/merchant/messages', icon: MessageSquare },
  { name: 'Notifications', href: '/merchant/notifications', icon: Bell },
  { name: 'Analytics', href: '/merchant/analytics', icon: BarChart3 },
  { name: 'Payments', href: '/merchant/payments', icon: CreditCard },
  { name: 'Profile', href: '/merchant/profile', icon: User },
  { name: 'Settings', href: '/merchant/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useMerchantAuth();

  return (
    <div className="flex flex-col h-full w-64 bg-white shadow-xl border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-sm">
                <Image 
                  src="/beautify_logo.png" 
                  alt="Beautify Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-black">Beautify</h1>
                <p className="text-sm text-black">Merchant Portal</p>
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-semibold text-sm">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-black">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-black capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/merchant' && pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                      : 'text-black hover:bg-gray-50 hover:text-black'
                  )}
                >
                  <item.icon
                    className={cn(
                      'w-5 h-5 mr-3',
                      isActive ? 'text-primary-600' : 'text-black'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors group"
            >
              <LogOut className="w-5 h-5 mr-3 text-white" />
              Sign Out
            </button>
          </div>
        </div>
    </div>
  );
}