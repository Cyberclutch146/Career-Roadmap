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
  { value: 3, label: '3 Mo', fullLabel: '3 Months', desc: 'Intensive' },
  { value: 6, label: '6 Mo', fullLabel: '6 Months', desc: 'Balanced' },
  { value: 12, label: '1 Yr', fullLabel: '1 Year', desc: 'Steady' },
  { value: 18, label: '1.5 Yr', fullLabel: '1.5 Years', desc: 'Comprehensive' },
  { value: 24, label: '2 Yr', fullLabel: '2 Years', desc: 'Deep Dive' },
]

export function StepCommitment({
  dailyHours,
  setDailyHours,
  targetMonths,
  setTargetMonths,
  onNext,
  onBack,
}: StepCommitmentProps) {
  const totalDays = targetMonths * 30
  const totalHours = Math.round(dailyHours * totalDays)

  return (
    <div className="space-y-5 md:space-y-8">
      <div className="text-center space-y-1.5 md:space-y-2 mb-4 md:mb-8">
        <h2 className="text-xl md:text-2xl font-headline font-bold text-on-surface flex items-center justify-center gap-2">
          <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
          Time Commitment
        </h2>
        <p className="text-on-surface-variant text-xs md:text-sm">How much time can you dedicate?</p>
      </div>

      <div className="space-y-5 md:space-y-8">
        {/* Daily Hours Slider */}
        <div className="bg-surface-container/40 border border-outline-variant/50 rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex justify-between items-end mb-4 md:mb-6">
            <div>
              <label className="text-[10px] md:text-sm font-semibold uppercase tracking-wider text-on-surface-variant block mb-0.5 md:mb-1">Daily Study Time</label>
              <div className="text-on-surface-variant text-[10px] md:text-xs hidden sm:block">Consistent daily effort is key.</div>
            </div>
            <div className="text-2xl md:text-3xl font-headline font-bold text-amber-500">
              {dailyHours} <span className="text-sm md:text-base text-on-surface-variant font-normal">hrs</span>
            </div>
          </div>
          
          <div className="relative pt-1 md:pt-2 touch-none">
            <input
              type="range"
              min="0.5"
              max="8"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value))}
              className="w-full h-2.5 md:h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-amber-500"
              style={{ WebkitAppearance: 'none' }}
            />
            <div className="flex justify-between text-[9px] md:text-[10px] font-mono text-tertiary mt-2.5 md:mt-3 px-0.5">
              <span>30 min</span>
              <span>4 hrs</span>
              <span>8 hrs</span>
            </div>
          </div>
        </div>

        {/* Target Duration */}
        <div className="space-y-2.5 md:space-y-4">
          <div className="flex items-center gap-2 mb-1 md:mb-2">
            <CalendarRange className="w-3.5 h-3.5 md:w-4 md:h-4 text-on-surface-variant" />
            <label className="text-[10px] md:text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Target Duration</label>
          </div>
          
          <div className="grid grid-cols-5 gap-1.5 md:flex md:flex-wrap md:gap-3">
            {DURATION_OPTIONS.map((opt) => {
              const isSelected = targetMonths === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setTargetMonths(opt.value)}
                  className={`
                    flex flex-col items-center md:items-start px-2 md:px-4 py-2.5 md:py-3 rounded-xl border transition-all duration-200 active:scale-95
                    ${isSelected 
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                      : 'bg-surface-container/40 border-outline-variant hover:border-outline hover:bg-zinc-900/80'}
                  `}
                >
                  <span className={`font-semibold text-xs md:text-base mb-0 md:mb-0.5 ${isSelected ? 'text-amber-500' : 'text-on-surface'}`}>
                    <span className="md:hidden">{opt.label}</span>
                    <span className="hidden md:inline">{opt.fullLabel}</span>
                  </span>
                  <span className={`text-[9px] md:text-[10px] uppercase tracking-wider ${isSelected ? 'text-amber-500/70' : 'text-tertiary'} hidden md:block`}>
                    {opt.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Total Estimate Callout */}
        <div className="bg-surface-container/60 border border-outline-variant rounded-xl p-3 md:p-4 flex items-center justify-between">
          <span className="text-xs md:text-sm text-on-surface-variant">Estimated Total Effort</span>
          <span className="font-mono font-semibold text-sm md:text-base text-on-surface">~{totalHours} hours</span>
        </div>
      </div>

      <div className="pt-5 md:pt-8 border-t border-outline-variant/50 flex gap-3 justify-between">
        <Button onClick={onBack} variant="ghost" className="flex-1 sm:flex-none sm:w-auto text-on-surface-variant hover:text-zinc-200 active:scale-95">
          Back
        </Button>
        <Button onClick={onNext} size="lg" className="flex-1 sm:flex-none sm:w-auto px-8 font-semibold active:scale-95">
          Review Plan
        </Button>
      </div>
    </div>
  )
}
