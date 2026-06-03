'use client'

import { motion } from 'framer-motion'
import { Brain, BookMarked, MessageSquare, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Dynamic Roadmaps',
    description: 'Your learning path adapts in real-time based on your progress, target goals, and changing industry standards.',
    glow: 'from-amber-500/10 to-transparent',
    iconColor: 'text-amber-400',
    borderColor: 'group-hover:border-amber-500/30',
  },
  {
    icon: BookMarked,
    title: 'Curated Resources',
    description: 'Get hand-picked documentation, courses, and guides specifically filtered for your active milestones.',
    glow: 'from-orange-500/10 to-transparent',
    iconColor: 'text-orange-400',
    borderColor: 'group-hover:border-orange-500/30',
  },
  {
    icon: BarChart3,
    title: 'Micro-Milestones',
    description: 'Stay motivated with small, actionable tasks that break down massive subjects into clear daily study habits.',
    glow: 'from-amber-500/10 to-transparent',
    iconColor: 'text-amber-400',
    borderColor: 'group-hover:border-amber-500/30',
  },
  {
    icon: MessageSquare,
    title: 'On-Demand Mentorship',
    description: 'Instantly connect with industry professionals who have mastered the exact concepts you are learning.',
    glow: 'from-orange-500/10 to-transparent',
    iconColor: 'text-orange-400',
    borderColor: 'group-hover:border-orange-500/30',
  },
]

export function Features() {
  return (
    <section id="features" className="relative min-h-0 w-full flex flex-col justify-center py-16 md:py-24">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-6 flex flex-col gap-8 md:gap-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-headline text-2xl md:text-4xl text-on-surface font-bold leading-tight mb-3 md:mb-4">
            Intelligence at <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">every step.</span>
          </h2>
          <p className="font-body text-on-surface-variant text-sm md:text-base max-w-xl mx-auto">
            The architecture of your success, built on deep learning models that understand educational progression.
          </p>
        </motion.div>

        {/* Features Linear Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative"
              >
                <div className={`h-full rounded-2xl bg-surface-container/40 backdrop-blur-md border border-zinc-800/80 p-6 md:p-8 flex flex-col items-start relative overflow-hidden group transition-all duration-300 ${feature.borderColor} hover:shadow-[0_8px_30px_rgba(245,158,11,0.03)]`}>
                  {/* Subtle dynamic glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                  {/* Icon Container */}
                  <div className="w-12 h-12 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-center mb-6 shadow-inner group-hover:border-amber-500/20 transition-colors relative z-10">
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>

                  {/* Text Content */}
                  <h3 className="font-headline text-lg md:text-xl text-on-surface font-semibold mb-3 relative z-10 group-hover:text-amber-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="font-body text-on-surface-variant text-sm leading-relaxed relative z-10">
                    {feature.description}
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
