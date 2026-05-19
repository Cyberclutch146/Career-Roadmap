'use client'

import { motion } from 'framer-motion'
import { FileText, Sparkles, BookOpen, Trophy } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Describe Your Goal',
    description: 'Tell us what you want to learn — whether it\'s becoming a full-stack developer, mastering DSA, or cracking GATE CSE.',
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
    <section id="how-it-works" className="py-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <h2 className="section-heading mb-4">
          How It Works
        </h2>
        <p className="font-body text-body-lg text-on-surface-variant">
          From ambition to achievement in four simple steps
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-gutter">
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
              <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-outline-variant/50 to-transparent -translate-x-1/2" />
            )}
            <div className="glass-card p-6 relative group hover:border-primary/30 transition-colors duration-500">
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/3 rounded-full blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary group-hover:text-secondary transition-colors duration-300">
                <step.icon className="w-4 h-4" />
              </div>
              <div className="pt-4">
                <span className="text-4xl font-headline font-bold text-outline-variant/40">
                  {step.number}
                </span>
                <h3 className="text-xl font-headline font-bold text-on-surface mt-2 mb-3">
                  {step.title}
                </h3>
                <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
