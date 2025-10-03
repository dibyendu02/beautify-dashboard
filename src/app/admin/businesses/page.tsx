'use client';

// Redirect to the correct business-profiles page
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BusinessesRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/admin/business-profiles');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Business Profiles...</p>
      </div>
    </div>
  );
}