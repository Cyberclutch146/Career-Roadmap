'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Target, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface StepGoalProps {
  goal: string
  setGoal: (goal: string) => void
  onNext: () => void
}

const goalSuggestions = [
  'Become a Full Stack Developer',
  'Learn DSA for Placements',
  'Become an AI Engineer',
  'Master React Development',
  'Learn Cybersecurity',
  'Crack GATE CSE',
  'Become a Data Scientist',
  'Master Python Programming',
]

export function StepGoal({ goal, setGoal, onNext }: StepGoalProps) {
  const [isRefining, setIsRefining] = useState(false)
  const [refinedGoal, setRefinedGoal] = useState<string | null>(null)

  const handleRefine = async () => {
    if (goal.length < 5) return
    setIsRefining(true)
    setTimeout(() => {
      setRefinedGoal(`Become a Senior ${goal} focusing on modern architectures and scalable systems.`)
      setIsRefining(false)
    }, 1500)
  }

  const applyRefined = () => {
    if (refinedGoal) {
      setGoal(refinedGoal)
      setRefinedGoal(null)
    }
  }

  const isValid = goal.trim().length >= 5

  return (
    <div className="space-y-5 md:space-y-8">
      <div className="text-center space-y-1.5 md:space-y-2 mb-4 md:mb-8">
        <h2 className="text-xl md:text-2xl font-headline font-bold text-zinc-100 flex items-center justify-center gap-2">
          <Target className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
          The Goal
        </h2>
        <p className="text-zinc-400 text-xs md:text-sm">What do you want to achieve?</p>
      </div>

      <div className="space-y-4">
        {/* Goal Input */}
        <div className="relative">
          <input
            type="text"
            value={goal}
            onChange={(e) => {
              setGoal(e.target.value)
              setRefinedGoal(null)
            }}
            placeholder="e.g. Become a Full Stack Developer..."
            className="w-full bg-zinc-900/50 border-b-2 border-zinc-800 px-0 py-3 md:py-4 text-lg md:text-2xl lg:text-3xl font-headline font-bold text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-amber-500 transition-colors"
            autoFocus
          />
        </div>

        {/* Refine with AI button — always visible on mobile when valid */}
        {goal.length >= 5 && !refinedGoal && (
          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefine}
              isLoading={isRefining}
              className="bg-zinc-800/80 hover:bg-zinc-700 text-xs px-3 py-1.5 border border-zinc-700/50"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
              Refine with AI
            </Button>
          </div>
        )}

        <AnimatePresence>
          {refinedGoal && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 md:mt-4 p-3 md:p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
                <div className="flex items-start gap-2.5 md:gap-3">
                  <div className="mt-0.5 bg-amber-500/20 p-1.5 rounded-lg flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-zinc-300 leading-relaxed mb-2.5 md:mb-3">
                      <strong className="text-zinc-100 font-semibold">AI Suggestion:</strong> {refinedGoal}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={applyRefined} className="text-xs py-1.5 h-auto bg-amber-500 text-black hover:bg-amber-400">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Apply
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setRefinedGoal(null)} className="text-xs py-1.5 h-auto text-zinc-400 hover:text-zinc-200">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-4 md:pt-6">
          <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2.5 md:mb-3">Popular Goals</p>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {goalSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setGoal(suggestion)}
                className="text-[11px] md:text-xs px-2.5 md:px-3 py-1.5 bg-zinc-900/50 border border-zinc-800/80 text-zinc-400 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700 active:scale-95 transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-5 md:pt-8 border-t border-zinc-800/50 flex justify-end">
        <Button onClick={onNext} disabled={!isValid} size="lg" className="w-full px-8 font-semibold">
          Continue
        </Button>
      </div>
    </div>
  )
}
