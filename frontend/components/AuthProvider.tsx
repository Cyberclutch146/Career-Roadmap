'use client'

import { useEffect, useState, useRef } from 'react'
import { useStore } from '@/store'
import { usePathname, useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const isPublicPath = (path: string) => {
  if (path === '/' || path === '/login' || path === '/gallery') return true
  return false
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useStore()
  const pathname = usePathname()
  const router = useRouter()
  const [isInitializing, setIsInitializing] = useState(true)
  const isRedirecting = useRef(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          streak: user?.streak || 0,
          last_active: new Date().toISOString().split('T')[0]
        })
        isRedirecting.current = false
      } else {
        setUser(null)
      }
      setIsInitializing(false)
    })

    return () => unsubscribe()
  }, [setUser])

  useEffect(() => {
    if (!isInitializing && !user && !isPublicPath(pathname) && !isRedirecting.current) {
      isRedirecting.current = true
      router.replace('/login')
    }
  }, [isInitializing, user, pathname, router])

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // On protected routes with no user, show spinner while redirecting to home
  if (!user && !isPublicPath(pathname)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return <>{children}</>
}

