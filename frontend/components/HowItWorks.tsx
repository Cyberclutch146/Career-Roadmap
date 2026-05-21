'use client'

import { motion } from 'framer-motion'
import { FileText, Sparkles, BookOpen, Trophy } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Describe Your Goal',
    description: "Tell us what you want to learn — whether it's becoming a full-stack developer, mastering DSA, or cracking GATE CSE.",
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Generates Your Roadmap',
    description: 'Our AI analyzes your inputs and creates a comprehensive, phased learning path with chapters, lessons, and resources.',
  },
  {
    number: '03',
    icon: BookOpen,
    title: 'Learn & Track Progress',
    description: 'Follow your personalized chapters, complete lessons, and track your progress through the interactive dashboard.',
  },
  {
    number: '04',
    icon: Trophy,
    title: 'Achieve Your Goal',
    description: 'Reach mastery with revision strategies, interview prep, and final assessments to validate your skills.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative min-h-0 md:min-h-[100dvh] w-full flex flex-col justify-center border-b border-white/5 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-16"
        >
          <h2 className="font-headline text-2xl md:text-5xl text-white font-bold leading-tight mb-3 md:mb-4">
            How it <span className="font-serif italic text-amber-400 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">works.</span>
          </h2>
          <p className="font-body text-zinc-400 text-base md:text-lg max-w-xl mx-auto">
            From ambition to achievement in four simple steps
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-[1px] bg-gradient-to-r from-amber-500/20 to-transparent -translate-x-1/2" />
              )}
              <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 relative group hover:border-amber-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.03)] h-full">
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.02] rounded-full blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute -top-3 -left-3 w-8 h-8 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center text-amber-500 group-hover:border-amber-500/30 transition-colors duration-300">
                  <step.icon className="w-4 h-4" />
                </div>
                <div className="pt-4">
                  <span className="text-5xl font-serif italic font-bold text-zinc-800/60 group-hover:text-amber-500/20 transition-colors">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-headline font-semibold text-white mt-2 mb-3">
                    {step.title}
                  </h3>
                  <p className="font-body text-zinc-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Vertical Timeline (Beautiful, responsive, fits 100% device width perfectly) */}
        <div className="md:hidden relative flex flex-col gap-6 pl-6 w-full max-w-full">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[11px] top-2 bottom-6 w-[2px] bg-gradient-to-b from-amber-500/30 via-orange-500/20 to-transparent pointer-events-none" />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={`mobile-${step.number}`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative flex flex-col w-full"
              >
                {/* Step Marker Dot / Icon */}
                <div className="absolute -left-[23px] top-1.5 w-6 h-6 rounded-full bg-zinc-950 border-2 border-amber-500 flex items-center justify-center text-amber-400 z-10 shadow-md">
                  <Icon className="w-2.5 h-2.5" />
                </div>

                <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 relative w-full">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-base font-headline font-semibold text-zinc-100">
                      {step.title}
                    </h3>
                    <span className="text-2xl font-serif italic font-bold text-zinc-800/80">
                      {step.number}
                    </span>
                  </div>
                  <p className="font-body text-zinc-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
