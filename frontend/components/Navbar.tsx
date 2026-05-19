'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react'
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
    { href: '/#features', label: 'Explore' },
    { href: '/gallery', label: 'Gallery' },
  ]

  const navLinks = user
    ? [...baseLinks, { href: '/dashboard', label: 'My Library' }, { href: '/generate', label: 'Create' }]
    : [...baseLinks, { href: '/#how-it-works', label: 'How It Works' }, { href: '/generate', label: 'Get Started' }]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/60 backdrop-blur-xl border-b border-surface-variant/20 shadow-lg shadow-primary/5">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-stack-md">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-headline text-headline-md font-bold text-primary tracking-tight">RoadmapAI</span>
            </Link>

            <div className="hidden md:flex items-center gap-gutter">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-label text-label-md transition-colors duration-200 rounded-sm px-2 py-1 ${
                    i === 0
                      ? 'text-primary border-b-2 border-primary pb-1 hover:bg-surface-container/50'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-gutter">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-surface-container/50 transition-colors focus:outline-none active:scale-95"
                >
                  <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden shadow-inner flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-label font-medium text-on-surface-variant hidden sm:inline-block max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-52 glass-card rounded-xl shadow-lg py-2 z-50"
                    >
                      <div className="px-4 py-2.5 border-b border-outline-variant/30">
                        <p className="text-xs text-on-surface-variant font-label">Signed in as</p>
                        <p className="text-sm font-semibold text-on-surface truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container/60 hover:text-on-surface transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error-container/10 transition-colors border-t border-outline-variant/30 mt-1"
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
            className="md:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container/50 active:scale-95"
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
            className="md:hidden bg-surface/90 backdrop-blur-xl border-t border-surface-variant/20"
          >
            <div className="px-margin-mobile py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-on-surface-variant hover:text-on-surface font-label font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-outline-variant/30">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 py-2 px-1">
                      <div className="w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center shadow-inner">
                        <span className="text-primary font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-on-surface text-sm">{user.name}</div>
                        <div className="text-xs text-on-surface-variant">{user.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full text-center py-2 text-sm text-error bg-error-container/10 hover:bg-error-container/20 transition-colors rounded-full font-label font-medium"
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
