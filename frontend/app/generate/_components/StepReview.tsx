'use client'

import { ClipboardCheck, Edit2, Zap, Award, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useState, useEffect } from 'react'
import type { RoadmapFormData } from '@/types'

interface StepReviewProps {
  formData: RoadmapFormData
  goToStep: (step: number) => void
  onGenerate: () => void
  isGenerating: boolean
  
  // Quiz Props
  onStartQuiz: () => void
  isQuizLoading: boolean
  assessmentScore: number | null
  quizScore: number | null
}

export function StepReview({
  formData,
  goToStep,
  onGenerate,
  isGenerating,
  onStartQuiz,
  isQuizLoading,
  assessmentScore,
  quizScore,
}: StepReviewProps) {
  const [loadingPhase, setLoadingPhase] = useState(0)
  const loadingTexts = ["Analyzing your goals...", "Building curriculum...", "Curating resources..."]

  useEffect(() => {
    if (!isGenerating) {
      setLoadingPhase(0)
      return
    }
    const interval = setInterval(() => {
      setLoadingPhase(p => Math.min(p + 1, 2))
    }, 3500)
    return () => clearInterval(interval)
  }, [isGenerating])
  
  const SummaryRow = ({ label, value, step }: { label: string, value: string, step: number }) => (
    <div className="flex items-start justify-between py-2.5 md:py-3 group">
      <div className="min-w-0 flex-1">
        <div className="text-[9px] md:text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-0.5 md:mb-1">{label}</div>
        <div className="text-xs md:text-sm font-medium text-on-surface break-words">{value}</div>
      </div>
      <button 
        onClick={() => goToStep(step)}
        className="ml-2 p-1.5 text-on-surface-variant hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-all flex-shrink-0 active:scale-90 md:opacity-0 md:group-hover:opacity-100"
      >
        <Edit2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
      </button>
    </div>
  )

  return (
    <div className="space-y-5 md:space-y-8">
      <div className="text-center space-y-1.5 md:space-y-2 mb-4 md:mb-8">
        <h2 className="text-xl md:text-2xl font-headline font-bold text-on-surface flex items-center justify-center gap-2">
          <ClipboardCheck className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
          Review & Generate
        </h2>
        <p className="text-on-surface-variant text-xs md:text-sm">Everything looks good? Ready to build your roadmap.</p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Pre-Assessment Card */}
        <div className="bg-surface-container/40 rounded-xl md:rounded-2xl p-4 md:p-5 relative overflow-hidden group transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="flex flex-col gap-3 md:gap-4 relative z-10">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 md:space-y-2 min-w-0 flex-1">
                <h4 className="text-xs md:text-sm font-bold text-on-surface flex items-center gap-1.5 md:gap-2 flex-wrap">
                  <Award className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500 flex-shrink-0" />
                  Skill Assessment
                  <span className="text-[9px] md:text-[10px] font-normal uppercase tracking-wider text-on-surface-variant bg-surface-container px-1.5 md:px-2 py-0.5 rounded-full border border-outline-variant">Optional</span>
                </h4>
                <p className="text-[10px] md:text-xs text-on-surface-variant leading-relaxed">
                  Quick 5-question quiz. Score 70%+ to skip intro topics!
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onStartQuiz}
                isLoading={isQuizLoading}
                className="text-[10px] md:text-xs py-1.5 md:py-2 px-3 whitespace-nowrap bg-surface-container-high hover:bg-surface-variant text-on-surface border border-outline flex-shrink-0 active:scale-95"
              >
                {assessmentScore !== null ? 'Retake' : 'Take Quiz'}
              </Button>
            </div>
            
            {assessmentScore !== null && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 md:p-3 text-[10px] md:text-xs text-emerald-400 flex items-start gap-1.5 md:gap-2">
                <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Score: <strong className="text-emerald-300">{quizScore}/5 ({Math.round(assessmentScore * 100)}%)</strong>.
                  {assessmentScore >= 0.7 
                    ? ' Intro lessons will be skipped!' 
                    : ' Tailored to your level.'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-zinc-900/30 rounded-xl md:rounded-2xl p-4 md:p-5">
          <SummaryRow label="The Goal" value={formData.goal} step={1} />
          <SummaryRow label="Skill Level" value={formData.skill_level.charAt(0).toUpperCase() + formData.skill_level.slice(1)} step={2} />
          <SummaryRow label="Learning Style" value={formData.learning_style.charAt(0).toUpperCase() + formData.learning_style.slice(1)} step={2} />
          <SummaryRow label="Commitment" value={`${formData.daily_hours} hrs/day for ${formData.target_months} months`} step={3} />
        </div>
      </div>

      <div className="pt-5 md:pt-8 flex gap-3 justify-between">
        <Button onClick={() => goToStep(3)} variant="ghost" disabled={isGenerating} className="flex-1 sm:flex-none sm:w-auto text-on-surface-variant hover:text-zinc-200 active:scale-95">
          Back
        </Button>
        <Button 
          onClick={onGenerate} 
          size="lg" 
          isLoading={isGenerating}
          className="flex-[2] sm:flex-none sm:w-auto px-6 md:px-8 font-semibold bg-amber-500 text-black hover:bg-amber-400 active:scale-95"
        >
          {isGenerating ? loadingTexts[loadingPhase] : (
            <>
              <Zap className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Generate My Roadmap</span>
              <span className="sm:hidden">Generate</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
