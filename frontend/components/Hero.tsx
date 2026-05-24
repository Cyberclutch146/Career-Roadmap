'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useStore } from '@/store'

export function Hero() {
  const { user } = useStore()
  const targetHref = user ? '/dashboard' : '/login'
  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col justify-center overflow-hidden blueprint-grid border-b border-outline-variant/50 pt-20">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[200px] md:h-[350px] bg-primary/[0.04] rounded-full blur-[100px] md:blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-5 md:px-6 text-center flex flex-col items-center gap-y-6 md:gap-y-8 z-10 relative">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-headline text-3xl leading-[1.15] md:text-6xl text-on-surface font-bold"
        >
          Master any skill with <br className="hidden sm:block" />
          <span className="font-serif italic text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">adaptive pathways.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-on-surface-variant text-base md:text-xl max-w-2xl leading-relaxed px-2"
        >
          Input your career or learning goal, and our intelligence engine maps out the exact steps, 
          curated resources, and milestones needed to get there.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative w-full max-w-2xl mt-2 md:mt-4"
        >
          {/* Desktop: Inline search bar with embedded button */}
          <div className="hidden sm:block relative">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-on-surface-variant/50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <Link href={targetHref}>
              <input
                readOnly
                className="w-full bg-surface-container/80 backdrop-blur-md border border-outline-variant rounded-full py-5 pl-14 pr-40 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-body text-lg placeholder:text-on-surface-variant/40 shadow-xl cursor-pointer hover:border-outline"
                placeholder="I want to learn machine learning in 3 months..."
              />
            </Link>
            <Link href={targetHref} className="absolute right-2.5 top-2.5 bottom-2.5">
              <button className="h-full bg-primary hover:bg-primary/90 text-on-primary px-8 rounded-full font-label text-sm font-semibold transition-all active:scale-95 shadow-glow hover:shadow-glow-hover">
                Generate Path
              </button>
            </Link>
            {user && (
              <div className="absolute -bottom-10 left-0 right-0 flex justify-center">
                <Link href="/dashboard" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors underline underline-offset-4">
                  Access Dashboard &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: Stacked layout — clean CTA button */}
          <div className="sm:hidden flex flex-col gap-3">
            <Link href={targetHref} className="block">
              <div className="bg-surface-container/80 backdrop-blur-md border border-outline-variant rounded-2xl py-4 px-5 text-on-surface-variant/40 font-body text-sm flex items-center gap-3 active:scale-[0.98] transition-transform">
                <svg className="w-5 h-5 text-on-surface-variant/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                I want to learn machine learning...
              </div>
            </Link>
            <Link href={targetHref} className="block">
              <button className="w-full bg-primary hover:bg-primary/90 text-on-primary py-4 rounded-2xl font-label text-sm font-semibold transition-all active:scale-95 shadow-glow">
                Generate Your Path
              </button>
            </Link>
            {user && (
              <Link href="/dashboard" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors text-center mt-2 underline underline-offset-4">
                Access Dashboard &rarr;
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
