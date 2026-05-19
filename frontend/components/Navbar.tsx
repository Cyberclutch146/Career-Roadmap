'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, BookOpen, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react'
import { Button } from './ui/Button'
import { useStore } from '@/store'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, logout } = useStore()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      logout()
      setIsDropdownOpen(false)
      setIsMenuOpen(false)
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const baseLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/gallery', label: 'Explore' },
  ]

  const navLinks = user
    ? [...baseLinks, { href: '/dashboard', label: 'Dashboard' }, { href: '/generate', label: 'Create Roadmap' }]
    : [...baseLinks, { href: '/#examples', label: 'Examples' }, { href: '/generate', label: 'Get Started' }]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper-50/80 backdrop-blur-md border-b border-paper-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-accent" />
            <span className="font-serif font-bold text-xl text-ink-900">RoadmapAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ink-500 hover:text-ink-900 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-paper-100 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-ink-700 hidden sm:inline-block max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-paper-200 shadow-lg py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-paper-150">
                        <p className="text-xs text-ink-400">Signed in as</p>
                        <p className="text-sm font-semibold text-ink-800 truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-600 hover:bg-paper-50 hover:text-ink-900 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors border-t border-paper-150 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/generate">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-ink-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-paper-50 border-t border-paper-200"
          >
            <div className="px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-ink-500 hover:text-ink-900 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-paper-200">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 py-2 px-1">
                      <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-ink-800 text-sm">{user.name}</div>
                        <div className="text-xs text-ink-400">{user.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full text-center py-2 text-sm text-error bg-error/5 hover:bg-error/10 transition-colors rounded-lg font-medium"
                    >
                      <LogOut className="w-4.5 h-4.5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="secondary" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/generate" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

