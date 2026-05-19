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
        const fetchOrCreateUserDoc = async () => {
          try {
            const { doc, getDoc, setDoc } = await import('firebase/firestore')
            const { db } = await import('@/lib/firebase')
            const userRef = doc(db, 'users', firebaseUser.uid)
            const docSnap = await getDoc(userRef)
            
            const today = new Date().toISOString().split('T')[0]
            let streak = 0
            let lastActive = null
            
            if (docSnap.exists()) {
              const data = docSnap.data()
              streak = data.streak || 0
              lastActive = data.last_active || null
              
              if (lastActive) {
                const lastActiveDate = new Date(lastActive)
                const todayDate = new Date(today)
                // Calculate difference in days ignoring hours
                const timeDiff = todayDate.getTime() - lastActiveDate.getTime()
                const diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
                
                if (diffDays === 1) {
                  streak += 1
                } else if (diffDays > 1) {
                  streak = 1
                } else if (diffDays === 0 && streak === 0) {
                  streak = 1
                }
              } else {
                streak = 1
              }
            } else {
              streak = 1
            }
            
            await setDoc(userRef, {
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              streak,
              last_active: today,
              updated_at: new Date().toISOString(),
            }, { merge: true })
            
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              streak,
              last_active: today,
            })
          } catch (err) {
            console.error('Error loading user document from Firestore:', err)
            // Fallback setting user anyway
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
            })
          }
        }
        fetchOrCreateUserDoc()
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [setUser])

  return <>{children}</>
}

