'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { loadUserFromStorage } from '@/store/slices/authSlice';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    // Try to load user from localStorage on mount
    const initAuth = async () => {
      try {
        await dispatch(loadUserFromStorage()).unwrap();
      } catch (error) {
        // No stored user data, redirect to login
        router.push('/merchant/login');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [dispatch, router]);

  useEffect(() => {
    // Redirect if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      router.push('/merchant/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Handle role-based routing
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
        return;
      }
      if (user.role !== 'merchant') {
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-black">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar isOpen={true} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col flex-1 w-64 bg-white">
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}