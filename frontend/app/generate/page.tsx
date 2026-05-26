'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Target, User, Clock, Award, HelpCircle } from 'lucide-react'
import { useStore } from '@/store'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { logger } from '@/lib/logger'
import type { RoadmapFormData, SkillLevel, LearningStyle, Roadmap } from '@/types'
import type { AxiosError } from 'axios'

import { WizardProgress } from './_components/WizardProgress'
import { StepGoal } from './_components/StepGoal'
import { StepProfile } from './_components/StepProfile'
import { StepCommitment } from './_components/StepCommitment'
import { StepReview } from './_components/StepReview'
import { ConfettiBurst } from './_components/ConfettiBurst'

interface QuizQuestion {
  question: string
  options: string[]
  answer_index: number
  explanation: string
}

const STEPS = [
  { icon: Target, label: 'The Goal' },
  { icon: User, label: 'Profile' },
  { icon: Clock, label: 'Commitment' },
  { icon: Award, label: 'Review' },
]

export default function GeneratePage() {
  const router = useRouter()
  const { setCurrentRoadmap, user, addSavedRoadmap } = useStore()
  
  // Wizard State
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setLocalError] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState<RoadmapFormData>({
    goal: '',
    skill_level: 'beginner',
    daily_hours: 2,
    learning_style: 'reading',
    target_months: 6,
  })

  // Quiz State
  const [isQuizLoading, setIsQuizLoading] = useState(false)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRoadmapId, setGeneratedRoadmapId] = useState<string | null>(null)

  const goToStep = (target: number) => {
    setDirection(target > step ? 1 : -1)
    setStep(target)
  }

  const handleNext = () => {
    setDirection(1)
    setStep((s) => Math.min(s + 1, STEPS.length))
  }

  const handleBack = () => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 1))
  }

  const updateFormData = (key: keyof RoadmapFormData, value: RoadmapFormData[keyof RoadmapFormData]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  // --- Quiz Logic ---
  const handleStartQuiz = async () => {
    setIsQuizLoading(true)
    try {
      const res = await api.post<{ questions: QuizQuestion[] }>('/api/assessment/generate', {
        goal: formData.goal,
        skill_level: formData.skill_level,
      })
      setQuizQuestions(res.data.questions)
      setCurrentQuestionIndex(0)
      setSelectedAnswers([])
      setQuizScore(null)
      setShowQuizModal(true)
    } catch (err) {
      logger.error('Failed to generate assessment quiz. Please try again.')
      setLocalError('Failed to generate assessment quiz. Please try again.')
    } finally {
      setIsQuizLoading(false)
    }
  }

  const handleSelectOption = (optIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = optIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      let correct = 0
      quizQuestions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.answer_index) correct++
      })
      const finalScore = correct / quizQuestions.length
      setQuizScore(correct)
      setAssessmentScore(finalScore)
    }
  }
  // ------------------

  const handleGenerate = async () => {
    setLocalError(null)
    setIsGenerating(true)

    try {
      const response = await api.post<Roadmap>('/api/roadmaps/generate', {
        ...formData,
        assessment_score: assessmentScore,
      })

      const roadmap = response.data
      
      roadmap.created_at = roadmap.created_at || new Date().toISOString()
      roadmap.updated_at = roadmap.updated_at || new Date().toISOString()
      roadmap.user_id = user?.id || 'mock-user-123'
      localStorage.setItem(`roadmap_${roadmap.id}`, JSON.stringify(roadmap))

      setCurrentRoadmap(roadmap)
      addSavedRoadmap(roadmap)
      localStorage.setItem('current_roadmap', JSON.stringify(roadmap))
      
      setGeneratedRoadmapId(roadmap.id)
      setPublishSuccess(true)
      setShowConfetti(true)
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ detail?: string }>
      setLocalError(axiosErr.response?.data?.detail || 'Failed to generate roadmap. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  }

  if (publishSuccess) {
    return (
      <div className="min-h-screen min-h-[100dvh] relative flex items-center justify-center p-4 px-5">
        <Navbar />
        <ConfettiBurst trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
        <motion.div 
          initial={{ opacity: 0, y: 24, scale: 0.95 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-surface-container/60 backdrop-blur-xl border border-outline-variant/50 rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Award className="w-8 h-8 md:w-10 md:h-10 text-amber-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface mb-1.5 md:mb-2">Roadmap Created!</h1>
          <p className="text-on-surface-variant text-sm md:text-base mb-6 md:mb-8 px-2">Your personalized journey for &ldquo;{formData.goal}&rdquo; is ready.</p>
          <div className="space-y-2.5 md:space-y-3">
            <Button size="lg" className="w-full bg-amber-500 text-black hover:bg-amber-400 active:scale-95" onClick={() => router.push(`/roadmap/${generatedRoadmapId}`)}>
              View Roadmap
            </Button>
            <Button variant="ghost" className="w-full text-on-surface-variant active:scale-95" onClick={() => {
              setPublishSuccess(false)
              setStep(1)
              setFormData({ ...formData, goal: '' })
            }}>
              Create Another
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <Navbar />

      <div className="pt-20 md:pt-28 pb-6 md:pb-16 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
          <WizardProgress steps={STEPS} currentStep={step} onStepClick={goToStep} />

          <div className="relative">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 md:mb-6 p-3 md:p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs md:text-sm flex items-center justify-center mx-2 md:mx-0">
                {error}
              </motion.div>
            )}

            <div className="bg-surface-container/40 backdrop-blur-xl border border-outline-variant/50 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[75vh] md:max-h-[65vh] min-h-[60vh] md:min-h-[400px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {step === 1 && (
                    <StepGoal 
                      goal={formData.goal} 
                      setGoal={(v) => updateFormData('goal', v)} 
                      onNext={handleNext} 
                    />
                  )}
                  {step === 2 && (
                    <StepProfile 
                      skillLevel={formData.skill_level} 
                      setSkillLevel={(v) => updateFormData('skill_level', v)} 
                      learningStyle={formData.learning_style} 
                      setLearningStyle={(v) => updateFormData('learning_style', v)} 
                      onNext={handleNext} 
                      onBack={handleBack} 
                    />
                  )}
                  {step === 3 && (
                    <StepCommitment 
                      dailyHours={formData.daily_hours} 
                      setDailyHours={(v) => updateFormData('daily_hours', v)} 
                      targetMonths={formData.target_months} 
                      setTargetMonths={(v) => updateFormData('target_months', v)} 
                      onNext={handleNext} 
                      onBack={handleBack} 
                    />
                  )}
                  {step === 4 && (
                    <StepReview 
                      formData={formData} 
                      goToStep={goToStep} 
                      onGenerate={handleGenerate} 
                      isGenerating={isGenerating}
                      onStartQuiz={handleStartQuiz}
                      isQuizLoading={isQuizLoading}
                      assessmentScore={assessmentScore}
                      quizScore={quizScore}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuizModal && quizQuestions.length > 0 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-end sm:items-center justify-center sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-950 rounded-t-2xl sm:rounded-2xl border-t sm:border border-outline-variant w-full sm:max-w-lg max-h-[90vh] sm:max-h-[80vh] shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div className="bg-surface-container border-b border-outline-variant px-4 md:px-6 py-3.5 md:py-5 flex justify-between items-center flex-shrink-0">
              <h3 className="font-headline font-bold text-base md:text-lg text-on-surface flex items-center gap-2">
                <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                Assessment Quiz
              </h3>
              {quizScore === null && (
                <span className="text-[10px] md:text-xs font-mono text-on-surface-variant bg-surface-container-high px-2.5 md:px-3 py-1 rounded-full border border-outline">
                  {currentQuestionIndex + 1} / {quizQuestions.length}
                </span>
              )}
            </div>

            <div className="p-4 md:p-6 flex-1 overflow-y-auto min-h-0">
              {quizScore === null ? (
                <div className="space-y-4 md:space-y-5">
                  <h4 className="font-medium text-on-surface leading-relaxed text-sm md:text-base">
                    {quizQuestions[currentQuestionIndex].question}
                  </h4>
                  <div className="space-y-2 md:space-y-3 pt-1 md:pt-2">
                    {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-3 md:p-4 text-left text-xs md:text-sm rounded-xl border transition-all duration-200 flex items-start gap-2.5 md:gap-3 group active:scale-[0.98] ${
                          selectedAnswers[currentQuestionIndex] === idx
                            ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-medium'
                            : 'border-outline-variant bg-surface-container text-on-surface hover:border-outline hover:bg-surface-container-high'
                        }`}
                      >
                        <span className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border text-[10px] md:text-xs font-bold transition-colors flex-shrink-0 ${
                          selectedAnswers[currentQuestionIndex] === idx
                            ? 'border-amber-500 bg-amber-500 text-black'
                            : 'border-outline text-on-surface-variant group-hover:text-zinc-300 group-hover:border-zinc-500'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 mt-0 md:mt-0.5">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5 md:space-y-6 text-center py-6 md:py-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <Award className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <h4 className="font-headline font-bold text-xl md:text-2xl text-on-surface">Quiz Completed!</h4>
                    <p className="text-3xl md:text-4xl font-extrabold text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                      {quizScore} <span className="text-xl md:text-2xl text-tertiary">/ {quizQuestions.length}</span>
                    </p>
                    <p className="text-xs md:text-sm text-on-surface-variant max-w-sm mx-auto pt-1 md:pt-2 px-4">
                      {assessmentScore !== null && assessmentScore >= 0.7
                        ? "Excellent job! We'll tailor your roadmap to skip introductory concepts."
                        : "Thanks for taking the quiz! We'll ensure your roadmap covers all fundamentals."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-surface-container border-t border-outline-variant px-4 md:px-6 py-3 md:py-4 flex justify-end gap-2.5 md:gap-3 flex-shrink-0">
              {quizScore === null ? (
                <>
                  <Button variant="ghost" onClick={() => setShowQuizModal(false)} className="text-xs text-on-surface-variant active:scale-95">Cancel</Button>
                  <Button onClick={handleNextQuestion} disabled={selectedAnswers[currentQuestionIndex] === undefined} className="text-xs px-5 md:px-6 bg-zinc-100 text-black hover:bg-white active:scale-95 flex-1 sm:flex-none">
                    {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setShowQuizModal(false)} className="text-xs px-6 md:px-8 bg-zinc-100 text-black hover:bg-white active:scale-95 w-full sm:w-auto">Done</Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
