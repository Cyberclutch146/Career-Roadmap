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
    <section id="features" className="relative py-24 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
        <h2 className="font-headline text-3xl md:text-5xl text-white font-bold leading-tight mb-4">
          Intelligence at <span className="font-serif italic text-amber-400 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">every step.</span>
        </h2>
        <p className="font-body text-zinc-400 text-lg max-w-xl mx-auto">
          The architecture of your success, built on deep learning models that understand educational progression.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          const borderColor = feature.color === 'primary' ? 'hover:border-amber-500/30' : 'hover:border-orange-500/30'
          const glowColor = feature.color === 'primary' ? 'bg-amber-500/5' : 'bg-orange-500/5'
          const iconColor = feature.color === 'primary' ? 'text-amber-400' : 'text-orange-400'
          
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={feature.span === 2 ? 'md:col-span-2' : ''}
            >
              <div className={`rounded-2xl bg-zinc-900/60 border border-zinc-800 p-8 flex flex-col ${feature.hasCTA ? 'md:flex-row md:items-center' : ''} justify-between relative overflow-hidden group ${borderColor} transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.05)] h-full`}>
                {/* Ambient glow */}
                <div className={`absolute ${feature.span === 2 && !feature.hasCTA ? 'top-0 right-0 -mr-20 -mt-20' : feature.hasCTA ? 'bottom-0 left-0' : 'bottom-0 right-0'} w-40 h-40 md:w-64 md:h-64 ${glowColor} rounded-full blur-[60px] md:blur-[80px] pointer-events-none`} />

                <div className={feature.hasCTA ? 'max-w-md' : ''}>
                  {feature.hasCTA ? (
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                      <span className="font-label text-xs font-semibold text-orange-400 tracking-widest uppercase">Community & Mentorship</span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 shadow-inner group-hover:border-amber-500/30 transition-colors">
                      <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                  )}

                  <h3 className="font-headline text-2xl text-white font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-body text-zinc-400 text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Faux chart for the first large card */}
                {feature.hasChart && (
                  <div className="mt-8 h-32 border border-zinc-800/50 rounded-xl bg-zinc-950/40 flex items-end px-6 gap-3 pb-3 relative overflow-hidden">
                    <div className="w-full h-[40%] bg-gradient-to-t from-amber-500/20 to-transparent rounded-t-lg relative group-hover:h-[60%] transition-all duration-700 ease-out">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-amber-500" />
                    </div>
                    <div className="w-full h-[70%] bg-gradient-to-t from-orange-500/20 to-transparent rounded-t-lg relative group-hover:h-[85%] transition-all duration-700 delay-75 ease-out">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-500" />
                    </div>
                    <div className="w-full h-[50%] bg-gradient-to-t from-amber-500/20 to-transparent rounded-t-lg relative group-hover:h-[70%] transition-all duration-700 delay-150 ease-out">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-amber-500" />
                    </div>
                  </div>
                )}

                {/* CTA button for the mentorship card */}
                {feature.hasCTA && (
                  <div className="mt-6 md:mt-0 flex-shrink-0">
                    <button className="px-6 py-3 rounded-full border border-zinc-800 text-zinc-300 font-label text-sm hover:bg-zinc-800 hover:text-white transition-all flex items-center gap-2 backdrop-blur-md hover:border-amber-500/30">
                      Find a Mentor
                      <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
      </div>
    </section>
  )
}
