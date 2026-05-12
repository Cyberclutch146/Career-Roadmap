'use client'

import Link from 'next/link'
import { BookOpen, Github, Twitter } from 'lucide-react'

export function Footer() {
  const footerLinks = {
    product: [
      { href: '#features', label: 'Features' },
      { href: '#how-it-works', label: 'How It Works' },
      { href: '#examples', label: 'Examples' },
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
    <footer className="bg-paper-100 border-t border-paper-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-accent" />
              <span className="font-serif font-bold text-lg text-ink-900">RoadmapAI</span>
            </Link>
            <p className="text-ink-500 text-sm">
              Transform your learning goals into structured, achievable roadmaps.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-ink-900 mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ink-500 hover:text-ink-900 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-ink-900 mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ink-500 hover:text-ink-900 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-ink-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ink-500 hover:text-ink-900 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-paper-300 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-ink-300 text-sm">
            &copy; {new Date().getFullYear()} RoadmapAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-ink-500 hover:text-ink-900">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-ink-500 hover:text-ink-900">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
