'use client';

import { usePathname } from 'next/navigation'
import MerchantDashboardLayout from '@/components/layout/MerchantDashboardLayout'
import { MerchantAuthProvider } from '@/hooks/useMerchantAuth'
import { MerchantAuthGuard } from '@/components/auth/MerchantAuthGuard'

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Public routes that don't need auth protection but still need the provider
  const publicRoutes = ['/merchant/login', '/merchant/register', '/merchant/reset-password']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Always wrap with provider so auth context is available everywhere
  return (
    <MerchantAuthProvider>
      {isPublicRoute ? (
        // For public routes, render without auth guard and dashboard layout
        children
      ) : (
        // For protected routes, use auth guard and dashboard layout
        <MerchantAuthGuard>
          <MerchantDashboardLayout>{children}</MerchantDashboardLayout>
        </MerchantAuthGuard>
      )}
    </MerchantAuthProvider>
  )
}