'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Sparkles, LayoutDashboard, Compass, User } from 'lucide-react'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useStore()

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/generate', icon: Sparkles, label: 'Generate' },
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', requiresAuth: true },
    { href: '/gallery', icon: Compass, label: 'Gallery' },
    { href: '/profile', icon: User, label: 'Profile', requiresAuth: true },
  ]

  // Filter out links that require auth if the user is not logged in
  const visibleLinks = links.filter((link) => !link.requiresAuth || user)

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-t border-surface-variant/20 shadow-[0_-4px_12px_rgba(0,0,0,0.3)] pb-safe">
      <nav className="flex items-center justify-around h-16 px-2">
        {visibleLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/')
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] font-label font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
