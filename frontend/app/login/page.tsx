'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { BookOpen, Mail, Lock, User, CheckCircle2, KeyRound } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'

export default function LoginPage() {
  const router = useRouter()
  type AuthMode = 'login' | 'signup'
  type AuthStep = 'credentials' | 'otp'
  
  const [mode, setMode] = useState<AuthMode>('login')
  const [step, setStep] = useState<AuthStep>('credentials')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    otp: '',
  })

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate inputs early
      if (mode === 'signup' && !formData.name) {
        throw new Error('Name is required for signup.')
      }
      if (!formData.email || !formData.password) {
        throw new Error('Email and password are required.')
      }

      // Send OTP to email via our API route
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP')

      // Move to OTP step
      setStep('otp')
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtpAndLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (!formData.otp) throw new Error('Please enter the OTP.')

      // Verify OTP via API route
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Invalid OTP')

      // OTP is valid! Proceed with Firebase Auth
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, formData.email, formData.password)
        router.push('/dashboard')
      } else if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        if (formData.name) {
          await updateProfile(userCredential.user, { displayName: formData.name })
        }
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (providerName: 'google') => {
    setError(null)
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 min-h-[calc(100vh-64px)] flex items-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-headline font-bold text-on-surface mb-2">
              {step === 'otp' ? 'Verify Your Email' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-on-surface-variant">
              {step === 'otp' 
                ? 'Enter the 6-digit code sent to your email' 
                : mode === 'login' 
                  ? 'Sign in to access your roadmaps' 
                  : 'Start your learning journey today'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              {step === 'otp' ? (
                <form onSubmit={handleVerifyOtpAndLogin} className="space-y-6">
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                    <Input
                      type="text"
                      placeholder="6-digit OTP"
                      value={formData.otp}
                      onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                      className="pl-10 text-center tracking-widest text-lg"
                      maxLength={6}
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-error-container/10 text-error rounded-lg text-sm text-center">
                      {error}
                    </div>
                  )}

                  <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                    Verify & {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </Button>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setStep('credentials')}
                      className="text-sm text-primary font-medium hover:underline"
                    >
                      Back to {mode === 'login' ? 'Login' : 'Signup'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <form onSubmit={handleSendOtp} className="space-y-6">
                    {mode === 'signup' && (
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                        <Input
                          type="text"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="pl-10"
                          required={mode === 'signup'}
                        />
                      </div>
                    )}

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-error-container/10 text-error rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                      {mode === 'login' ? 'Continue' : 'Create Account'}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-outline-variant/30"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-surface-container px-2 text-on-surface-variant">Or continue with</span>
                    </div>
                  </div>

                  {/* Social SSO Buttons */}
                  <div className="flex flex-col gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => handleSocialSignIn('google')}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 border border-outline-variant rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container-high active:bg-surface-container-highest transition-colors w-full"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.48 0-6.3-2.82-6.3-6.3s2.82-6.3 6.3-6.3c1.554 0 2.97.574 4.062 1.509l3.14-3.14C19.123 2.392 15.938 1 12.24 1 5.757 1 .5 6.257.5 12.75s5.257 11.75 11.74 11.75c6.545 0 11.76-5.22 11.76-11.75 0-.705-.075-1.4-.21-2.072l-11.55-.393z"
                        />
                      </svg>
                      Continue with Google
                    </button>
                  </div>

                  <div className="mt-6 text-center space-y-2">
                    <p className="text-on-surface-variant text-sm">
                      {mode === 'login' ? (
                        <>
                          Don't have an account?{' '}
                          <button
                            type="button"
                            onClick={() => { setMode('signup'); setError(null); }}
                            className="text-primary font-medium hover:underline"
                          >
                            Sign up
                          </button>
                        </>
                      ) : (
                        <>
                          Already have an account?{' '}
                          <button
                            type="button"
                            onClick={() => { setMode('login'); setError(null); }}
                            className="text-primary font-medium hover:underline"
                          >
                            Sign in
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
