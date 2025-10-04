'use client';

import { usePathname } from 'next/navigation'
import MerchantDashboardLayout from '@/components/layout/MerchantDashboardLayout'
import { MerchantAuthGuard } from '@/components/auth/MerchantAuthGuard'

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Public routes that should not have dashboard layout
  const publicRoutes = ['/merchant/login', '/merchant/register', '/merchant/reset-password']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  return (
    <>
      {isPublicRoute ? (
        // For public routes, render without dashboard layout but still with auth guard for redirects
        <MerchantAuthGuard>
          {children}
        </MerchantAuthGuard>
      ) : (
        // For protected routes, use auth guard and dashboard layout
        <MerchantAuthGuard>
          <MerchantDashboardLayout>{children}</MerchantDashboardLayout>
        </MerchantAuthGuard>
      )}
    </>
  )
}