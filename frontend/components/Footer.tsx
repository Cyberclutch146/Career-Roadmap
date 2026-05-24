'use client'

import Link from 'next/link'
import { Github, Twitter } from 'lucide-react'

export function Footer() {
  const footerLinks = {
    product: [
      { href: '#features', label: 'Features' },
      { href: '#how-it-works', label: 'How It Works' },
      { href: '/gallery', label: 'Gallery' },
    ],
    company: [
      { href: '#about', label: 'About' },
      { href: '#blog', label: 'Blog' },
      { href: '#careers', label: 'Careers' },
    ],
    legal: [
      { href: '#privacy', label: 'Privacy' },
      { href: '#terms', label: 'Terms' },
    ],
  }

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="font-headline font-bold text-lg text-white">
                Roadmap<span className="text-amber-400 font-serif italic">AI</span>
              </span>
            </Link>
            <p className="font-body text-sm text-zinc-500">
              Transform your learning goals into structured, achievable roadmaps.
            </p>
          </div>

          <div>
            <h4 className="font-label font-semibold text-zinc-300 mb-4 text-xs tracking-widest uppercase">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-sm text-zinc-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-label font-semibold text-zinc-300 mb-4 text-xs tracking-widest uppercase">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-sm text-zinc-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-label font-semibold text-zinc-300 mb-4 text-xs tracking-widest uppercase">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-sm text-zinc-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} RoadmapAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/blaze/career-roadmap" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-900">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://twitter.com/RoadmapAI" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-900">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
