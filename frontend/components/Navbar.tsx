'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Search, X, Sun, Moon, User, LogOut, Info, ChevronDown, Menu } from 'lucide-react'
import { useStore } from '@/store'
import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const baseLinks = [
    { label: 'Explore', path: '/#features' },
    { label: 'Gallery', path: '/gallery' },
  ]

  const navLinks = user
    ? [...baseLinks, { label: 'My Library', path: '/dashboard', exact: true }, { label: 'Create', path: '/generate' }]
    : [...baseLinks, { label: 'How It Works', path: '/#how-it-works' }, { label: 'Get Started', path: '/login' }]

  const isLinkActive = (link: typeof navLinks[0]) => {
    if ('exact' in link && link.exact) return pathname === link.path
    if (link.path === '/') return pathname === '/'
    if (link.path.startsWith('/#')) return false
    return pathname?.startsWith(link.path)
  }

  const themeVars = {
    glassBg: 'rgba(10, 10, 11, 0.65)',
    glassBgStrong: 'rgba(10, 10, 11, 0.95)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    glassShadowLg: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
    primaryBase: '#d97706',
    moss: '#92400e',
    surfaceBase: '#0a0a0b',
    surfaceBrightBase: '#18181b',
    surfaceContainerHighBase: '#27272a',
    errorBase: '#ef4444',
    onSurfaceVariant: '#a1a1aa'
  }

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30, staggerChildren: 0.07, delayChildren: 0.1 }
    },
    closed: {
      x: '100%',
      transition: { type: 'spring', stiffness: 300, damping: 30, staggerChildren: 0.05, staggerDirection: -1 }
    }
  }

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: 20 }
  }

  return (
    <>
      <div
        className="fixed top-3 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[min(calc(100vw-2rem),1200px)] z-50 rounded-[24px]"
        style={{
          background: themeVars.glassBg,
          backdropFilter: 'blur(28px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
          border: `1px solid ${themeVars.glassBorder}`,
          borderBottom: `1px solid ${themeVars.glassBorder}`,
          boxShadow: themeVars.glassShadowLg,
        }}
      >
        <div className="mx-auto flex items-center justify-between max-w-7xl px-5 py-2">
          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center transition-all duration-300 hover:opacity-80"
          >
            <span className="font-serif italic font-bold tracking-tight text-white text-xl">
              Roadmap<span className="text-amber-500 font-sans not-italic">AI</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 ml-0.5"></span>
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
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
          <div className="flex items-center gap-2 text-white">
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
                <Search size={16} />
              </button>
            )}

            {user ? (
              <div className="relative hidden md:block" ref={menuRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="w-8 h-8 rounded-full overflow-hidden transition-all duration-300 ease-out ring-2 ring-transparent hover:ring-amber-500/40 focus:ring-amber-500/40 flex items-center justify-center"
                  style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' }}
                >
                  {profileMenuOpen ? (
                    <ChevronDown size={18} className="text-white" />
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
                          try {
                            await signOut(auth);
                          } catch (e) {
                            console.error("Signout error", e);
                          }
                          logout();
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
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-1.5 transition-colors">
                  Sign In
                </Link>
                <Link 
                  href="/login" 
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-zinc-800/50 transition-all active:scale-95"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Staggered Mobile Side Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              ref={mobileMenuRef}
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-[280px] z-[70] p-6 shadow-2xl md:hidden overflow-y-auto"
              style={{
                background: themeVars.glassBgStrong,
                backdropFilter: 'blur(28px) saturate(1.6)',
                borderLeft: `1px solid ${themeVars.glassBorder}`,
              }}
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-zinc-800/50 text-white hover:bg-zinc-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {user && (
                <motion.div variants={itemVariants} className="mb-8 flex items-center gap-3 pb-6 border-b border-white/10">
                  <img src={getUserAvatar(user.name)} alt="Profile" className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                  <div>
                    <p className="text-white font-semibold text-lg">{user.name}</p>
                    <p className="text-zinc-400 text-sm truncate w-40">{user.email}</p>
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const active = isLinkActive(link)
                  return (
                    <motion.div key={link.path} variants={itemVariants}>
                      <Link
                        href={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block text-lg font-medium py-2 px-4 rounded-xl transition-colors ${
                          active ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {user ? (
                <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-white/10">
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      try { await signOut(auth); } catch (e) {}
                      logout();
                    }}
                    className="flex items-center gap-3 w-full p-4 rounded-xl text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                  >
                    <LogOut size={20} />
                    <span className="font-semibold text-lg">Log Out</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl text-black font-semibold transition-colors"
                    style={{ background: themeVars.primaryBase }}
                  >
                    Get Started
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
