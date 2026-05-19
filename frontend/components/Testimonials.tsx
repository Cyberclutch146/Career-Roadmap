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
    <section className="py-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="section-heading mb-4">
            Loved by Learners Everywhere
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant">
            Join thousands of learners who have achieved their goals with RoadmapAI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-gutter">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 border border-outline-variant/20 hover:border-primary/30 transition-all duration-300 relative group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Quote className="w-8 h-8 text-primary/10 mb-4" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                ))}
              </div>
              <p className="font-body text-body-md text-on-surface-variant leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-sm font-label font-bold text-primary">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="font-headline font-semibold text-on-surface text-base">{testimonial.author}</div>
                  <div className="font-body text-sm text-on-surface-variant">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
