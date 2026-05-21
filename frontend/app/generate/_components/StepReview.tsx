'use client'

import { ClipboardCheck, Edit2, Zap, HelpCircle, Award, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
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
  
  const SummaryRow = ({ label, value, step }: { label: string, value: string, step: number }) => (
    <div className="flex items-start justify-between py-3 border-b border-zinc-800/50 last:border-0 group">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">{label}</div>
        <div className="text-sm font-medium text-zinc-200">{value}</div>
      </div>
      <button 
        onClick={() => goToStep(step)}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-all"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-headline font-bold text-zinc-100 flex items-center justify-center gap-2">
          <ClipboardCheck className="w-6 h-6 text-amber-500" />
          Review & Generate
        </h2>
        <p className="text-zinc-400 text-sm">Everything looks good? Ready to build your roadmap.</p>
      </div>

      <div className="space-y-6">
        {/* Pre-Assessment Card */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/30 transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Skill Assessment <span className="text-[10px] font-normal uppercase tracking-wider text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">Optional</span>
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                Take a quick 5-question AI quiz. Score 70%+ and we'll customize your roadmap by pre-completing introductory topics!
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onStartQuiz}
              isLoading={isQuizLoading}
              className="text-xs py-2 whitespace-nowrap bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
            >
              {assessmentScore !== null ? 'Retake Quiz' : 'Take Quiz'}
            </Button>
          </div>
          
          {assessmentScore !== null && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-xs text-emerald-400 flex items-start sm:items-center gap-2 mt-4 relative z-10">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span>
                Assessment recorded: <strong className="text-emerald-300">{quizScore}/5 ({Math.round(assessmentScore * 100)}%)</strong>.
                {assessmentScore >= 0.7 
                  ? ' Introductory lessons will be marked completed!' 
                  : ' Explanations will be tailored to your level.'}
              </span>
            </div>
          )}
        </div>

        {/* Summary Table */}
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5">
          <SummaryRow label="The Goal" value={formData.goal} step={1} />
          <SummaryRow label="Skill Level" value={formData.skill_level.charAt(0).toUpperCase() + formData.skill_level.slice(1)} step={2} />
          <SummaryRow label="Learning Style" value={formData.learning_style.charAt(0).toUpperCase() + formData.learning_style.slice(1)} step={2} />
          <SummaryRow label="Commitment" value={`${formData.daily_hours} hrs/day for ${formData.target_months} months`} step={3} />
        </div>
      </div>

      <div className="pt-8 border-t border-zinc-800/50 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
        <Button onClick={() => goToStep(3)} variant="ghost" disabled={isGenerating} className="w-full sm:w-auto text-zinc-400 hover:text-zinc-200">
          Back
        </Button>
        <Button 
          onClick={onGenerate} 
          size="lg" 
          isLoading={isGenerating}
          className="w-full sm:w-auto px-8 font-semibold bg-amber-500 text-black hover:bg-amber-400"
        >
          {isGenerating ? 'Building Roadmap...' : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Generate My Roadmap
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
