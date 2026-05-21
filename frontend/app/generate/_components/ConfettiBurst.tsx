'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfettiBurstProps {
  trigger: boolean
  onComplete?: () => void
}

export function ConfettiBurst({ trigger, onComplete }: ConfettiBurstProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; rotation: number }[]>([])

  useEffect(() => {
    if (trigger) {
      const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6']
      const newParticles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 400, // spread
        y: (Math.random() - 1.0) * 400, // height
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        setParticles([])
        if (onComplete) onComplete()
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [trigger, onComplete])

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: 0,
              scale: Math.random() + 0.5,
              x: p.x,
              y: p.y,
              rotate: p.rotation + 360,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 + Math.random(), ease: 'easeOut' }}
            className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full"
            style={{ backgroundColor: p.color }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
