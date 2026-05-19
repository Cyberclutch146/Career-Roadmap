'use client'

import { motion } from 'framer-motion'
import { Brain, BookMarked, MessageSquare, Calendar, BarChart3, Download } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Dynamic Node Graph',
    description: "Your roadmap isn't linear. It's a living graph that adapts based on your assessment scores, learning speed, and changing industry standards.",
    span: 2,
    color: 'primary',
    hasChart: true,
  },
  {
    icon: BookMarked,
    title: 'Curated Resources',
    description: 'We index thousands of tutorials, docs, and courses, serving you only the highest-rated content for your specific current node.',
    span: 1,
    color: 'secondary',
  },
  {
    icon: BarChart3,
    title: 'Micro-Milestones',
    description: 'Large goals are broken down into achievable 30-minute tasks, leveraging psychological momentum to keep you engaged.',
    span: 1,
    color: 'primary',
  },
  {
    icon: MessageSquare,
    title: 'Never block alone',
    description: "When the AI detects you're struggling on a specific concept, it seamlessly connects you with mentors who have mastered that exact node.",
    span: 2,
    color: 'secondary',
    hasCTA: true,
  },
]

export function Features() {
  return (
    <section id="features" className="flex flex-col gap-stack-md pt-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto"
      >
        <h2 className="section-heading mb-4">
          Intelligence at every step
        </h2>
        <p className="font-body text-body-lg text-on-surface-variant">
          The architecture of your success, built on deep learning models that understand educational progression.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          const borderColor = feature.color === 'primary' ? 'hover:border-primary/50' : 'hover:border-secondary/50'
          const glowColor = feature.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
          const iconColor = feature.color === 'primary' ? 'text-primary' : 'text-secondary'
          
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={feature.span === 2 ? 'md:col-span-2' : ''}
            >
              <div className={`glass-card p-8 flex flex-col ${feature.hasCTA ? 'md:flex-row md:items-center' : ''} justify-between relative overflow-hidden group ${borderColor} transition-colors duration-500 h-full`}>
                {/* Ambient glow */}
                <div className={`absolute ${feature.span === 2 && !feature.hasCTA ? 'top-0 right-0 -mr-20 -mt-20' : feature.hasCTA ? 'bottom-0 left-0' : 'bottom-0 right-0'} w-40 h-40 md:w-64 md:h-64 ${glowColor} rounded-full blur-[60px] md:blur-[80px] pointer-events-none`} />

                <div className={feature.hasCTA ? 'max-w-md' : ''}>
                  {feature.hasCTA ? (
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                      <span className="font-label text-label-md text-secondary tracking-widest uppercase">Community & Mentorship</span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center mb-6 shadow-inner">
                      <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                  )}

                  <h3 className="font-headline text-headline-md text-on-surface mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-body text-body-md text-on-surface-variant max-w-md">
                    {feature.description}
                  </p>
                </div>

                {/* Faux chart for the first large card */}
                {feature.hasChart && (
                  <div className="mt-8 h-32 border border-outline-variant/20 rounded-lg bg-surface/30 flex items-end px-4 gap-2 pb-2 relative">
                    <div className="w-full h-[40%] bg-gradient-to-t from-primary/40 to-transparent rounded-t-sm relative group-hover:h-[60%] transition-all duration-700 ease-out">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
                    </div>
                    <div className="w-full h-[70%] bg-gradient-to-t from-secondary/40 to-transparent rounded-t-sm relative group-hover:h-[85%] transition-all duration-700 delay-75 ease-out">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary" />
                    </div>
                    <div className="w-full h-[50%] bg-gradient-to-t from-primary/40 to-transparent rounded-t-sm relative group-hover:h-[70%] transition-all duration-700 delay-150 ease-out">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
                    </div>
                  </div>
                )}

                {/* CTA button for the mentorship card */}
                {feature.hasCTA && (
                  <div className="mt-6 md:mt-0 flex-shrink-0">
                    <button className="px-6 py-3 rounded-full border border-white/20 text-on-surface font-label text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-2 backdrop-blur-md">
                      Find a Mentor
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
