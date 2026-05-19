'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'
import { api } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import {
  BookOpen,
  Target,
  ChevronRight,
  Plus,
  Calendar,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import type { Roadmap } from '@/types'
import { ProgressCalendar, CompletionItem } from '@/components/ProgressCalendar'

export default function DashboardPage() {
  const router = useRouter()
  const { user, savedRoadmaps, setSavedRoadmaps } = useStore()
  const [completions, setCompletions] = useState<CompletionItem[]>([])

  useEffect(() => {
    const fetchRoadmaps = async () => {
      if (user) {
        try {
          const { collection, getDocs } = await import('firebase/firestore')
          const { db } = await import('@/lib/firebase')
          
          const roadmapsRef = collection(db, 'users', user.id, 'roadmaps')
          const querySnapshot = await getDocs(roadmapsRef)
          const roadmaps: Roadmap[] = []
          const allCompletions: CompletionItem[] = []
          
          for (const docSnap of querySnapshot.docs) {
            const rData = docSnap.data() as Roadmap
            const progressRef = collection(db, 'users', user.id, 'roadmaps', docSnap.id, 'progress')
            const progressSnapshot = await getDocs(progressRef)
            let completedCount = 0
            
            progressSnapshot.forEach(pDoc => {
              const pData = pDoc.data()
              if (pData.completed) {
                completedCount++
                
                // Find lesson title
                let lessonTitle = 'Completed Lesson'
                for (const phase of rData.generated_roadmap.phases) {
                  for (const chapter of phase.chapters) {
                    for (const lesson of chapter.lessons) {
                      if (lesson.id === pDoc.id) {
                        lessonTitle = lesson.title
                        break
                      }
                    }
                  }
                }

                allCompletions.push({
                  roadmapId: docSnap.id,
                  roadmapTitle: rData.generated_roadmap.overview.title,
                  lessonId: pDoc.id,
                  lessonTitle,
                  completedAt: pData.completed_at || rData.updated_at || rData.created_at || new Date().toISOString()
                })
              }
            })
            
            roadmaps.push({
              ...rData,
              id: docSnap.id,
              completed_lessons_count: completedCount
            } as Roadmap)
          }
          
          // Sort by created_at descending
          roadmaps.sort((a, b) => {
            const timeA = new Date(a.created_at || 0).getTime()
            const timeB = new Date(b.created_at || 0).getTime()
            return timeB - timeA
          })
          
          setSavedRoadmaps(roadmaps)
          
          // Sort completions descending by date
          allCompletions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
          setCompletions(allCompletions)
        } catch (err) {
          console.error("Failed to fetch roadmaps from Firestore", err)
        }
      } else {
        // Handle guest/offline mode from localStorage
        try {
          const allCompletions: CompletionItem[] = []
          const roadmaps: Roadmap[] = []
          
          // Let's see if we can find guest roadmaps in localStorage
          // Usually guest roadmaps are saved under dynamic keys or not, but we can query localStorage keys
          const keys = Object.keys(window.localStorage)
          const roadmapKeys = keys.filter(k => k.startsWith('roadmap_') || k.match(/^[a-zA-Z0-9_-]{20,}$/))
          
          for (const key of keys) {
            if (key.startsWith('progress_dates_')) {
              const roadmapId = key.replace('progress_dates_', '')
              const savedDatesRaw = window.localStorage.getItem(key)
              const savedRoadmapRaw = window.localStorage.getItem(`roadmap_${roadmapId}`)
              
              if (savedDatesRaw && savedRoadmapRaw) {
                const savedDates = JSON.parse(savedDatesRaw) as { [lessonId: string]: string }
                const rData = JSON.parse(savedRoadmapRaw) as Roadmap
                
                Object.entries(savedDates).forEach(([lessonId, completedAt]) => {
                  let lessonTitle = 'Completed Lesson'
                  for (const phase of rData.generated_roadmap.phases) {
                    for (const chapter of phase.chapters) {
                      for (const lesson of chapter.lessons) {
                        if (lesson.id === lessonId) {
                          lessonTitle = lesson.title
                          break
                        }
                      }
                    }
                  }
                  
                  allCompletions.push({
                    roadmapId,
                    roadmapTitle: rData.generated_roadmap.overview.title,
                    lessonId,
                    lessonTitle,
                    completedAt
                  })
                })
              }
            }
          }
          allCompletions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
          setCompletions(allCompletions)
        } catch (e) {
          console.error("Failed to fetch guest completions:", e)
        }
      }
    }
    fetchRoadmaps()
  }, [user, setSavedRoadmaps])

  const totalCompletedLessons = savedRoadmaps.reduce(
    (sum, rm) => sum + (rm.completed_lessons_count || 0),
    0
  )

  const dayStreak = user?.streak || 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-headline font-bold text-on-surface mb-2">
              {user ? `Welcome back, ${user.name}` : 'Your Learning Dashboard'}
            </h1>
            <p className="text-on-surface-variant">
              Track your progress and continue your learning journey
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-on-surface">{savedRoadmaps.length}</div>
                <div className="text-sm text-on-surface-variant">Active Roadmaps</div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-2xl font-bold text-on-surface">{totalCompletedLessons}</div>
                <div className="text-sm text-on-surface-variant">Lessons Completed</div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-tertiary" />
                </div>
                <div className="text-2xl font-bold text-on-surface">{dayStreak}</div>
                <div className="text-sm text-on-surface-variant">Day Streak</div>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <Link href="/generate">
              <Button size="lg" className="group">
                <Sparkles className="w-5 h-5 mr-2" />
                Create New Roadmap
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Progress & Consistency Heatmap Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <ProgressCalendar completions={completions} streak={dayStreak} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-headline font-bold text-on-surface mb-4">Your Roadmaps</h2>

            {savedRoadmaps.length === 0 ? (
              <Card className="text-center py-12">
                <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-on-surface-variant" />
                </div>
                <h3 className="text-lg font-headline font-bold text-on-surface mb-2">
                  No roadmaps yet
                </h3>
                <p className="text-on-surface-variant mb-6 max-w-md mx-auto">
                  Create your first learning roadmap and start your journey towards mastering new skills.
                </p>
                <Link href="/generate">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Roadmap
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedRoadmaps.map((roadmap) => (
                  <RoadmapCard key={roadmap.id} roadmap={roadmap} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  const totalLessons = roadmap.generated_roadmap.overview.total_lessons
  const completedLessons = roadmap.completed_lessons_count || 0
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <Link href={`/roadmap/${roadmap.id}`}>
      <Card hover className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs text-on-surface-variant">
            {roadmap.target_months} months
          </span>
        </div>

        <h3 className="font-headline font-bold text-on-surface mb-2 line-clamp-2">
          {roadmap.goal}
        </h3>

        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
          <span className="capitalize">{roadmap.skill_level}</span>
          <span>&bull;</span>
          <span className="capitalize">{roadmap.learning_style}</span>
          <span>&bull;</span>
          <span>{roadmap.daily_hours}h/day</span>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-on-surface-variant">Progress</span>
            <span className="font-medium text-on-surface">{progress}%</span>
          </div>
          <ProgressBar value={progress} size="sm" />
        </div>

        <div className="text-xs text-on-surface-variant">
          {totalLessons} lessons &bull; {roadmap.generated_roadmap.overview.total_estimated_hours}h total
        </div>
      </Card>
    </Link>
  )
}
