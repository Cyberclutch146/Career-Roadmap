'use client'

import Link from 'next/link'
import { Github, Twitter } from 'lucide-react'
import { Logo } from '@/components/Logo'

export function Footer() {
  const footerLinks = {
    product: [
      { href: '/#features', label: 'Features' },
      { href: '/#how-it-works', label: 'How It Works' },
      { href: '/gallery', label: 'Gallery' },
    ],
  }

  return (
    <footer className="border-t border-zinc-800/80 bg-surface-container/40 backdrop-blur-md pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="md:max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-2 md:mb-4">
              <Logo className="text-lg" />
            </Link>
            <p className="font-body text-xs md:text-sm text-on-surface-variant">
              Transform your learning goals into structured, achievable roadmaps.
            </p>
          </div>

          <div className="hidden md:flex gap-12">
            <div>
              <h4 className="font-label font-semibold text-on-surface mb-4 text-xs tracking-widest uppercase">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-body text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 md:hidden">
            <Link href="#privacy" className="text-xs text-on-surface-variant hover:text-on-surface">Privacy</Link>
            <Link href="#terms" className="text-xs text-on-surface-variant hover:text-on-surface">Terms</Link>
          </div>
          <p className="font-body text-xs text-on-surface-variant">
            &copy; {new Date().getFullYear()} RoadmapAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/Cyberclutch146/Career-Roadmap" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-zinc-900" aria-label="GitHub">
              <Github className="w-4 h-4 md:w-5 md:h-5" />
            </a>
            <a href="https://twitter.com/RoadmapAI" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-zinc-900" aria-label="Twitter">
              <Twitter className="w-4 h-4 md:w-5 md:h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
