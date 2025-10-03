'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';

interface PasswordResetForm {
  password: string;
  confirmPassword: string;
}

export default function MerchantPasswordResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  
  const { resetPassword, isLoading } = useMerchantAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm<PasswordResetForm>();

  const password = watch('password');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setResetToken(token);
      // In a real app, you'd validate the token with the backend
      setIsValidToken(true);
    } else {
      setIsValidToken(false);
    }
    setIsCheckingToken(false);
  }, [searchParams]);

  const onSubmit = async (data: PasswordResetForm) => {
    try {
      if (!resetToken) {
        setError('root', {
          type: 'manual',
          message: 'Invalid reset token. Please request a new password reset.'
        });
        return;
      }

      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: 'Passwords do not match'
        });
        return;
      }

      const success = await resetPassword(resetToken, data.password);
      
      if (success) {
        router.push('/merchant/login?message=password-reset-success');
      }
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.response?.data?.message || 'Password reset failed. Please try again.'
      });
    }
  };

  if (isCheckingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Validating reset token...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl shadow-lg mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-8">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            
            <div className="space-y-4">
              <Link
                href="/merchant/login"
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-200 flex items-center justify-center"
              >
                Back to Login
              </Link>
              
              <Link
                href="/merchant/support"
                className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-lg mb-6">
            <Image 
              src="/beautify_logo.png" 
              alt="Beautify Logo" 
              width={48} 
              height={48} 
              className="object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Password</h2>
          <p className="text-gray-600">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
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

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password *
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 pr-12"
                  placeholder="Enter your new password"
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
              
              {/* Password strength indicator */}
              <div className="mt-2">
                <div className="text-xs text-gray-600">
                  Password must contain:
                  <ul className="mt-1 space-y-1">
                    <li className={`flex items-center ${password && password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${password && /[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      One uppercase letter
                    </li>
                    <li className={`flex items-center ${password && /[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      One lowercase letter
                    </li>
                    <li className={`flex items-center ${password && /\d/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      One number
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Confirm Password field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 pr-12"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-pink-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Update Password
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link
            href="/merchant/login"
            className="text-pink-600 hover:text-pink-500 font-medium text-sm"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}