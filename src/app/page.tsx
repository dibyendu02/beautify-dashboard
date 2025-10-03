'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/merchant')
    } else {
      // Redirect to merchant login by default
      router.push('/merchant/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-black font-medium">Loading your dashboard...</p>
      </div>
    </div>
  )
}
