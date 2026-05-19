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
      
      if (user) {
        const { doc, setDoc } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')
        const docRef = doc(db, 'users', user.id, 'roadmaps', roadmap.id)
        roadmap.created_at = roadmap.created_at || new Date().toISOString()
        roadmap.updated_at = roadmap.updated_at || new Date().toISOString()
        roadmap.user_id = user.id
        await setDoc(docRef, roadmap)
      }

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
    <div className="min-h-screen bg-paper-50">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink-900 mb-4">
              Create Your Learning Roadmap
            </h1>
            <p className="text-ink-500 text-lg max-w-2xl mx-auto">
              Tell us about your learning goals and we&apos;ll generate a personalized
              roadmap just for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Learning Details</CardTitle>
                <CardDescription>
                  Fill in your information to get a customized learning path
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">
                    What&apos;s your learning goal?
                  </label>
                  <Input
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    placeholder="e.g., Become a Full Stack Developer"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {goalSuggestions.slice(0, 4).map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setFormData({ ...formData, goal })}
                        className="text-xs px-2 py-1 bg-paper-100 text-ink-500 rounded hover:bg-paper-200 transition-colors"
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
                  <label className="block text-sm font-medium text-ink-700 mb-2">
                    Daily Study Time: {formData.daily_hours} hours
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="8"
                    step="0.5"
                    value={formData.daily_hours}
                    onChange={(e) => setFormData({ ...formData, daily_hours: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-paper-200 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="flex justify-between text-xs text-ink-300 mt-1">
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
                <div className="bg-paper-100 border border-paper-300 rounded-xl p-4.5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-ink-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-accent" />
                        Skill Assessment (Optional)
                      </h4>
                      <p className="text-xs text-ink-500 leading-relaxed">
                        Take a quick 5-question AI quiz on your goal. If you score 70% or higher, we will customize your roadmap by pre-completing introductory topics for you!
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleStartQuiz}
                      isLoading={isQuizLoading}
                      className="text-xs py-2"
                    >
                      {assessmentScore !== null ? 'Retake Quiz' : 'Take Quiz'}
                    </Button>
                  </div>
                  {assessmentScore !== null && (
                    <div className="bg-success/5 border border-success/20 rounded-lg p-3 text-xs text-success-dark flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      <span>
                        Assessment recorded: <strong>{quizScore}/5 ({Math.round(assessmentScore * 100)}%)</strong>.
                        {assessmentScore >= 0.7 
                          ? ' Introductory lessons will be marked completed so you can skip ahead!' 
                          : ' We will tailor your roadmap explanations to support your level.'}
                      </span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-error/10 text-error rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full group"
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
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-paper-300">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-medium text-ink-900">Personalized</div>
                <div className="text-xs text-ink-500">Based on your schedule</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-paper-300">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-medium text-ink-900">Goal-Oriented</div>
                <div className="text-xs text-ink-500">Clear milestones</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-paper-300">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-medium text-ink-900">Comprehensive</div>
                <div className="text-xs text-ink-500">Resources included</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuizModal && quizQuestions.length > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-paper-300 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-paper-100 border-b border-paper-200 px-6 py-4 flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-ink-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-accent" />
                Assessment: {formData.goal}
              </h3>
              {quizScore === null && (
                <span className="text-xs font-semibold text-ink-400 bg-white px-2.5 py-1 rounded-full border border-paper-200">
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </span>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 overflow-y-auto min-h-[300px]">
              {quizScore === null ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-ink-900 leading-relaxed text-base">
                    {quizQuestions[currentQuestionIndex].question}
                  </h4>
                  <div className="space-y-2.5 pt-2">
                    {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-4 text-left text-sm rounded-xl border transition-all flex items-start gap-3 ${
                          selectedAnswers[currentQuestionIndex] === idx
                            ? 'border-accent bg-accent/5 text-accent font-medium'
                            : 'border-paper-200 hover:border-paper-300 bg-white text-ink-700'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs font-bold ${
                          selectedAnswers[currentQuestionIndex] === idx
                            ? 'border-accent bg-accent text-white'
                            : 'border-paper-300 text-ink-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-center py-4">
                  <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Award className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-xl text-ink-900">Quiz Completed!</h4>
                    <p className="text-3xl font-extrabold text-accent">
                      {quizScore} / {quizQuestions.length}
                    </p>
                    <p className="text-sm text-ink-500 max-w-sm mx-auto">
                      {assessmentScore !== null && assessmentScore >= 0.7
                        ? "Excellent job! You've shown solid competency. We'll automatically customize your roadmap by skipping basic topics."
                        : "Thanks for taking the assessment! We'll tailor your roadmap to ensure you cover all necessary fundamentals."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-paper-100 border-t border-paper-200 px-6 py-4 flex justify-end gap-3">
              {quizScore === null ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setShowQuizModal(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    className="text-xs"
                  >
                    {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setShowQuizModal(false)}
                  className="text-xs"
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
