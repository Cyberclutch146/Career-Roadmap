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
    <section className="py-20 bg-paper-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ink-900 mb-4">
            Loved by Learners Everywhere
          </h2>
          <p className="text-ink-500 text-lg">
            Join thousands of learners who have achieved their goals with RoadmapAI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-paper-300 p-6 shadow-soft"
            >
              <Quote className="w-8 h-8 text-accent/20 mb-4" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                ))}
              </div>
              <p className="text-ink-700 leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-accent">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="font-medium text-ink-900">{testimonial.author}</div>
                  <div className="text-sm text-ink-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
