'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { useStore } from '@/store'
import { api } from '@/lib/api'
import { Sparkles, Clock, Target, BookOpen, ArrowRight, HelpCircle, Award, CheckCircle, Loader2 } from 'lucide-react'
import type { RoadmapFormData, SkillLevel, LearningStyle, Roadmap } from '@/types'
import type { AxiosError } from 'axios'

interface QuizQuestion {
  question: string
  options: string[]
  answer_index: number
  explanation: string
}

const skillLevelOptions = [
  { value: 'beginner', label: 'Beginner - No prior knowledge' },
  { value: 'intermediate', label: 'Intermediate - Some experience' },
  { value: 'advanced', label: 'Advanced - Strong foundation' },
]

const learningStyleOptions = [
  { value: 'visual', label: 'Visual - Diagrams, videos, charts' },
  { value: 'auditory', label: 'Auditory - Lectures, discussions' },
  { value: 'reading', label: 'Reading/Writing - Text, notes' },
  { value: 'active', label: 'Active - Hands-on projects' },
]

const durationOptions = [
  { value: '3', label: '3 months' },
  { value: '6', label: '6 months' },
  { value: '12', label: '12 months' },
  { value: '18', label: '18 months' },
  { value: '24', label: '24 months' },
]

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

export default function GeneratePage() {
  const router = useRouter()
  const { setCurrentRoadmap, user } = useStore()
  const [formData, setFormData] = useState<RoadmapFormData>({
    goal: '',
    skill_level: 'beginner',
    daily_hours: 2,
    learning_style: 'reading',
    target_months: 6,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setLocalError] = useState<string | null>(null)

  // Pre-assessment state
  const [isQuizLoading, setIsQuizLoading] = useState(false)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null)

  const handleStartQuiz = async () => {
    if (!formData.goal.trim()) {
      setLocalError('Please enter your learning goal first to generate a relevant assessment.')
      return
    }
    setLocalError(null)
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
      console.error(err)
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
        if (selectedAnswers[idx] === q.answer_index) {
          correct++
        }
      })
      const finalScore = correct / quizQuestions.length
      setQuizScore(correct)
      setAssessmentScore(finalScore)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.goal.trim()) {
      setLocalError('Please enter your learning goal')
      return
    }

    setLocalError(null)
    setIsGenerating(true)

    try {
      const response = await api.post<Roadmap>('/api/roadmaps/generate', {
        goal: formData.goal,
        skill_level: formData.skill_level,
        daily_hours: formData.daily_hours,
        learning_style: formData.learning_style,
        target_months: formData.target_months,
        assessment_score: assessmentScore,
      })

      const roadmap = response.data
      
      // Offline/mock mode: save generated roadmaps to localStorage
      roadmap.created_at = roadmap.created_at || new Date().toISOString()
      roadmap.updated_at = roadmap.updated_at || new Date().toISOString()
      roadmap.user_id = user?.id || 'mock-user-123'
      localStorage.setItem(`roadmap_${roadmap.id}`, JSON.stringify(roadmap))

      setCurrentRoadmap(roadmap)
      localStorage.setItem('current_roadmap', JSON.stringify(roadmap))
      router.push(`/roadmap/${roadmap.id}`)
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ detail?: string }>
      setLocalError(axiosErr.response?.data?.detail || 'Failed to generate roadmap. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <Navbar />

      <div className="pt-24 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-medium mb-6 shadow-[0_0_15px_rgba(255,113,98,0.15)]">
              <Sparkles className="w-4 h-4" />
              AI-Powered
            </div>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-on-surface mb-4">
              Create Your Learning Roadmap
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
              Tell us about your learning goals and we&apos;ll generate a personalized
              roadmap just for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="max-w-2xl mx-auto p-2">
              <CardHeader className="text-center border-b border-outline-variant/50 pb-6 mb-6">
                <CardTitle className="text-2xl">Learning Details</CardTitle>
                <CardDescription className="text-on-surface-variant">
                  Fill in your information to get a customized learning path
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit} className="space-y-6 px-4 pb-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">
                    What&apos;s your learning goal?
                  </label>
                  <Input
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    placeholder="e.g., Become a Full Stack Developer"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {goalSuggestions.slice(0, 4).map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setFormData({ ...formData, goal })}
                        className="text-xs px-3 py-1.5 bg-surface-container border border-outline-variant text-on-surface-variant rounded-md hover:bg-surface-container-high hover:text-on-surface transition-colors"
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <Select
                    label="Current Skill Level"
                    options={skillLevelOptions}
                    value={formData.skill_level}
                    onChange={(e) => setFormData({ ...formData, skill_level: e.target.value as SkillLevel })}
                  />

                  <Select
                    label="Preferred Learning Style"
                    options={learningStyleOptions}
                    value={formData.learning_style}
                    onChange={(e) => setFormData({ ...formData, learning_style: e.target.value as LearningStyle })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">
                    Daily Study Time: <span className="text-primary font-bold">{formData.daily_hours}</span> hours
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="8"
                    step="0.5"
                    value={formData.daily_hours}
                    onChange={(e) => setFormData({ ...formData, daily_hours: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-on-surface-variant mt-2 font-mono">
                    <span>30 min</span>
                    <span>8 hours</span>
                  </div>
                </div>

                <Select
                  label="Target Duration"
                  options={durationOptions}
                  value={formData.target_months.toString()}
                  onChange={(e) => setFormData({ ...formData, target_months: parseInt(e.target.value) })}
                />

                {/* Pre-Assessment Card */}
                <div className="bg-surface-container/50 backdrop-blur-md border border-outline-variant rounded-xl p-5 space-y-3 relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-on-surface flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Skill Assessment <span className="text-[10px] font-normal uppercase tracking-wider text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded-full">(Optional)</span>
                      </h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm">
                        Take a quick 5-question AI quiz on your goal. Score 70%+ and we will customize your roadmap by pre-completing introductory topics for you!
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleStartQuiz}
                      isLoading={isQuizLoading}
                      className="text-xs py-2 whitespace-nowrap"
                    >
                      {assessmentScore !== null ? 'Retake Quiz' : 'Take Quiz'}
                    </Button>
                  </div>
                  {assessmentScore !== null && (
                    <div className="bg-success/10 border border-success/20 rounded-lg p-3 text-xs text-success flex items-start sm:items-center gap-2 mt-4 relative z-10">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span>
                        Assessment recorded: <strong className="text-on-surface">{quizScore}/5 ({Math.round(assessmentScore * 100)}%)</strong>.
                        {assessmentScore >= 0.7 
                          ? ' Introductory lessons will be marked completed so you can skip ahead!' 
                          : ' We will tailor your roadmap explanations to support your level.'}
                      </span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-error/10 border border-error/20 text-error rounded-lg text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-error mt-1.5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full group mt-4 h-12 text-base font-semibold"
                  isLoading={isGenerating}
                >
                  {isGenerating ? 'Generating your roadmap...' : 'Generate My Roadmap'}
                  {!isGenerating && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 p-4 bg-surface-container/30 backdrop-blur-md rounded-xl border border-outline-variant hover:border-outline transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-on-surface text-sm">Personalized</div>
                <div className="text-xs text-on-surface-variant mt-0.5">Based on your schedule</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 p-4 bg-surface-container/30 backdrop-blur-md rounded-xl border border-outline-variant hover:border-outline transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-on-surface text-sm">Goal-Oriented</div>
                <div className="text-xs text-on-surface-variant mt-0.5">Clear milestones</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 p-4 bg-surface-container/30 backdrop-blur-md rounded-xl border border-outline-variant hover:border-outline transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-on-surface text-sm">Comprehensive</div>
                <div className="text-xs text-on-surface-variant mt-0.5">Resources included</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuizModal && quizQuestions.length > 0 && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-surface-container-high rounded-2xl border border-outline w-full max-w-lg shadow-[0_0_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-surface-container border-b border-outline-variant px-6 py-5 flex justify-between items-center">
              <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Assessment: {formData.goal}
              </h3>
              {quizScore === null && (
                <span className="text-xs font-mono text-on-surface-variant bg-surface-container-highest px-3 py-1 rounded-full border border-outline-variant">
                  {currentQuestionIndex + 1} / {quizQuestions.length}
                </span>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 overflow-y-auto min-h-[300px]">
              {quizScore === null ? (
                <div className="space-y-5">
                  <h4 className="font-medium text-on-surface leading-relaxed text-base">
                    {quizQuestions[currentQuestionIndex].question}
                  </h4>
                  <div className="space-y-3 pt-2">
                    {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-4 text-left text-sm rounded-xl border transition-all duration-200 flex items-start gap-3 group ${
                          selectedAnswers[currentQuestionIndex] === idx
                            ? 'border-primary bg-primary/10 text-primary font-medium'
                            : 'border-outline-variant hover:border-outline bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold transition-colors ${
                          selectedAnswers[currentQuestionIndex] === idx
                            ? 'border-primary bg-primary text-on-primary'
                            : 'border-outline text-on-surface-variant group-hover:border-on-surface-variant group-hover:text-on-surface'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 mt-0.5">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-center py-8">
                  <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(40,167,69,0.2)]">
                    <Award className="w-10 h-10" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-headline font-bold text-2xl text-on-surface">Quiz Completed!</h4>
                    <p className="text-4xl font-extrabold text-primary drop-shadow-[0_0_10px_rgba(255,113,98,0.3)]">
                      {quizScore} <span className="text-2xl text-on-surface-variant">/ {quizQuestions.length}</span>
                    </p>
                    <p className="text-sm text-on-surface-variant max-w-sm mx-auto pt-2">
                      {assessmentScore !== null && assessmentScore >= 0.7
                        ? "Excellent job! You've shown solid competency. We'll automatically customize your roadmap by skipping basic topics."
                        : "Thanks for taking the assessment! We'll tailor your roadmap to ensure you cover all necessary fundamentals."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-surface-container border-t border-outline-variant px-6 py-4 flex justify-end gap-3">
              {quizScore === null ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setShowQuizModal(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    className="text-xs px-6"
                  >
                    {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setShowQuizModal(false)}
                  className="text-xs px-8"
                >
                  Done
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

