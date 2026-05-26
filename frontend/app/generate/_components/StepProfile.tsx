'use client'

import { User, BookOpen, Layers, Zap, Eye, Headphones, PenTool, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { SkillLevel, LearningStyle } from '@/types'

interface StepProfileProps {
  skillLevel: SkillLevel
  setSkillLevel: (level: SkillLevel) => void
  learningStyle: LearningStyle
  setLearningStyle: (style: LearningStyle) => void
  onNext: () => void
  onBack: () => void
}

const SKILL_LEVELS: { id: SkillLevel; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'beginner', label: 'Beginner', desc: 'Starting from scratch', icon: BookOpen },
  { id: 'intermediate', label: 'Intermediate', desc: 'Have some basic experience', icon: Layers },
  { id: 'advanced', label: 'Advanced', desc: 'Looking to master advanced topics', icon: Zap },
]

const LEARNING_STYLES: { id: LearningStyle; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'visual', label: 'Visual', desc: 'Diagrams, videos, charts', icon: Eye },
  { id: 'auditory', label: 'Auditory', desc: 'Lectures and discussions', icon: Headphones },
  { id: 'reading', label: 'Reading/Writing', desc: 'Text-heavy resources', icon: PenTool },
  { id: 'active', label: 'Active', desc: 'Hands-on projects', icon: Wrench },
]

export function StepProfile({
  skillLevel,
  setSkillLevel,
  learningStyle,
  setLearningStyle,
  onNext,
  onBack,
}: StepProfileProps) {
  return (
    <div className="space-y-5 md:space-y-8">
      <div className="text-center space-y-1.5 md:space-y-2 mb-4 md:mb-8">
        <h2 className="text-xl md:text-2xl font-headline font-bold text-on-surface flex items-center justify-center gap-2">
          <User className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
          Your Profile
        </h2>
        <p className="text-on-surface-variant text-xs md:text-sm">How do you prefer to learn?</p>
      </div>

      <div className="space-y-5 md:space-y-6">
        {/* Skill Level Selection */}
        <div className="space-y-2.5 md:space-y-3">
          <label className="text-[10px] md:text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Current Skill Level</label>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {SKILL_LEVELS.map((level) => {
              const Icon = level.icon
              const isSelected = skillLevel === level.id
              return (
                <button
                  key={level.id}
                  onClick={() => setSkillLevel(level.id)}
                  className={`
                    relative p-3 md:p-4 rounded-xl text-left transition-all duration-200 border group active:scale-[0.97]
                    ${isSelected 
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                      : 'bg-surface-container/40 border-outline-variant hover:border-outline hover:bg-zinc-900/80'}
                  `}
                >
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 mb-2 md:mb-3 ${isSelected ? 'text-amber-500' : 'text-on-surface-variant group-hover:text-zinc-400'}`} />
                  <div className={`font-semibold text-xs md:text-base mb-0.5 md:mb-1 ${isSelected ? 'text-on-surface' : 'text-on-surface'}`}>{level.label}</div>
                  <div className={`text-[10px] md:text-xs leading-tight ${isSelected ? 'text-on-surface-variant' : 'text-tertiary'} hidden sm:block`}>{level.desc}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Learning Style Selection */}
        <div className="space-y-2.5 md:space-y-3 pt-3 md:pt-4 border-t border-outline-variant/50">
          <label className="text-[10px] md:text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Preferred Learning Style</label>
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {LEARNING_STYLES.map((style) => {
              const Icon = style.icon
              const isSelected = learningStyle === style.id
              return (
                <button
                  key={style.id}
                  onClick={() => setLearningStyle(style.id)}
                  className={`
                    flex items-center gap-2.5 md:gap-3 p-3 md:p-4 rounded-xl text-left transition-all duration-200 border group active:scale-[0.97]
                    ${isSelected 
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                      : 'bg-surface-container/40 border-outline-variant hover:border-outline hover:bg-zinc-900/80'}
                  `}
                >
                  <div className={`p-1.5 md:p-2 rounded-lg flex-shrink-0 ${isSelected ? 'bg-amber-500/20' : 'bg-zinc-800/50'}`}>
                    <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isSelected ? 'text-amber-500' : 'text-on-surface-variant group-hover:text-zinc-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <div className={`font-semibold text-xs md:text-base mb-0 md:mb-0.5 ${isSelected ? 'text-on-surface' : 'text-on-surface'}`}>{style.label}</div>
                    <div className={`text-[10px] md:text-xs leading-tight ${isSelected ? 'text-on-surface-variant' : 'text-tertiary'} hidden sm:block`}>{style.desc}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="pt-5 md:pt-8 border-t border-outline-variant/50 flex gap-3 justify-between">
        <Button onClick={onBack} variant="ghost" className="flex-1 sm:flex-none sm:w-auto text-on-surface-variant hover:text-zinc-200 active:scale-95">
          Back
        </Button>
        <Button onClick={onNext} size="lg" className="flex-1 sm:flex-none sm:w-auto px-8 font-semibold active:scale-95">
          Continue
        </Button>
      </div>
    </div>
  )
}
