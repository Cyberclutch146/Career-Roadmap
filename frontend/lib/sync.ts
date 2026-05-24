import { User } from '@/types'

/**
 * Determines whether the app should sync with Firestore.
 * This is gated by the NEXT_PUBLIC_ENABLE_CLOUD_SYNC environment variable
 * and requires the user to be logged in.
 */
export const shouldSyncWithFirestore = (user: User | null): boolean => {
  return process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC === 'true' && !!user
}
