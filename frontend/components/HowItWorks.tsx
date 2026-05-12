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
    <section id="how-it-works" className="py-20 bg-paper-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ink-900 mb-4">
            How It Works
          </h2>
          <p className="text-ink-500 text-lg">
            From ambition to achievement in four simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-paper-300 -translate-x-1/2" />
              )}
              <div className="bg-white rounded-xl border border-paper-300 p-6 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <step.icon className="w-4 h-4 text-white" />
                </div>
                <div className="pt-4">
                  <span className="text-4xl font-serif font-bold text-paper-300">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-ink-900 mt-2 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-ink-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
