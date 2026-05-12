'use client'

import { motion } from 'framer-motion'
import { BookOpen, Sparkles, Clock, Target, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/Button'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-paper-100 to-paper-50" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-light/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Learning
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-ink-900 leading-tight mb-6"
          >
            Your Personal Learning Journey,{' '}
            <span className="text-accent">Structured & Guided</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-ink-500 mb-8 leading-relaxed"
          >
            Transform ambitious goals into achievable roadmaps. Get personalized
            learning paths, curated resources, and AI mentorship tailored to your
            schedule and learning style.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/generate">
              <Button size="lg" className="group">
                Create Your Roadmap
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#examples">
              <Button variant="secondary" size="lg">
                View Examples
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-ink-300"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>5 min setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Personalized paths</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Expert curated</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-paper-50 to-transparent z-10 pointer-events-none h-20 bottom-0 top-auto" />
          <div className="bg-white rounded-2xl border border-paper-300 shadow-lifted p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-error/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-paper-50 rounded-lg">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-ink-900/10 rounded w-1/3 mb-2" />
                  <div className="h-2 bg-paper-200 rounded w-2/3" />
                </div>
                <div className="text-success text-sm font-medium">85%</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['Phase 1', 'Phase 2', 'Phase 3'].map((phase, i) => (
                  <div key={phase} className="p-4 bg-paper-50 rounded-lg">
                    <div className="h-2 bg-accent/20 rounded w-3/4 mb-2" />
                    <div className="h-2 bg-paper-200 rounded w-1/2 mb-2" />
                    <div className="h-2 bg-paper-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
