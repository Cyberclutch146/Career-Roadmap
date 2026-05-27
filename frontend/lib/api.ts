import axios from 'axios'
import { auth } from './firebase'
import { logger } from './logger'


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Public routes that should NOT trigger a redirect on 401
const PUBLIC_PATHS = ['/', '/login']

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    if (auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken(true)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (e) {
        logger.error('[API] Error getting Firebase token', e)
      }
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // With Firebase Auth, token refresh is handled automatically, 
      // but if the backend still returns 401, we might need to redirect to login.
      if (!PUBLIC_PATHS.includes(window.location.pathname)) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
