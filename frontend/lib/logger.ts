const isDev = process.env.NODE_ENV !== 'production'

/**
 * Application-wide logger.
 *
 * - info / warn  → only printed in development (silenced in production).
 * - error        → always printed to console AND surfaces a toast notification
 *                  to the user so errors never fail silently in the UI.
 */
export const logger = {
  info(message: string, ...args: unknown[]): void {
    if (isDev) {
      console.log(`[INFO] ${message}`, ...args)
    }
  },

  warn(message: string, ...args: unknown[]): void {
    if (isDev) {
      console.warn(`[WARN] ${message}`, ...args)
    }
  },

  error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${message}`, error ?? '')
    if (typeof window !== 'undefined') {
      import('sonner').then(({ toast }) => {
        toast.error(message)
      }).catch(err => {
        console.error('Failed to show error toast:', err)
      })
    }
  },
}

