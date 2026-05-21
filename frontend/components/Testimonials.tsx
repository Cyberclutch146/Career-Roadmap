'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "RoadmapAI transformed how I approach learning. The structured path kept me accountable and the AI mentor helped when I got stuck. Landed my dream job as a React developer!",
    author: "Priya Sharma",
    role: "Full Stack Developer at Google",
    avatar: "PS",
    rating: 5,
  },
  {
    quote: "I was overwhelmed trying to learn DSA for placements. This roadmap broke it down perfectly and I could track my progress daily. Cleared GATE with a great rank.",
    author: "Rahul Verma",
    role: "M.Tech Student, IIT Delhi",
    avatar: "RV",
    rating: 5,
  },
  {
    quote: "The best part is how it adapts to your pace. When I missed days, it automatically adjusted my schedule. It feels like having a personal learning coach.",
    author: "Sarah Chen",
    role: "Self-Taught Developer",
    avatar: "SC",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="relative py-24 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-headline text-3xl md:text-5xl text-white font-bold leading-tight mb-4">
            Loved by <span className="font-serif italic text-amber-400 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">learners</span> everywhere.
          </h2>
          <p className="font-body text-zinc-400 text-lg max-w-xl mx-auto">
            Join thousands of learners who have achieved their goals with RoadmapAI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.03)] transition-all duration-300 relative group h-full flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.02] rounded-full blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div>
                <Quote className="w-8 h-8 text-amber-500/10 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="font-body text-zinc-400 text-sm leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <span className="text-sm font-label font-bold text-amber-400">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="font-headline font-semibold text-white text-base">{testimonial.author}</div>
                  <div className="font-body text-xs text-zinc-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
