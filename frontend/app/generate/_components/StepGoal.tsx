'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Target, Loader2, CheckCircle2 } from 'lucide-react'
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
    // Simulate AI delay for now. We can wire this up to an API later.
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
    <div className="space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-headline font-bold text-zinc-100 flex items-center justify-center gap-2">
          <Target className="w-6 h-6 text-amber-500" />
          The Goal
        </h2>
        <p className="text-zinc-400 text-sm">What do you want to achieve?</p>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <input
            type="text"
            value={goal}
            onChange={(e) => {
              setGoal(e.target.value)
              setRefinedGoal(null)
            }}
            placeholder="e.g. Become a Full Stack Developer..."
            className="w-full bg-zinc-900/50 border-b-2 border-zinc-800 px-0 py-4 text-2xl md:text-3xl font-headline font-bold text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-amber-500 transition-colors"
            autoFocus
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            {goal.length >= 5 && !refinedGoal && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefine}
                isLoading={isRefining}
                className="bg-zinc-800/80 hover:bg-zinc-700 text-xs px-3 py-1 border border-zinc-700/50"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                Refine with AI
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {refinedGoal && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-amber-500/20 p-1.5 rounded-lg">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-300 leading-relaxed mb-3">
                      <strong className="text-zinc-100 font-semibold">AI Suggestion:</strong> {refinedGoal}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={applyRefined} className="text-xs py-1.5 h-auto bg-amber-500 text-black hover:bg-amber-400">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Apply Suggestion
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

        <div className="pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3">Popular Goals</p>
          <div className="flex flex-wrap gap-2">
            {goalSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setGoal(suggestion)}
                className="text-xs px-3 py-1.5 bg-zinc-900/50 border border-zinc-800/80 text-zinc-400 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700 transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-zinc-800/50 flex justify-end">
        <Button onClick={onNext} disabled={!isValid} size="lg" className="w-full sm:w-auto px-8 font-semibold">
          Continue
        </Button>
      </div>
    </div>
  )
}
