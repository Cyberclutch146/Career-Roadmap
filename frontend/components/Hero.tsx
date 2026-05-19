'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/Button'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          {/* Left: Text Content */}
          <div className="lg:col-span-7 flex flex-col gap-stack-md z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 w-fit">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-label text-label-md text-primary tracking-widest uppercase">AI-Powered Learning</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-headline text-headline-lg-mobile md:text-display-lg text-on-surface leading-tight"
            >
              Master any skill with <br />
              <span className="gradient-text">adaptive pathways.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-body text-body-lg text-on-surface-variant max-w-xl"
            >
              Input your end goal, and our intelligence engine maps out the exact steps, 
              resources, and milestones needed to get there. Stop guessing, start learning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative max-w-2xl mt-4"
            >
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <Link href="/generate">
                <input
                  readOnly
                  className="w-full bg-surface-container/60 backdrop-blur-xl border border-outline-variant rounded-full py-5 pl-14 pr-40 text-on-surface focus:outline-none focus:border-primary transition-colors font-body text-body-lg placeholder:text-on-surface-variant shadow-lg shadow-background/50 cursor-pointer"
                  placeholder="I want to become a full-stack developer..."
                />
              </Link>
              <Link href="/generate" className="absolute right-2 top-2 bottom-2">
                <button className="h-full bg-gradient-to-r from-primary to-secondary text-on-primary px-8 rounded-full font-label text-label-md transition-all shadow-glow hover:brightness-110 active:scale-95 glossy-btn-hover relative overflow-hidden">
                  Generate
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Right: Abstract Glass Element */}
          <div className="lg:col-span-5 relative hidden lg:block h-[500px] w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute inset-0 bg-gradient-to-br from-surface-container-high/40 to-background/10 rounded-2xl glass-card border border-white/10 scale-105 shadow-2xl overflow-hidden"
            >
              {/* Background texture */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-60" />

              {/* Faux UI Card - Completed Module */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute top-8 left-8 right-8 bg-surface/80 backdrop-blur-md rounded-xl p-4 border border-outline-variant/50 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-label text-label-md text-on-surface">React Fundamentals</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-secondary w-full h-full" />
                </div>
              </motion.div>

              {/* Faux UI Card - AI Mentor */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="absolute bottom-12 right-4 bg-surface-container-high/90 backdrop-blur-xl rounded-xl p-4 border border-outline/30 shadow-2xl w-64"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                    <svg className="w-5 h-5 text-on-secondary-container" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-label text-label-md text-on-surface">AI Mentor</p>
                    <p className="font-body text-body-md text-on-surface-variant text-sm">Path optimized.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
