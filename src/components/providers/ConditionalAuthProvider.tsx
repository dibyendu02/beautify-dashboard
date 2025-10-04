'use client';

import { usePathname } from 'next/navigation';
import { MerchantAuthProvider } from '@/hooks/useMerchantAuth';
import { ReactNode } from 'react';

interface ConditionalAuthProviderProps {
  children: ReactNode;
}

export default function ConditionalAuthProvider({ children }: ConditionalAuthProviderProps) {
  const pathname = usePathname();
  
  // Determine if this is a merchant route
  const isMerchantRoute = pathname.startsWith('/merchant');
  
  // For merchant routes, wrap with MerchantAuthProvider
  // For other routes (admin, etc.), render children directly
  if (isMerchantRoute) {
    return (
      <MerchantAuthProvider>
        {children}
      </MerchantAuthProvider>
    );
  }
  
  return <>{children}</>;
}