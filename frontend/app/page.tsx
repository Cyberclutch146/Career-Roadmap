'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { HowItWorks } from '@/components/HowItWorks'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { useStore } from '@/store'

export default function Home() {
  const { user } = useStore()
  const targetHref = user ? '/dashboard' : '/login'
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />

      <section className="relative min-h-0 md:min-h-[100dvh] w-full flex flex-col justify-center py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-12 rounded-2xl md:rounded-3xl bg-gradient-to-br from-surface-container/60 to-background border border-outline-variant/10 relative overflow-hidden backdrop-blur-md"
          >
            {/* Ambient glow inside the card */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 md:w-80 h-60 md:h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-on-surface mb-3 md:mb-4 relative z-10">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-on-surface-variant text-sm md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of learners who have transformed their goals into achievements.
              Your personalized roadmap is just a few clicks away.
            </p>
            <div className="relative z-10 flex justify-center">
              <Link href={targetHref}>
                <Button
                  variant="primary"
                  size="lg"
                  className="group active:scale-95"
                >
                  Generate Your Roadmap
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div>
        <Footer />
      </div>
    </main>
  )
}
