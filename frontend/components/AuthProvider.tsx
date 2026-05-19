'use client'

import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useStore } from '@/store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User',
        })
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [setUser])

  return <>{children}</>
}
