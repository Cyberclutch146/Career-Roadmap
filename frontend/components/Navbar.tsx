'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Search, X, Sun, Moon, User, LogOut, Info, ChevronDown } from 'lucide-react'
import { useStore } from '@/store'
import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

// Helper to get initials or fallback avatar
function getUserAvatar(name?: string) {
  if (!name) return 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'
  return `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=0a0a0b&textColor=d97706`
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useStore()
  
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus()
  }, [searchOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Handle search later if needed, currently mocked
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > 20 && !scrolled) {
        setScrolled(true)
      } else if (currentScrollY < 10 && scrolled) {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])

  const baseLinks = [
    { label: 'Explore', path: '/#features' },
    { label: 'Gallery', path: '/gallery' },
  ]

  const navLinks = user
    ? [...baseLinks, { label: 'My Library', path: '/dashboard', exact: true }, { label: 'Create', path: '/generate' }]
    : [...baseLinks, { label: 'How It Works', path: '/#how-it-works' }, { label: 'Get Started', path: '/generate' }]

  const isLinkActive = (link: typeof navLinks[0]) => {
    if (link.exact) return pathname === link.path
    if (link.path === '/') return pathname === '/'
    if (link.path.startsWith('/#')) return false // Can't easily match hash on SSR
    return pathname?.startsWith(link.path)
  }

  // Define theme variables directly to match the provided layout visually
  const themeVars = {
    glassBg: 'rgba(10, 10, 11, 0.65)',
    glassBgStrong: 'rgba(10, 10, 11, 0.95)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    glassShadowLg: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
    primaryBase: '#d97706', // amber-600
    moss: '#92400e', // amber-800
    surfaceBase: '#0a0a0b', // zinc-950
    surfaceBrightBase: '#18181b', // zinc-900
    surfaceContainerHighBase: '#27272a', // zinc-800
    errorBase: '#ef4444', // red-500
    onSurfaceVariant: '#a1a1aa' // zinc-400
  }

  return (
    <div
      className={`fixed inset-x-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? 'top-3 mx-4 rounded-[24px] lg:inset-x-auto lg:left-1/2 lg:mx-0 lg:w-[min(calc(100vw-2rem),1200px)] lg:-translate-x-1/2'
          : 'top-0 lg:inset-x-auto lg:left-1/2 lg:w-full lg:-translate-x-1/2'
      }`}
      style={{
        background: scrolled ? themeVars.glassBg : themeVars.glassBgStrong,
        backdropFilter: scrolled ? 'blur(28px) saturate(1.6)' : 'blur(20px) saturate(1.3)',
        WebkitBackdropFilter: scrolled ? 'blur(28px) saturate(1.6)' : 'blur(20px) saturate(1.3)',
        border: scrolled ? `1px solid ${themeVars.glassBorder}` : '1px solid transparent',
        borderBottom: `1px solid ${themeVars.glassBorder}`,
        boxShadow: scrolled ? themeVars.glassShadowLg : '0 1px 3px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div className={`mx-auto flex items-center justify-between max-w-7xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled ? 'px-5 py-2' : 'px-10 py-3.5'
      }`}>
        {/* Logo */}
        <button
          onClick={() => router.push('/')}
          className={`flex items-center transition-all duration-300 hover:opacity-80`}
        >
          <span className={`font-serif italic font-bold tracking-tight text-white ${scrolled ? 'text-xl' : 'text-2xl'}`}>
            Roadmap<span className="text-amber-500 font-sans not-italic">AI</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 ml-0.5"></span>
          </span>
        </button>

        {/* Nav Links */}
        <div className={`hidden md:flex items-center ${scrolled ? 'gap-1' : 'gap-1.5'}`}>
          {navLinks.map((link) => {
            const active = isLinkActive(link)
            return (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-out ${
                  active
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                }`}
                style={active ? {
                  background: `linear-gradient(135deg, ${themeVars.primaryBase} 0%, ${themeVars.moss} 100%)`,
                  boxShadow: `0 2px 8px rgba(217, 119, 6, 0.25)`,
                } : undefined}
              >
                {link.label}
              </button>
            )
          })}
        </div>

        {/* Right Section */}
        <div className={`flex items-center ${scrolled ? 'gap-2' : 'gap-3'} text-white`}>
          {searchOpen ? (
            <div
              className="flex items-center gap-2 rounded-full px-3.5 py-2 animate-in fade-in duration-200 hidden sm:flex"
              style={{
                background: themeVars.glassBg,
                backdropFilter: 'blur(16px)',
                border: `1px solid ${themeVars.glassBorder}`,
                boxShadow: '0 2px 12px rgba(217, 119, 6, 0.08)',
              }}
            >
              <Search size={15} className="text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-transparent outline-none text-sm w-44 text-white placeholder:text-zinc-500"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery('') }} className="hover:scale-110 active:scale-95 transition-all p-0.5 rounded-full hover:bg-zinc-800/50">
                <X size={14} className="text-zinc-400" />
              </button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="hidden sm:block p-2 rounded-full hover:bg-zinc-800/50 transition-all duration-200 active:scale-95">
              <Search size={scrolled ? 16 : 17} />
            </button>
          )}

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={`${scrolled ? 'w-8 h-8' : 'w-9 h-9'} rounded-full overflow-hidden transition-all duration-300 ease-out ring-2 ring-transparent hover:ring-amber-500/40 focus:ring-amber-500/40 flex items-center justify-center`}
                style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' }}
              >
                {profileMenuOpen ? (
                  <ChevronDown size={scrolled ? 18 : 20} className="text-white" />
                ) : (
                  <img
                    src={getUserAvatar(user.name)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 mt-3 w-[17.5rem] overflow-hidden rounded-[28px] z-50 origin-top-right"
                  style={{
                    background: themeVars.surfaceBase,
                    border: `1px solid ${themeVars.glassBorder}`,
                    boxShadow: themeVars.glassShadowLg,
                  }}
                >
                  <div className="relative z-10 p-3">
                    <div
                      className="overflow-hidden rounded-[22px] p-4"
                      style={{
                        background: `linear-gradient(135deg, rgba(217,119,6,0.16), rgba(139,109,46,0.1) 55%, color-mix(in srgb, ${themeVars.surfaceBase} 92%, transparent) 100%)`,
                        border: `1px solid ${themeVars.glassBorder}`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl"
                          style={{ boxShadow: '0 6px 18px rgba(0,0,0,0.3)', border: `1px solid ${themeVars.glassBorder}` }}
                        >
                          <img
                            src={getUserAvatar(user.name)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">Signed in</p>
                          <p className="mt-1 text-base font-semibold text-white truncate">{user.name}</p>
                          <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div
                        className="col-span-2 rounded-[20px] px-4 py-3"
                        style={{
                          background: `color-mix(in srgb, ${themeVars.primaryBase} 10%, ${themeVars.surfaceContainerHighBase} 90%)`,
                          border: `1px solid color-mix(in srgb, ${themeVars.primaryBase} 18%, ${themeVars.glassBorder} 82%)`,
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-white">Theme</span>
                          <div
                            className="relative grid w-36 grid-cols-2 rounded-full p-1 cursor-not-allowed opacity-70"
                            style={{ background: `color-mix(in srgb, ${themeVars.surfaceBrightBase} 76%, transparent)`, border: `1px solid ${themeVars.glassBorder}` }}
                            title="Light mode coming soon"
                          >
                            <motion.span
                              className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full"
                              animate={{ x: 'calc(100% + 0.25rem)' }}
                              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                              style={{ left: '0.25rem', background: `linear-gradient(135deg, ${themeVars.primaryBase}, ${themeVars.moss})`, boxShadow: '0 2px 8px rgba(217,119,6,0.22)' }}
                            />
                            <button
                              type="button"
                              disabled
                              className={`relative z-10 flex items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] font-bold transition-colors text-zinc-400`}
                            >
                              <Sun size={13} />
                              Light
                            </button>
                            <button
                              type="button"
                              disabled
                              className={`relative z-10 flex items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] font-bold transition-colors text-white`}
                            >
                              <Moon size={13} />
                              Dark
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => { setProfileMenuOpen(false); router.push('/dashboard'); }}
                        className="rounded-[20px] px-3.5 py-3 text-left transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          background: `color-mix(in srgb, ${themeVars.surfaceContainerHighBase} 84%, transparent)`,
                          border: `1px solid ${themeVars.glassBorder}`,
                        }}
                      >
                        <User size={17} className="text-zinc-400 mb-3" />
                        <p className="text-sm font-semibold text-white">Library</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Your roadmaps</p>
                      </button>

                      <button
                        onClick={() => { setProfileMenuOpen(false); router.push('/#how-it-works'); }}
                        className="rounded-[20px] px-3.5 py-3 text-left transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          background: `color-mix(in srgb, ${themeVars.surfaceContainerHighBase} 84%, transparent)`,
                          border: `1px solid ${themeVars.glassBorder}`,
                        }}
                      >
                        <Info size={17} className="text-zinc-400 mb-3" />
                        <p className="text-sm font-semibold text-white">About</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">How it works</p>
                      </button>
                    </div>

                    <div className="my-3 mx-1" style={{ height: '1px', background: themeVars.glassBorder }} />

                    <button
                      onClick={async () => {
                        setProfileMenuOpen(false);
                        logout();
                        router.push('/');
                      }}
                      className="w-full rounded-[20px] px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: `color-mix(in srgb, ${themeVars.errorBase} 10%, ${themeVars.surfaceContainerHighBase} 90%)`,
                        border: `1px solid color-mix(in srgb, ${themeVars.errorBase} 18%, ${themeVars.glassBorder} 82%)`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-xl"
                          style={{ background: `color-mix(in srgb, ${themeVars.surfaceBrightBase} 82%, transparent)`, border: `1px solid color-mix(in srgb, ${themeVars.errorBase} 15%, ${themeVars.glassBorder} 85%)` }}
                        >
                          <LogOut size={17} className="text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-red-500">Log Out</p>
                          <p className="text-[11px] text-zinc-400">End this session</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden sm:block text-sm font-medium text-zinc-300 hover:text-white px-3 py-1.5 transition-colors">
                Sign In
              </Link>
              <Link 
                href="/generate" 
                className="text-sm font-medium text-white px-4 py-1.5 rounded-full transition-all hover:opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${themeVars.primaryBase} 0%, ${themeVars.moss} 100%)`,
                  boxShadow: `0 2px 8px rgba(217, 119, 6, 0.25)`,
                }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
