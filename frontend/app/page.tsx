'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { HowItWorks } from '@/components/HowItWorks'
import { ExampleRoadmap } from '@/components/ExampleRoadmap'
import { Testimonials } from '@/components/Testimonials'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <ExampleRoadmap />
      <Testimonials />

      <section className="section-container">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-surface-container/60 to-background border border-outline-variant/10 relative overflow-hidden backdrop-blur-md"
          >
            {/* Ambient glow inside the card */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-on-surface mb-4 relative z-10">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-on-surface-variant text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of learners who have transformed their goals into achievements.
              Your personalized roadmap is just a few clicks away.
            </p>
            <div className="relative z-10 flex justify-center">
              <Link href="/generate">
                <Button
                  variant="primary"
                  size="lg"
                  className="group"
                >
                  Generate Your Roadmap
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
