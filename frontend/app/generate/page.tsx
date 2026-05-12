'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { useStore } from '@/store'
import { api } from '@/lib/api'
import { Sparkles, Clock, Target, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { RoadmapFormData, SkillLevel, LearningStyle, Roadmap } from '@/types'

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
  const { setCurrentRoadmap, setLoading, isLoading, setError } = useStore()
  const [formData, setFormData] = useState<RoadmapFormData>({
    goal: '',
    skill_level: 'beginner',
    daily_hours: 2,
    learning_style: 'reading',
    target_months: 6,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setLocalError] = useState<string | null>(null)

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
      })

      const roadmap = response.data
      setCurrentRoadmap(roadmap)
      localStorage.setItem('current_roadmap', JSON.stringify(roadmap))
      router.push(`/roadmap/${roadmap.id}`)
    } catch (err: any) {
      setLocalError(err.response?.data?.detail || 'Failed to generate roadmap. Please try again.')
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
                    max="6"
                    step="0.5"
                    value={formData.daily_hours}
                    onChange={(e) => setFormData({ ...formData, daily_hours: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-paper-200 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="flex justify-between text-xs text-ink-300 mt-1">
                    <span>30 min</span>
                    <span>6 hours</span>
                  </div>
                </div>

                <Select
                  label="Target Duration"
                  options={durationOptions}
                  value={formData.target_months.toString()}
                  onChange={(e) => setFormData({ ...formData, target_months: parseInt(e.target.value) })}
                />

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
    </div>
  )
}
