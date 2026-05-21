'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden blueprint-grid border-b border-white/5">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[350px] bg-primary/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-y-8 z-10 relative">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-headline text-headline-lg-mobile md:text-6xl text-on-surface leading-tight font-bold"
        >
          Master any skill with <br />
          <span className="font-serif italic text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">adaptive pathways.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-on-surface-variant text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          Input your career or learning goal, and our intelligence engine maps out the exact steps, 
          curated resources, and milestones needed to get there. Stop guessing, start learning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative w-full max-w-2xl mt-4"
        >
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-on-surface-variant/50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <Link href="/generate">
            <input
              readOnly
              className="w-full bg-surface-container/80 backdrop-blur-md border border-outline-variant rounded-full py-5 pl-14 pr-40 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-body text-lg placeholder:text-on-surface-variant/40 shadow-xl cursor-pointer hover:border-outline"
              placeholder="I want to learn machine learning in 3 months..."
            />
          </Link>
          <Link href="/generate" className="absolute right-2.5 top-2.5 bottom-2.5">
            <button className="h-full bg-primary hover:bg-primary/90 text-on-primary px-8 rounded-full font-label text-sm font-semibold transition-all active:scale-95 shadow-glow hover:shadow-glow-hover">
              Generate Path
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
