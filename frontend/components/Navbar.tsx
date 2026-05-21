'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react'
import { Button } from './ui/Button'
import { useStore } from '@/store'
import { useRouter, usePathname } from 'next/navigation'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
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

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    setIsMenuOpen(false)
    router.push('/')
  }

  const baseLinks = [
    { href: '/#features', label: 'Explore' },
    { href: '/gallery', label: 'Gallery' },
  ]

  const navLinks = user
    ? [...baseLinks, { href: '/dashboard', label: 'My Library' }, { href: '/generate', label: 'Create' }]
    : [...baseLinks, { href: '/#how-it-works', label: 'How It Works' }, { href: '/generate', label: 'Get Started' }]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-2xl border-b border-zinc-800/50 shadow-sm">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-stack-md">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif italic text-2xl font-bold tracking-tight text-white">
                Roadmap<span className="text-amber-500 font-sans not-italic">AI</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 ml-0.5"></span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              {navLinks.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-label text-label-md transition-all duration-200 rounded-full px-3.5 py-1.5 ${
                      isActive
                        ? 'text-amber-500 bg-zinc-800/50'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-800/50 transition-colors focus:outline-none active:scale-95"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden shadow-inner flex items-center justify-center">
                    <span className="text-amber-500 font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-label font-medium text-zinc-400 hidden sm:inline-block max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-52 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl py-2 z-50"
                    >
                      <div className="px-4 py-2.5 border-b border-zinc-800">
                        <p className="text-xs text-zinc-500 font-label">Signed in as</p>
                        <p className="text-sm font-semibold text-zinc-200 truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-500" />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors border-t border-zinc-800/50 mt-1"
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
            className="md:hidden bg-[#0a0a0b]/95 backdrop-blur-2xl border-t border-zinc-800/50"
          >
            <div className="px-margin-mobile py-4 space-y-4">
              {navLinks.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block font-label font-medium py-2 transition-colors ${
                      isActive ? 'text-amber-500' : 'text-zinc-400 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800/50">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 py-2 px-1">
                      <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
                        <span className="text-amber-500 font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-200 text-sm">{user.name}</div>
                        <div className="text-xs text-zinc-500">{user.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full text-center py-2 text-sm text-red-400 bg-red-950/10 hover:bg-red-950/20 transition-colors rounded-full font-label font-medium"
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
