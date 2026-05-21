'use client'

import { Clock, CalendarRange } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface StepCommitmentProps {
  dailyHours: number
  setDailyHours: (hours: number) => void
  targetMonths: number
  setTargetMonths: (months: number) => void
  onNext: () => void
  onBack: () => void
}

const DURATION_OPTIONS = [
  { value: 3, label: '3 Months', desc: 'Intensive' },
  { value: 6, label: '6 Months', desc: 'Balanced' },
  { value: 12, label: '1 Year', desc: 'Steady' },
  { value: 18, label: '1.5 Years', desc: 'Comprehensive' },
  { value: 24, label: '2 Years', desc: 'Deep Dive' },
]

export function StepCommitment({
  dailyHours,
  setDailyHours,
  targetMonths,
  setTargetMonths,
  onNext,
  onBack,
}: StepCommitmentProps) {
  // Calculate total hours roughly
  const totalDays = targetMonths * 30
  const totalHours = Math.round(dailyHours * totalDays)

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-headline font-bold text-zinc-100 flex items-center justify-center gap-2">
          <Clock className="w-6 h-6 text-amber-500" />
          Time Commitment
        </h2>
        <p className="text-zinc-400 text-sm">How much time can you dedicate?</p>
      </div>

      <div className="space-y-8">
        {/* Daily Hours Slider */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <label className="text-sm font-semibold uppercase tracking-wider text-zinc-500 block mb-1">Daily Study Time</label>
              <div className="text-zinc-400 text-xs">Consistent daily effort is key.</div>
            </div>
            <div className="text-3xl font-headline font-bold text-amber-500">
              {dailyHours} <span className="text-base text-zinc-500 font-normal">hrs</span>
            </div>
          </div>
          
          <div className="relative pt-2">
            <input
              type="range"
              min="0.5"
              max="8"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-600 mt-3 px-1">
              <span>30 min</span>
              <span>4 hrs</span>
              <span>8 hrs</span>
            </div>
          </div>
        </div>

        {/* Target Duration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CalendarRange className="w-4 h-4 text-zinc-500" />
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Target Duration</label>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {DURATION_OPTIONS.map((opt) => {
              const isSelected = targetMonths === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setTargetMonths(opt.value)}
                  className={`
                    flex flex-col items-start px-4 py-3 rounded-xl border transition-all duration-200
                    ${isSelected 
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80'}
                  `}
                >
                  <span className={`font-semibold mb-0.5 ${isSelected ? 'text-amber-500' : 'text-zinc-300'}`}>
                    {opt.label}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-amber-500/70' : 'text-zinc-600'}`}>
                    {opt.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Total Estimate Callout */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm text-zinc-400">Estimated Total Effort</span>
          <span className="font-mono font-semibold text-zinc-200">~{totalHours} hours</span>
        </div>
      </div>

      <div className="pt-8 border-t border-zinc-800/50 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
        <Button onClick={onBack} variant="ghost" className="w-full sm:w-auto text-zinc-400 hover:text-zinc-200">
          Back
        </Button>
        <Button onClick={onNext} size="lg" className="w-full sm:w-auto px-8 font-semibold">
          Review Plan
        </Button>
      </div>
    </div>
  )
}
