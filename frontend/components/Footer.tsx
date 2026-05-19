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
    <footer className="border-t border-outline-variant/20 bg-surface/40 backdrop-blur-md">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="font-headline font-bold text-lg text-primary">RoadmapAI</span>
            </Link>
            <p className="font-body text-body-md text-on-surface-variant">
              Transform your learning goals into structured, achievable roadmaps.
            </p>
          </div>

          <div>
            <h4 className="font-label font-medium text-on-surface mb-4 text-sm tracking-wider uppercase">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-label font-medium text-on-surface mb-4 text-sm tracking-wider uppercase">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-label font-medium text-on-surface mb-4 text-sm tracking-wider uppercase">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-sm text-on-surface-variant">
            &copy; {new Date().getFullYear()} RoadmapAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-container/50">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-container/50">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
