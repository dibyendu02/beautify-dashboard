'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, Store, ArrowRight, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';

interface MerchantLoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

function MerchantLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const redirectAttempted = useRef(false);
  
  const { 
    login, 
    logout,
    isLoading, 
    isAuthenticated, 
    user, 
    application,
    requestPasswordReset 
  } = useMerchantAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<MerchantLoginForm>({
    defaultValues: {
      rememberMe: false
    }
  });

  // Check if merchant is already logged in
  useEffect(() => {
    console.log('🔍 LoginPage useEffect:', { isAuthenticated, user: !!user, isLoading, redirectAttempted: redirectAttempted.current });
    
    // Only proceed if auth state is fully loaded and we haven't attempted redirect yet
    if (isLoading || redirectAttempted.current) {
      return;
    }

    // Only redirect if we have both authentication and user data
    if (isAuthenticated && user) {
      const redirectTo = searchParams.get('redirect') || '/merchant';
      console.log('🚀 LoginPage: User authenticated, redirecting to:', redirectTo);
      
      redirectAttempted.current = true;
      setIsRedirecting(true);
      
      // Use a longer timeout to ensure state is stable and avoid race conditions
      const timeoutId = setTimeout(() => {
        router.replace(redirectTo);
      }, 150);

      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, user, isLoading, router, searchParams]);

  // Reset redirect flag when authentication state changes to logged out
  useEffect(() => {
    if (!isAuthenticated) {
      redirectAttempted.current = false;
      setIsRedirecting(false);
    }
  }, [isAuthenticated]);

  // Check for registration success parameter
  useEffect(() => {
    const registered = searchParams.get('registered');
    if (registered === 'true') {
      setShowRegistrationSuccess(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowRegistrationSuccess(false), 5000);
    }
  }, [searchParams]);

  const onSubmit = async (data: MerchantLoginForm) => {
    // Prevent double submission
    if (isLoading || isRedirecting) {
      console.log('🚫 Login already in progress, ignoring submission');
      return;
    }

    try {
      console.log('🚀 Form submitted, calling login...', data);
      const success = await login(data.email, data.password, data.rememberMe);
      console.log('📝 Login function returned:', success);
      
      if (success) {
        // Don't redirect here - let the useEffect handle it after auth state updates
        console.log('✅ Login successful, auth state will handle redirect');
      } else {
        console.log('❌ Login failed, showing error');
        setError('root', {
          type: 'manual',
          message: 'Invalid email or password. Please check your credentials and try again.'
        });
      }
    } catch (error) {
      console.error('💥 Login form error:', error);
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      return;
    }
    
    const success = await requestPasswordReset(resetEmail);
    if (success) {
      setShowPasswordReset(false);
      setResetEmail('');
    }
  };

  const getApplicationStatusBadge = () => {
    if (!application) return null;
    
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Application Pending' },
      under_review: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle, label: 'Under Review' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Rejected' },
      incomplete: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'Incomplete' }
    };
    
    const config = statusConfig[application.status];
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.label}
      </div>
    );
  };

  if (showPasswordReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-6">
              <Image 
                src="/beautify_logo.png" 
                alt="Beautify Logo" 
                width={48} 
                height={48} 
                className="object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-600">
              Enter your merchant email address and we'll send you a reset link.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="space-y-4">
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                  placeholder="Enter your merchant email"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPasswordReset(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordReset}
                  disabled={!resetEmail || isLoading}
                  className="flex-1 bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex">
      {/* Logout button - positioned at top right if user is logged in */}
      {isAuthenticated && user && (
        <button
          onClick={logout}
          className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      )}
      
      {/* Left side - Brand/Info */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-20 xl:px-24 bg-white border-r border-gray-100">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl shadow-lg mb-6">
              <Image 
                src="/beautify_logo.png" 
                alt="Beautify Logo" 
                width={56} 
                height={56} 
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Beautify
              <span className="block text-2xl font-semibold text-pink-600 mt-1">
                Business Portal
              </span>
            </h1>
            <p className="text-gray-700 leading-relaxed">
              Grow your beauty business with our comprehensive merchant platform. 
              Manage appointments, customers, services, and revenue all in one place.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-100">
            <div className="flex items-center mb-4">
              <Store className="w-6 h-6 text-pink-600 mr-3" />
              <span className="text-gray-900 font-semibold">For Beauty Professionals</span>
            </div>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-pink-500 mr-2" />
                Smart appointment scheduling
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-pink-500 mr-2" />
                Customer relationship management
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-pink-500 mr-2" />
                Secure payment processing
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-pink-500 mr-2" />
                Business analytics & insights
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-pink-500 mr-2" />
                Marketing & promotion tools
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-lg mb-4">
              <Image 
                src="/beautify_logo.png" 
                alt="Beautify Logo" 
                width={48} 
                height={48} 
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Beautify Business</h1>
          </div>

          {/* Application Status Badge */}
          {application && (
            <div className="mb-6 text-center">
              {getApplicationStatusBadge()}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-600">
                Sign in to your merchant dashboard to manage your business
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Root error display */}
              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-700">{errors.root.message}</p>
                  </div>
                </div>
              )}

              {/* Registration success message */}
              {showRegistrationSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-green-700 font-medium">Registration successful!</p>
                      <p className="text-sm text-green-600">Please sign in with your credentials to access your merchant dashboard.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Email
                </label>
                <input
                  {...register('email', {
                    required: 'Business email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                  placeholder="Enter your business email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Remember me checkbox */}
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me for 30 days</span>
                </label>
                
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  className="text-sm text-pink-600 hover:text-pink-500 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || isRedirecting}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-pink-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : isRedirecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer links */}
          <div className="mt-8">
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                New to Beautify?{' '}
                <Link
                  href="/merchant/register"
                  className="text-pink-600 font-semibold hover:text-pink-500 transition-colors"
                >
                  Apply for merchant account
                </Link>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Are you a customer? Download our mobile app for bookings
              </p>
            </div>
            
            <div className="mt-3 text-center">
              <p className="text-gray-600 text-sm">
                Administrator?{' '}
                <Link
                  href="/admin/login"
                  className="text-pink-600 font-semibold hover:text-pink-500 transition-colors"
                >
                  Admin Portal
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              © 2024 Beautify Business Portal. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Loading merchant login...</p>
      </div>
    </div>
  );
}

function ErrorFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <p className="text-gray-600 mb-4">Something went wrong loading the login page.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export default function MerchantLoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MerchantLoginPageContent />
    </Suspense>
  );
}