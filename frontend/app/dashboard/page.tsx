'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Clock,
} from 'lucide-react'
import type { Roadmap } from '@/types'
import { ProgressCalendar, CompletionItem } from '@/components/ProgressCalendar'
import { SkillsRadar } from '@/components/SkillsRadar'
import { WeeklyVelocity } from '@/components/WeeklyVelocity'

export default function DashboardPage() {
  const router = useRouter()
  const { user, savedRoadmaps, setSavedRoadmaps } = useStore()
  const [completions, setCompletions] = useState<CompletionItem[]>([])
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('')
  const [completedLessonsByRoadmap, setCompletedLessonsByRoadmap] = useState<Record<string, Set<string>>>({})

  useEffect(() => {
    const fetchRoadmaps = async () => {
      if (false && user) {
        try {
          const { collection, getDocs } = await import('firebase/firestore')
          const { db } = await import('@/lib/firebase')
          
          const roadmapsRef = collection(db, 'users', user.id, 'roadmaps')
          const querySnapshot = await getDocs(roadmapsRef)
          const roadmaps: Roadmap[] = []
          const allCompletions: CompletionItem[] = []
          const completedByRm: Record<string, Set<string>> = {}
          
          for (const docSnap of querySnapshot.docs) {
            const rData = docSnap.data() as Roadmap
            const progressRef = collection(db, 'users', user.id, 'roadmaps', docSnap.id, 'progress')
            const progressSnapshot = await getDocs(progressRef)
            let completedCount = 0
            const completedSet = new Set<string>()
            
            progressSnapshot.forEach(pDoc => {
              const pData = pDoc.data()
              if (pData.completed) {
                completedCount++
                completedSet.add(pDoc.id)
                
                // Find lesson title and duration
                let lessonTitle = 'Completed Lesson'
                let durationMinutes = 30 // default fallback
                for (const phase of rData.generated_roadmap.phases) {
                  for (const chapter of phase.chapters) {
                    for (const lesson of chapter.lessons) {
                      if (lesson.id === pDoc.id) {
                        lessonTitle = lesson.title
                        durationMinutes = lesson.duration_minutes || 30
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
                  completedAt: pData.completed_at || rData.updated_at || rData.created_at || new Date().toISOString(),
                  durationMinutes
                })
              }
            })
            
            completedByRm[docSnap.id] = completedSet
            
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
          setCompletedLessonsByRoadmap(completedByRm)
          if (roadmaps.length > 0) {
            setSelectedRoadmapId(roadmaps[0].id)
          }
          
          // Sort completions descending by date
          allCompletions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
          setCompletions(allCompletions)
        } catch (err) {
          console.error("Failed to fetch roadmaps from Firestore", err)
        }
      } else {
        // Handle guest/offline mode from localStorage
        if (typeof window !== 'undefined') {
          try {
            const allCompletions: CompletionItem[] = []
            const roadmaps: Roadmap[] = []
            const completedByRm: Record<string, Set<string>> = {}
            
            const keys = Object.keys(window.localStorage)
            
            for (const key of keys) {
              if (key.startsWith('progress_dates_')) {
                const roadmapId = key.replace('progress_dates_', '')
                const savedDatesRaw = window.localStorage.getItem(key)
                const savedRoadmapRaw = window.localStorage.getItem(`roadmap_${roadmapId}`)
                
                if (savedDatesRaw && savedRoadmapRaw) {
                  const savedDates = JSON.parse(savedDatesRaw) as { [lessonId: string]: string }
                  const rData = JSON.parse(savedRoadmapRaw) as Roadmap
                  const completedSet = new Set<string>()
                  
                  Object.entries(savedDates).forEach(([lessonId, completedAt]) => {
                    completedSet.add(lessonId)
                    
                    let lessonTitle = 'Completed Lesson'
                    let durationMinutes = 30 // default fallback
                    for (const phase of rData.generated_roadmap.phases) {
                      for (const chapter of phase.chapters) {
                        for (const lesson of chapter.lessons) {
                          if (lesson.id === lessonId) {
                            lessonTitle = lesson.title
                            durationMinutes = lesson.duration_minutes || 30
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
                      completedAt,
                      durationMinutes
                    })
                  })

                  completedByRm[roadmapId] = completedSet
                  
                  roadmaps.push({
                    ...rData,
                    id: roadmapId,
                    completed_lessons_count: completedSet.size
                  } as Roadmap)
                }
              } else if (key.startsWith('roadmap_')) {
                const roadmapId = key.replace('roadmap_', '')
                if (!roadmaps.some(r => r.id === roadmapId)) {
                  const savedRoadmapRaw = window.localStorage.getItem(key)
                  if (savedRoadmapRaw) {
                    const rData = JSON.parse(savedRoadmapRaw) as Roadmap
                    roadmaps.push({
                      ...rData,
                      id: roadmapId,
                      completed_lessons_count: 0
                    } as Roadmap)
                    completedByRm[roadmapId] = new Set<string>()
                  }
                }
              }
            }

            roadmaps.sort((a, b) => {
              const timeA = new Date(a.created_at || 0).getTime()
              const timeB = new Date(b.created_at || 0).getTime()
              return timeB - timeA
            })
            
            setSavedRoadmaps(roadmaps)
            setCompletedLessonsByRoadmap(completedByRm)
            if (roadmaps.length > 0) {
              setSelectedRoadmapId(roadmaps[0].id)
            }

            allCompletions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
            setCompletions(allCompletions)
          } catch (e) {
            console.error("Failed to fetch guest completions:", e)
          }
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

  const totalTimeMinutes = completions.reduce(
    (sum, item) => sum + (item.durationMinutes || 0),
    0
  )

  const formatTimeInvested = (minutes: number) => {
    if (minutes <= 0) return '0h'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h > 0 && m > 0) return `${h}h ${m}m`
    if (h > 0) return `${h}h`
    return `${m}m`
  }

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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-on-surface">
                  {formatTimeInvested(totalTimeMinutes)}
                </div>
                <div className="text-sm text-on-surface-variant">Time Invested</div>
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

          {savedRoadmaps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.29 }}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-headline font-bold text-on-surface">Learning Analytics</h2>
                  <p className="text-sm text-on-surface-variant">Analyze your learning habits and forecast completion</p>
                </div>
                {savedRoadmaps.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-on-surface-variant font-medium">Select Roadmap:</span>
                    <select
                      value={selectedRoadmapId}
                      onChange={(e) => setSelectedRoadmapId(e.target.value)}
                      className="px-3 py-1.5 bg-surface-container-high border border-outline-variant/30 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
                    >
                      {savedRoadmaps.map((rm) => (
                        <option key={rm.id} value={rm.id}>
                          {rm.generated_roadmap.overview.title || rm.goal}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {(() => {
                const selectedRoadmap = savedRoadmaps.find(r => r.id === selectedRoadmapId)
                if (!selectedRoadmap) return null

                const totalLessons = selectedRoadmap.generated_roadmap.overview.total_lessons || 0
                const completedCount = completedLessonsByRoadmap[selectedRoadmapId]?.size || 0
                const remainingLessons = Math.max(0, totalLessons - completedCount)
                const completedSet = completedLessonsByRoadmap[selectedRoadmapId] || new Set<string>()

                const createdAt = new Date(selectedRoadmap.created_at || new Date())
                const now = new Date()
                const msSinceCreation = now.getTime() - createdAt.getTime()
                const weeksSinceCreation = Math.max(1, msSinceCreation / (7 * 24 * 60 * 60 * 1000))

                const roadmapCompletions = completions.filter(c => c.roadmapId === selectedRoadmapId)
                const velocity = roadmapCompletions.length / weeksSinceCreation
                const roundedVelocity = Math.round(velocity * 10) / 10

                const targetMonths = selectedRoadmap.target_months || 3
                const targetCompletionDate = new Date(createdAt)
                targetCompletionDate.setMonth(targetCompletionDate.getMonth() + targetMonths)

                const formattedTargetDate = targetCompletionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

                let estCompletionText = ''
                let badgeText = 'Not Started'
                let badgeClass = 'border-outline-variant/30 bg-surface-container text-on-surface-variant'

                if (completedCount > 0) {
                  if (remainingLessons === 0) {
                    badgeText = 'Completed'
                    badgeClass = 'border-success/30 bg-success/10 text-success'
                    estCompletionText = 'Congratulations! You have completed all lessons in this roadmap.'
                  } else if (velocity > 0) {
                    const weeksToComplete = remainingLessons / velocity
                    const estCompletionDate = new Date()
                    estCompletionDate.setDate(estCompletionDate.getDate() + Math.ceil(weeksToComplete * 7))
                    const formattedEstDate = estCompletionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

                    if (estCompletionDate <= targetCompletionDate) {
                      badgeText = 'On Track'
                      badgeClass = 'border-success/30 bg-success/10 text-success'
                      estCompletionText = `At your current pace of ${roundedVelocity} lessons/week, you are on track to complete by ${formattedEstDate} (target: ${formattedTargetDate}).`
                    } else {
                      badgeText = 'Behind Target'
                      badgeClass = 'border-warning/30 bg-warning/10 text-warning'

                      const msRemaining = targetCompletionDate.getTime() - now.getTime()
                      const weeksRemaining = Math.max(0.5, msRemaining / (7 * 24 * 60 * 60 * 1000))
                      const neededVelocity = Math.round((remainingLessons / weeksRemaining) * 10) / 10

                      estCompletionText = `Current pace (${roundedVelocity} lessons/week) estimates completion by ${formattedEstDate}. Target is ${formattedTargetDate}. To finish on time, aim for ${neededVelocity} lessons/week.`
                    }
                  }
                } else {
                  const expectedVelocity = Math.round((totalLessons / (targetMonths * 4.34)) * 10) / 10
                  estCompletionText = `Complete your first lesson to start tracking your velocity. Target completion date is ${formattedTargetDate} (recommended pace: ${expectedVelocity} lessons/week).`
                }

                return (
                  <div className="space-y-6">
                    {/* Forecast Banner */}
                    <div className="glass-card p-5 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-headline font-bold text-base text-on-surface">Completion Forecast</h3>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${badgeClass}`}>
                            {badgeText}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                          {estCompletionText}
                        </p>
                      </div>
                      <div className="flex gap-6 flex-shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-outline-variant/20 pt-4 md:pt-0 md:pl-6 text-left">
                        <div>
                          <div className="text-xs text-on-surface-variant font-medium">Remaining</div>
                          <div className="text-xl font-bold text-on-surface">{remainingLessons} lessons</div>
                        </div>
                        <div>
                          <div className="text-xs text-on-surface-variant font-medium">Target Date</div>
                          <div className="text-xl font-bold text-primary">{formattedTargetDate}</div>
                        </div>
                      </div>
                    </div>

                    {/* Visualizations Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <SkillsRadar roadmap={selectedRoadmap} completedLessons={completedSet} />
                      <WeeklyVelocity completions={roadmapCompletions} />
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
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
