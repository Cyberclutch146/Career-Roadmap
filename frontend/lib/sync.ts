import { User } from '@/types'

/**
 * Determines whether the app should sync with Firestore.
 * This is gated by the NEXT_PUBLIC_ENABLE_CLOUD_SYNC environment variable
 * and requires the user to be logged in.
 * Accepts: 'true', 'TRUE', '1' (case-insensitive, whitespace-trimmed).
 */
export const shouldSyncWithFirestore = (user: User | null): boolean => {
  const flag = (process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC ?? '').trim().toLowerCase()
  return (flag === 'true' || flag === '1') && !!user
}
