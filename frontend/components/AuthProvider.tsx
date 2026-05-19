'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import { usePathname } from 'next/navigation'

const isPublicPath = (path: string) => {
  if (path === '/' || path === '/login' || path === '/gallery') return true
  if (path.startsWith('/roadmap/')) return true
  return false
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useStore()
  const pathname = usePathname()
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // If accessing a non-public path (e.g., /dashboard, /generate) and there is no user,
    // automatically set the mock user to bypass auth.
    if (!isPublicPath(pathname) && !user) {
      const mockUser = {
        id: 'mock-user-123',
        email: 'learner@roadmap.ai',
        name: 'Alex Learner',
        streak: 5,
        last_active: new Date().toISOString().split('T')[0]
      }
      setUser(mockUser)
    }
    setIsInitializing(false)
  }, [setUser, pathname, user])

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return <>{children}</>
}

