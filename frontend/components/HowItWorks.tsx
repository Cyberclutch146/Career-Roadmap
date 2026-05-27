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
    <section id="how-it-works" className="relative min-h-0 w-full flex flex-col justify-center py-16 md:py-28 overflow-hidden">
      {/* Subtle ambient glows in background */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-orange-500/[0.01] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-[300px] h-[300px] bg-amber-500/[0.015] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Sticky Title Block */}
          <div className="lg:col-span-5 flex flex-col justify-start lg:sticky lg:top-28 h-fit">
            <span className="font-label text-xs font-semibold text-amber-500 tracking-widest uppercase mb-3 block">
              The Process
            </span>
            <h2 className="font-headline text-3xl md:text-5xl text-on-surface font-bold leading-tight mb-4">
              How it <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">works.</span>
            </h2>
            <p className="font-body text-on-surface-variant text-base md:text-lg leading-relaxed max-w-lg">
              From ambition to achievement in four simple steps. We take the complexity out of learning, creating a fully personalized, guided curriculum designed for your success.
            </p>
          </div>

          {/* Right Column: Vertical Timeline Steps */}
          <div className="lg:col-span-7 flex flex-col gap-6 relative">
            {/* Visual timeline line connecting the numbers */}
            <div className="absolute left-[44px] md:left-[64px] top-10 bottom-10 w-[1px] bg-zinc-800/80 pointer-events-none" />

            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="flex items-start gap-4 md:gap-8 rounded-2xl border border-transparent hover:border-zinc-800/60 hover:bg-zinc-900/30 p-4 md:p-6 transition-all duration-300">
                    
                    {/* Step Number Badge */}
                    <div className="relative flex-shrink-0 z-10">
                      <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl bg-zinc-950/90 border border-zinc-800/80 flex items-center justify-center group-hover:border-amber-500/30 transition-all duration-300 shadow-lg">
                        <span className="text-xl md:text-3xl font-serif italic font-bold text-zinc-650 group-hover:text-amber-400 transition-colors">
                          {step.number}
                        </span>
                      </div>
                      
                      {/* Floating Mini Icon Badge */}
                      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-surface-container border border-outline flex items-center justify-center text-on-surface-variant group-hover:border-amber-500/30 group-hover:text-amber-400 transition-all duration-300 shadow-md">
                        <Icon className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pt-1 md:pt-1.5">
                      <h3 className="text-base md:text-xl font-headline font-semibold text-on-surface mb-2 group-hover:text-amber-400 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="font-body text-on-surface-variant text-sm md:text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                  </div>
                </motion.div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
