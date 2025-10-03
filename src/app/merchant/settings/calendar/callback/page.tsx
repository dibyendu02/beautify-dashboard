'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, Calendar, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import { calendarService } from '@/services/api';
import toast from 'react-hot-toast';

export default function CalendarCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [provider, setProvider] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const provider = searchParams.get('provider') || 'google';

        setProvider(provider);

        if (error) {
          setStatus('error');
          setMessage(`Authorization failed: ${error}`);
          toast.error('Calendar authorization was cancelled or failed');
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('Authorization code not received');
          toast.error('Invalid callback - no authorization code received');
          return;
        }

        // Handle the OAuth callback
        const response = await calendarService.handleOAuthCallback(provider, code, state || undefined);

        if (response.success) {
          setStatus('success');
          setMessage(`${provider.charAt(0).toUpperCase() + provider.slice(1)} Calendar connected successfully!`);
          toast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} Calendar integration enabled`);
          
          // Redirect to settings page after a short delay
          setTimeout(() => {
            router.push('/merchant/settings?tab=integrations&success=calendar');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(response.message || 'Failed to connect calendar');
          toast.error(response.message || 'Failed to complete calendar integration');
        }
      } catch (error) {
        console.error('Calendar callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred while connecting your calendar');
        toast.error('Failed to connect calendar');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  const handleReturnToSettings = () => {
    router.push('/merchant/settings?tab=integrations');
  };

  const handleRetryConnection = () => {
    router.push('/merchant/settings?tab=integrations');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Status Icon */}
        <div className="mb-6">
          {status === 'loading' && (
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
          
          {status === 'success' && (
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          )}
          
          {status === 'error' && (
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          )}
        </div>

        {/* Status Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {status === 'loading' && 'Connecting Calendar...'}
          {status === 'success' && 'Calendar Connected!'}
          {status === 'error' && 'Connection Failed'}
        </h1>

        {/* Provider Info */}
        {provider && (
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600 capitalize">
              {provider} Calendar Integration
            </span>
          </div>
        )}

        {/* Status Message */}
        <p className="text-gray-600 mb-6">
          {status === 'loading' && 'Please wait while we set up your calendar integration...'}
          {status === 'success' && message}
          {status === 'error' && message}
        </p>

        {/* Actions */}
        <div className="space-y-3">
          {status === 'loading' && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>This may take a few seconds</span>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  Your appointments will now sync automatically with your calendar.
                  You'll be redirected to settings shortly.
                </p>
              </div>
              <Button 
                onClick={handleReturnToSettings}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Settings
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  {message.includes('cancelled') 
                    ? 'You can try connecting again from your settings page.'
                    : 'Please check your internet connection and try again.'
                  }
                </p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  onClick={handleReturnToSettings}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Settings
                </Button>
                <Button 
                  onClick={handleRetryConnection}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Having trouble? Contact support at{' '}
            <a 
              href="mailto:support@beautify.com" 
              className="text-primary-600 hover:text-primary-700"
            >
              support@beautify.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}