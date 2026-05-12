'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useStore } from '@/store'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { ChapterList } from '@/components/ChapterList'
import { ResourcePanel } from '@/components/ResourcePanel'
import { AIMentor } from '@/components/AIMentor'
import { Navbar } from '@/components/Navbar'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Target,
  ChevronRight,
  Calendar,
  Brain,
  MessageSquare,
  Download,
  Share2,
  CheckCircle2,
  Bookmark
} from 'lucide-react'
import type { Roadmap, Phase, Chapter, Lesson } from '@/types'

export default function RoadmapPage() {
  const params = useParams()
  const router = useRouter()
  const { currentRoadmap, setCurrentRoadmap } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [showMentor, setShowMentor] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [showResources, setShowResources] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)

  useEffect(() => {
    const loadRoadmap = async () => {
      const roadmapId = params.id as string

      if (currentRoadmap && currentRoadmap.id === roadmapId) {
        setRoadmap(currentRoadmap)
        setIsLoading(false)
        return
      }

      try {
        const response = await api.get<Roadmap>(`/api/roadmaps/${roadmapId}`)
        setRoadmap(response.data)
        setCurrentRoadmap(response.data)
      } catch (error) {
        console.error('Failed to load roadmap:', error)
        router.push('/generate')
      } finally {
        setIsLoading(false)
      }
    }

    loadRoadmap()
  }, [params.id, currentRoadmap, setCurrentRoadmap, router])

  const toggleLessonComplete = async (lessonId: string) => {
    if (!roadmap) return

    const newCompleted = new Set(completedLessons)
    const isCompleted = newCompleted.has(lessonId)

    if (isCompleted) {
      newCompleted.delete(lessonId)
    } else {
      newCompleted.add(lessonId)
    }
    setCompletedLessons(newCompleted)

    try {
      await api.put(`/api/roadmaps/${roadmap.id}/progress`, {
        lesson_id: lessonId,
        completed: !isCompleted
      })
    } catch (error) {
      setCompletedLessons(newCompleted)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink-500">Loading your roadmap...</p>
        </div>
      </div>
    )
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-paper-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-ink-900 mb-2">Roadmap not found</h2>
          <p className="text-ink-500 mb-4">The roadmap you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/generate">
            <Button>Create New Roadmap</Button>
          </Link>
        </div>
      </div>
    )
  }

  const generatedRoadmap = roadmap.generated_roadmap
  const totalLessons = generatedRoadmap.overview.total_lessons
  const completedCount = completedLessons.size
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen bg-paper-50">
      <Navbar />

      <div className="pt-16 flex">
        <aside className="fixed left-0 top-16 bottom-0 w-72 bg-white border-r border-paper-300 overflow-y-auto hidden lg:block">
          <div className="p-6">
            <Link href="/generate" className="flex items-center gap-2 text-ink-500 hover:text-ink-900 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Generator
            </Link>

            <div className="mb-6">
              <h2 className="font-serif font-bold text-lg text-ink-900 mb-2">
                {generatedRoadmap.overview.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-ink-500">
                <Target className="w-4 h-4" />
                <span>{roadmap.target_months} months</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-ink-500">Progress</span>
                <span className="font-medium text-ink-900">{progressPercent}%</span>
              </div>
              <ProgressBar value={progressPercent} size="md" />
            </div>

            <nav className="space-y-2">
              <a href="#overview" className="block px-3 py-2 text-sm text-ink-500 hover:text-ink-900 hover:bg-paper-50 rounded-lg">
                Overview
              </a>
              <a href="#phases" className="block px-3 py-2 text-sm text-ink-500 hover:text-ink-900 hover:bg-paper-50 rounded-lg">
                Learning Phases
              </a>
              <a href="#resources" className="block px-3 py-2 text-sm text-ink-500 hover:text-ink-900 hover:bg-paper-50 rounded-lg">
                Resources
              </a>
              <a href="#revision" className="block px-3 py-2 text-sm text-ink-500 hover:text-ink-900 hover:bg-paper-50 rounded-lg">
                Revision Strategy
              </a>
              <a href="#interview" className="block px-3 py-2 text-sm text-ink-500 hover:text-ink-900 hover:bg-paper-50 rounded-lg">
                Interview Prep
              </a>
            </nav>
          </div>
        </aside>

        <main className="flex-1 lg:ml-72">
          <div className="max-w-reading mx-auto px-4 sm:px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 text-sm text-ink-500 mb-4">
                <Link href="/generate" className="hover:text-ink-900">Generate</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-ink-900">Roadmap</span>
              </div>

              <h1 className="text-3xl font-serif font-bold text-ink-900 mb-4">
                {generatedRoadmap.overview.title}
              </h1>
              <p className="text-ink-500 text-lg leading-relaxed">
                {generatedRoadmap.overview.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid sm:grid-cols-4 gap-4 mb-8"
            >
              <Card className="text-center p-4">
                <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="font-bold text-xl text-ink-900">{generatedRoadmap.overview.total_estimated_hours}h</div>
                <div className="text-xs text-ink-500">Total Hours</div>
              </Card>
              <Card className="text-center p-4">
                <BookOpen className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="font-bold text-xl text-ink-900">{totalLessons}</div>
                <div className="text-xs text-ink-500">Lessons</div>
              </Card>
              <Card className="text-center p-4">
                <Target className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="font-bold text-xl text-ink-900">{generatedRoadmap.phases.length}</div>
                <div className="text-xs text-ink-500">Phases</div>
              </Card>
              <Card className="text-center p-4">
                <CheckCircle2 className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="font-bold text-xl text-ink-900">{completedCount}</div>
                <div className="text-xs text-ink-500">Completed</div>
              </Card>
            </motion.div>

            <motion.div
              id="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Learning Objectives</CardTitle>
                  <CardDescription>Key goals you&apos;ll achieve by the end of this roadmap</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {generatedRoadmap.learning_objectives.map((obj) => (
                      <li key={obj.id} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          obj.mastered ? 'bg-success text-white' : 'bg-paper-200'
                        }`}>
                          {obj.mastered && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className="text-ink-700">{obj.objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              id="phases"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-serif font-bold text-ink-900 mb-6">Learning Phases</h2>
              <ChapterList
                phases={generatedRoadmap.phases}
                completedLessons={completedLessons}
                onToggleLesson={toggleLessonComplete}
                onSelectLesson={setSelectedLesson}
              />
            </motion.div>

            <motion.div
              id="resources"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Curated Resources</CardTitle>
                  <CardDescription>Hand-picked resources to support your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResourcePanel resources={generatedRoadmap.resources} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              id="revision"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Revision Strategy</CardTitle>
                  <CardDescription>How to effectively revise and retain what you learn</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-ink-700 leading-relaxed whitespace-pre-wrap">
                    {generatedRoadmap.revision_strategy}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              id="interview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Interview Preparation</CardTitle>
                  <CardDescription>Guidance for technical interviews and assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-ink-700 leading-relaxed whitespace-pre-wrap">
                    {generatedRoadmap.interview_preparation}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Final Assessment</CardTitle>
                  <CardDescription>How to validate your mastery of the subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-ink-700 leading-relaxed whitespace-pre-wrap">
                    {generatedRoadmap.final_assessment}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        <button
          onClick={() => setShowMentor(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-white rounded-full shadow-lifted flex items-center justify-center hover:bg-accent-dark transition-colors z-40"
        >
          <Brain className="w-6 h-6" />
        </button>

        <AnimatePresence>
          {showMentor && (
            <AIMentor
              roadmap={roadmap}
              onClose={() => setShowMentor(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
