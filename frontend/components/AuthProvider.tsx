'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useStore } from '@/store'
import { usePathname, useRouter } from 'next/navigation'

const isPublicPath = (path: string) => {
  if (path === '/' || path === '/login' || path === '/gallery') return true
  if (path.startsWith('/roadmap/')) return true
  return false
}

const isRedirectIfLoggedInPath = (path: string) => {
  return path === '/' || path === '/login'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useStore()
  const router = useRouter()
  const pathname = usePathname()
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // Bypass authentication: Set a mock user
    const mockUser = {
      id: 'mock-user-123',
      email: 'learner@roadmap.ai',
      name: 'Alex Learner',
      streak: 5,
      last_active: new Date().toISOString().split('T')[0]
    }
    setUser(mockUser)
    setIsInitializing(false)

    // Redirect to dashboard if logged in and accessing landing/login paths
    if (isRedirectIfLoggedInPath(pathname)) {
      router.push('/dashboard')
    }
  }, [setUser, pathname, router])

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return <>{children}</>
}

