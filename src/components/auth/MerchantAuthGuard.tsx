'use client';

import { useEffect, ReactNode, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { Loader2, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

interface MerchantAuthGuardProps {
  children: ReactNode;
}

export const MerchantAuthGuard = ({ children }: MerchantAuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, application, isLoading } = useMerchantAuth();
  const redirectAttempted = useRef(false);

  // Routes that don't require authentication
  const publicRoutes = ['/merchant/login', '/merchant/register', '/merchant/apply', '/merchant/reset-password'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  useEffect(() => {
    // Reset redirect flag when pathname changes
    redirectAttempted.current = false;
  }, [pathname]);
  
  useEffect(() => {
    // Only proceed with route checks if auth state is fully loaded
    if (isLoading || redirectAttempted.current) {
      console.log('🛡️ MerchantAuthGuard: Auth still loading or redirect attempted, waiting...');
      return;
    }

    console.log('🛡️ MerchantAuthGuard: Checking auth state', { 
      isAuthenticated, 
      user: !!user, 
      pathname, 
      isLoading,
      isPublicRoute
    });

    // Progressive auth checking with multiple validation layers
    const performAuthCheck = () => {
      // Layer 1: Check React state
      const hasReactAuth = isAuthenticated && user;
      
      // Layer 2: Check localStorage
      const currentToken = localStorage.getItem('merchantAuthToken');
      const currentUser = localStorage.getItem('merchantUser');
      const hasStoredAuth = !!(currentToken && currentUser);
      
      // Layer 3: Validate token expiration if remember me was used
      let isTokenValid = true;
      if (hasStoredAuth) {
        const expiration = localStorage.getItem('merchantAuthExpiration');
        if (expiration) {
          isTokenValid = new Date() < new Date(expiration);
        }
      }
      
      // Layer 4: Comprehensive auth status
      const isFullyAuthenticated = (hasReactAuth || hasStoredAuth) && isTokenValid;
      
      console.log('🛡️ MerchantAuthGuard: Multi-layer auth check', {
        hasReactAuth,
        hasStoredAuth,
        isTokenValid,
        isFullyAuthenticated,
        pathname,
        isPublicRoute
      });
      
      // If not authenticated and trying to access protected route
      if (!isFullyAuthenticated && !isPublicRoute) {
        const redirectUrl = encodeURIComponent(pathname);
        console.log('🔒 MerchantAuthGuard: Redirecting to login, not authenticated for:', pathname);
        redirectAttempted.current = true;
        router.replace(`/merchant/login?redirect=${redirectUrl}`);
        return;
      }

      // If authenticated but trying to access login/register, redirect to dashboard
      if (isFullyAuthenticated && isPublicRoute) {
        console.log('✅ MerchantAuthGuard: Already authenticated, redirecting to dashboard from:', pathname);
        redirectAttempted.current = true;
        router.replace('/merchant');
        return;
      }
    };

    // Use shorter delay for faster response
    const timeoutId = setTimeout(performAuthCheck, 100);

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, user, pathname, router, isLoading, isPublicRoute]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your merchant dashboard...</p>
        </div>
      </div>
    );
  }

  // Allow access to public routes regardless of auth state
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // If not authenticated, show loading (will redirect via useEffect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Check merchant application status for certain routes
  if (user && application) {
    const applicationStatusRoutes = ['/merchant', '/merchant/dashboard'];
    
    if (applicationStatusRoutes.includes(pathname) || pathname.startsWith('/merchant/')) {
      // Show application status screen for non-approved merchants
      if (application.status !== 'approved') {
        return <MerchantApplicationStatus application={application} user={user} />;
      }
    }
  }

  // User is authenticated and approved, show protected content
  return <>{children}</>;
};

interface MerchantApplicationStatusProps {
  application: any;
  user: any;
}

const MerchantApplicationStatus = ({ application, user }: MerchantApplicationStatusProps) => {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      title: 'Application Under Review',
      description: 'Your merchant application is being reviewed by our team. This typically takes 2-3 business days.',
      actionText: 'Check Application Status',
      actionLink: '/merchant/application-status'
    },
    under_review: {
      icon: AlertTriangle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      title: 'Additional Review Required',
      description: 'Our team is conducting additional verification. You may be contacted for more information.',
      actionText: 'View Requirements',
      actionLink: '/merchant/application-status'
    },
    incomplete: {
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      title: 'Complete Your Application',
      description: 'Your application is missing some required information. Please complete all sections to proceed.',
      actionText: 'Complete Application',
      actionLink: '/merchant/complete-application'
    },
    rejected: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: 'Application Not Approved',
      description: 'Unfortunately, we cannot approve your merchant application at this time. You can submit a new application.',
      actionText: 'Contact Support',
      actionLink: '/merchant/support'
    }
  };

  const config = statusConfig[application.status as keyof typeof statusConfig];
  const Icon = config?.icon || Clock;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${config?.bgColor} ${config?.borderColor} border-2`}>
            <Icon className={`h-8 w-8 ${config?.color}`} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {config?.title || 'Application Status'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome {user.firstName} {user.lastName}
          </p>
        </div>

        <div className={`${config?.bgColor} ${config?.borderColor} border rounded-lg p-6`}>
          <p className="text-gray-700 mb-6">
            {config?.description || 'Your application status is being processed.'}
          </p>

          {/* Verification Steps */}
          {application.verificationSteps && (
            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-gray-900">Verification Progress:</h4>
              <div className="space-y-2">
                <VerificationStep 
                  completed={application.verificationSteps.businessEmailVerified}
                  label="Business Email Verified"
                />
                <VerificationStep 
                  completed={application.verificationSteps.documentsUploaded}
                  label="Documents Uploaded"
                />
                <VerificationStep 
                  completed={application.verificationSteps.bankDetailsProvided}
                  label="Bank Details Provided"
                />
                <VerificationStep 
                  completed={application.verificationSteps.backgroundCheckPassed}
                  label="Background Check"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-3">
            <Link
              href={config?.actionLink || '/merchant/application-status'}
              className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${config?.color.replace('text-', 'bg-').replace('-600', '-600')} hover:${config?.color.replace('text-', 'bg-').replace('-600', '-700')} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:${config?.color.replace('text-', 'ring-')}`}
            >
              {config?.actionText || 'Check Status'}
            </Link>
            
            <Link
              href="/merchant/login"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Sign Out
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Questions?{' '}
            <Link href="/merchant/support" className="font-medium text-pink-600 hover:text-pink-500">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

interface VerificationStepProps {
  completed: boolean;
  label: string;
}

const VerificationStep = ({ completed, label }: VerificationStepProps) => (
  <div className="flex items-center">
    {completed ? (
      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
    ) : (
      <div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-3" />
    )}
    <span className={`text-sm ${completed ? 'text-gray-900' : 'text-gray-500'}`}>
      {label}
    </span>
  </div>
);

export default MerchantAuthGuard;