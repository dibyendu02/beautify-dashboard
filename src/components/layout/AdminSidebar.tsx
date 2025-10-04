'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Store,
  Calendar,
  Scissors,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  UserCheck,
  Building2,
  Palette,
  FileText,
  MessageSquare,
  TrendingUp,
  Database,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  {
    name: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'User Management',
    icon: Users,
    children: [
      { name: 'All Users', href: '/admin/users', icon: Users },
      { name: 'Merchants', href: '/admin/merchants', icon: Store },
      { name: 'Customers', href: '/admin/customers', icon: UserCheck },
    ],
  },
  {
    name: 'Business Management',
    icon: Building2,
    children: [
      { name: 'Merchant Applications', href: '/admin/applications', icon: FileText },
      { name: 'Business Profiles', href: '/admin/businesses', icon: Building2 },
      { name: 'Categories', href: '/admin/categories', icon: Palette },
    ],
  },
  {
    name: 'Services & Bookings',
    icon: Scissors,
    children: [
      { name: 'All Services', href: '/admin/services', icon: Scissors },
      { name: 'All Bookings', href: '/admin/bookings', icon: Calendar },
      { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    ],
  },
  {
    name: 'Financial',
    icon: CreditCard,
    children: [
      { name: 'Payments', href: '/admin/payments', icon: CreditCard },
      { name: 'Transactions', href: '/admin/transactions', icon: Database },
      { name: 'Revenue Analytics', href: '/admin/revenue', icon: TrendingUp },
    ],
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    badge: null,
  },
  {
    name: 'System',
    icon: Settings,
    children: [
      { name: 'Platform Settings', href: '/admin/settings', icon: Settings },
      { name: 'Security', href: '/admin/security', icon: Shield },
    ],
  },
];

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/admin/login');
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isItemActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const isParentActive = (children: any[]) => {
    return children.some(child => isItemActive(child.href));
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900 bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-black">Beautify</h1>
                <p className="text-sm text-black">Admin Portal</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-black">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-black flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Super Administrator
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              if (item.children) {
                const isExpanded = expandedItems.includes(item.name);
                const isActive = isParentActive(item.children);
                
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={cn(
                        'flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'text-black hover:bg-slate-50 hover:text-black'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'w-5 h-5 mr-3',
                          isActive ? 'text-indigo-600' : 'text-black'
                        )}
                      />
                      <span className="flex-1 text-left">{item.name}</span>
                      <div
                        className={cn(
                          'w-5 h-5 transition-transform duration-200',
                          isExpanded ? 'rotate-90' : 'rotate-0'
                        )}
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="mt-2 ml-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              'flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors',
                              isItemActive(child.href)
                                ? 'bg-indigo-100 text-indigo-700 border-l-2 border-indigo-500'
                                : 'text-black hover:bg-slate-50 hover:text-black'
                            )}
                          >
                            <child.icon
                              className={cn(
                                'w-4 h-4 mr-3',
                                isItemActive(child.href) ? 'text-indigo-600' : 'text-black'
                              )}
                            />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = isItemActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-black hover:bg-slate-50 hover:text-black'
                  )}
                >
                  <item.icon
                    className={cn(
                      'w-5 h-5 mr-3',
                      isActive ? 'text-indigo-600' : 'text-black'
                    )}
                  />
                  <span className="flex-1">{item.name}</span>
                  {(item as any).badge && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                      {(item as any).badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors group"
            >
              <LogOut className="w-5 h-5 mr-3 text-white" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}