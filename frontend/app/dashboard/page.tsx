'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'
import { api } from '@/lib/api'
import { shouldSyncWithFirestore } from '@/lib/sync'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
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
  Flame,
  ArrowUpRight,
  ChevronDown,
} from 'lucide-react'
import type { Roadmap } from '@/types'
import { ProgressCalendar, CompletionItem } from '@/components/ProgressCalendar'
import { SkillsRadar } from '@/components/SkillsRadar'
import { WeeklyVelocity } from '@/components/WeeklyVelocity'
import { logger } from '@/lib/logger'


export default function DashboardPage() {
  const router = useRouter()
  const { user, savedRoadmaps, setSavedRoadmaps, setCurrentRoadmap } = useStore()
  const [completions, setCompletions] = useState<CompletionItem[]>([])
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('')
  const [completedLessonsByRoadmap, setCompletedLessonsByRoadmap] = useState<Record<string, Set<string>>>({})
  const [showMobileStats, setShowMobileStats] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Clear any active roadmap context when returning to dashboard
  useEffect(() => {
    setCurrentRoadmap(null)
  }, [setCurrentRoadmap])

  useEffect(() => {
    const fetchRoadmaps = async () => {
      const syncWithFirestore = shouldSyncWithFirestore(user)
      if (user && syncWithFirestore) {
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
          return;
        } catch (err) {
          logger.error("Failed to fetch roadmaps from Firestore", err)
        }
      }

      // Handle guest/offline mode from localStorage
      if (typeof window !== 'undefined') {
        try {
          const allCompletions: CompletionItem[] = []
          const roadmapsMap = new Map<string, Roadmap>()
          const completedByRm: Record<string, Set<string>> = {}
          
          const keys = Object.keys(window.localStorage)
          
          // First pass: Load all roadmaps
          for (const key of keys) {
            if (key.startsWith('roadmap_')) {
              const roadmapId = key.replace('roadmap_', '')
              const savedRoadmapRaw = window.localStorage.getItem(key)
              if (savedRoadmapRaw) {
                const rData = JSON.parse(savedRoadmapRaw) as Roadmap
                roadmapsMap.set(roadmapId, {
                  ...rData,
                  id: roadmapId,
                  completed_lessons_count: 0
                } as Roadmap)
                completedByRm[roadmapId] = new Set<string>()
              }
            }
          }

          // Second pass: Load progress dates and update counts
          for (const key of keys) {
            if (key.startsWith('progress_dates_')) {
              const roadmapId = key.replace('progress_dates_', '')
              const savedDatesRaw = window.localStorage.getItem(key)
              const rData = roadmapsMap.get(roadmapId)
              
              if (savedDatesRaw && rData) {
                const savedDates = JSON.parse(savedDatesRaw) as { [lessonId: string]: string }
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
                rData.completed_lessons_count = completedSet.size
              }
            }
          }

          const roadmaps = Array.from(roadmapsMap.values())

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
          logger.error("Failed to fetch guest completions:", e)
        }
      }
    }
    fetchRoadmaps()
  }, [user, setSavedRoadmaps])

  const totalCompletedLessons = savedRoadmaps.reduce(
    (sum, rm) => sum + (rm.completed_lessons_count || 0),
    0
  )

  const calculateStreak = () => {
    if (!completions.length) return 0;
    
    const uniqueDates = Array.from(new Set(completions.map(c => c.completedAt.split('T')[0])))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    if (uniqueDates.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const latestDate = new Date(uniqueDates[0]);
    latestDate.setHours(0, 0, 0, 0);
    
    if (latestDate.getTime() !== today.getTime() && latestDate.getTime() !== yesterday.getTime()) {
      return 0;
    }
    
    let currentDateToCheck = latestDate;
    
    for (const dateStr of uniqueDates) {
      const d = new Date(dateStr);
      d.setHours(0, 0, 0, 0);
      
      if (d.getTime() === currentDateToCheck.getTime()) {
        streak++;
        currentDateToCheck.setDate(currentDateToCheck.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }

  const dayStreak = calculateStreak();

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
    <div className="min-h-screen bg-[#0a0a0b]">
      <Navbar />

      <div className="pt-24 pb-32 md:pb-16">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">

          {/* Header — left-aligned, no card wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <p className="text-tertiary text-xs font-medium uppercase tracking-widest mb-2">Dashboard</p>
            <h1 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface mb-1">
              {user ? `${user.name}` : 'Your Dashboard'}
            </h1>
            <p className="text-on-surface-variant text-sm">
              {savedRoadmaps.length} active roadmap{savedRoadmaps.length !== 1 ? 's' : ''} · {totalCompletedLessons} lessons completed
            </p>
          </motion.div>

          {/* Stats Row — asymmetric, no icons-in-boxes */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8"
          >
            {[
              { value: savedRoadmaps.length, label: 'Roadmaps', sub: 'active' },
              { value: totalCompletedLessons, label: 'Lessons', sub: 'completed' },
              { value: dayStreak, label: 'Day Streak', sub: dayStreak > 0 ? 'active' : 'start today' },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-on-surface font-headline tabular-nums leading-none mb-1.5">
                  {stat.value}
                </div>
                <div className="text-xs text-on-surface-variant">
                  <span className="text-on-surface-variant font-medium">{stat.label}</span>
                  {' '}
                  <span>{stat.sub}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Quick Action — subtle, inline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mb-10"
          >
            <Link href="/generate">
              <button className="group flex items-center gap-2 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
                <Plus className="w-4 h-4" />
                New Roadmap
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
              </button>
            </Link>
          </motion.div>

          {/* Progress Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <div className="sm:hidden mb-4 flex justify-between items-center bg-surface-container/40 border border-outline-variant/60 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Calendar className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-sm font-semibold text-on-surface">Activity History</span>
              </div>
              <button 
                onClick={() => setShowMobileStats(!showMobileStats)}
                className="text-xs px-3.5 py-2 bg-surface-container-high text-on-surface rounded-xl hover:bg-surface-variant font-semibold border border-outline shadow-sm transition-colors active:scale-95"
              >
                {showMobileStats ? 'Hide Stats' : 'View Stats'}
              </button>
            </div>
            <div className={`${showMobileStats ? 'block' : 'hidden'} sm:block`}>
              <ProgressCalendar completions={completions} streak={dayStreak} />
            </div>
          </motion.div>

          {/* Analytics Section */}
          {savedRoadmaps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mb-10"
            >
              {/* Section header with roadmap picker */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                <h2 className="text-lg font-headline font-bold text-on-surface">Analytics</h2>
                {savedRoadmaps.length > 1 && (
                  <div className="relative w-full sm:w-auto">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center justify-between w-full sm:w-auto min-w-[200px] max-w-full px-3.5 py-2 bg-surface-container border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface hover:border-outline transition-colors shadow-sm"
                    >
                      <span className="truncate pr-4 text-left">
                        {(() => {
                          const rm = savedRoadmaps.find(r => r.id === selectedRoadmapId) || savedRoadmaps[0]
                          return rm.generated_roadmap.overview.title || rm.goal || 'Roadmap'
                        })()}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setIsDropdownOpen(false)}
                        />
                        <div className="absolute top-full left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-[350px] bg-surface-container border border-outline rounded-xl shadow-2xl overflow-hidden z-50">
                          <div className="max-h-[300px] overflow-y-auto overscroll-contain">
                            {savedRoadmaps.map((rm) => {
                              const title = rm.generated_roadmap.overview.title || rm.goal || 'Roadmap'
                              return (
                                <button
                                  key={rm.id}
                                  onClick={() => {
                                    setSelectedRoadmapId(rm.id)
                                    setIsDropdownOpen(false)
                                  }}
                                  className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-outline-variant/50 last:border-0 ${
                                    selectedRoadmapId === rm.id 
                                      ? 'bg-amber-500/10 text-amber-500 font-medium' 
                                      : 'text-on-surface hover:bg-surface-container-high'
                                  }`}
                                >
                                  {title}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </>
                    )}
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
                let statusLabel = 'Not Started'
                let statusColor = 'text-on-surface-variant'

                if (completedCount > 0) {
                  if (remainingLessons === 0) {
                    statusLabel = 'Complete'
                    statusColor = 'text-emerald-400'
                    estCompletionText = 'All lessons completed.'
                  } else if (velocity > 0) {
                    const weeksToComplete = remainingLessons / velocity
                    const estCompletionDate = new Date()
                    estCompletionDate.setDate(estCompletionDate.getDate() + Math.ceil(weeksToComplete * 7))
                    const formattedEstDate = estCompletionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

                    if (estCompletionDate <= targetCompletionDate) {
                      statusLabel = 'On Track'
                      statusColor = 'text-emerald-400'
                      estCompletionText = `${roundedVelocity} lessons/week → est. ${formattedEstDate}`
                    } else {
                      statusLabel = 'Behind'
                      statusColor = 'text-amber-400'
                      const msRemaining = targetCompletionDate.getTime() - now.getTime()
                      const weeksRemaining = Math.max(0.5, msRemaining / (7 * 24 * 60 * 60 * 1000))
                      const neededVelocity = Math.round((remainingLessons / weeksRemaining) * 10) / 10
                      estCompletionText = `${roundedVelocity} lessons/week · need ${neededVelocity}/week to hit ${formattedTargetDate}`
                    }
                  }
                } else {
                  const expectedVelocity = Math.round((totalLessons / (targetMonths * 4.34)) * 10) / 10
                  estCompletionText = `Target: ${formattedTargetDate} · ${expectedVelocity} lessons/week recommended`
                }

                return (
                  <div className="space-y-5">
                    {/* Forecast — minimal strip, not a card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 px-5 rounded-xl bg-surface-container/60 border border-outline-variant/40">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`text-xs font-bold uppercase tracking-wider ${statusColor}`}>
                          {statusLabel}
                        </span>
                        <span className="text-outline">|</span>
                        <span className="text-xs text-on-surface-variant truncate">{estCompletionText}</span>
                      </div>
                      <div className="flex items-center gap-5 text-xs text-on-surface-variant flex-shrink-0">
                        <span><span className="text-on-surface font-bold tabular-nums">{remainingLessons}</span> left</span>
                        <span>target <span className="text-on-surface font-medium">{formattedTargetDate}</span></span>
                      </div>
                    </div>

                    {/* Charts side by side */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <SkillsRadar roadmap={selectedRoadmap} completedLessons={completedSet} />
                      <WeeklyVelocity completions={roadmapCompletions} />
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}

          {/* Roadmaps Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-lg font-headline font-bold text-on-surface mb-4">Roadmaps</h2>

            {savedRoadmaps.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-outline-variant py-16 text-center">
                <BookOpen className="w-8 h-8 text-outline mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-on-surface-variant mb-1">No roadmaps yet</h3>
                <p className="text-xs text-tertiary mb-5 max-w-xs mx-auto">
                  Create your first learning roadmap to start tracking your progress.
                </p>
                <Link href="/generate">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1.5" />
                    Create Roadmap
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {savedRoadmaps.map((roadmap, i) => (
                  <RoadmapRow key={roadmap.id} roadmap={roadmap} index={i} />
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

/* Roadmap as a row instead of a card — breaks the repetitive grid pattern */
function RoadmapRow({ roadmap, index }: { roadmap: Roadmap; index: number }) {
  const totalLessons = roadmap.generated_roadmap.overview.total_lessons
  const completedLessons = roadmap.completed_lessons_count || 0
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <Link href={`/roadmap/${roadmap.id}`}>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.04 }}
        className="group flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl bg-surface-container/40 border border-outline-variant/40 hover:border-outline/50 hover:bg-zinc-900/60 transition-all cursor-pointer"
      >
        {/* Progress ring */}
        <div className="relative w-11 h-11 flex-shrink-0">
          <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#27272a" strokeWidth="3" />
            <circle
              cx="22" cy="22" r="18" fill="none"
              stroke={progress === 100 ? '#34d399' : '#f59e0b'}
              strokeWidth="3"
              strokeDasharray={`${(progress / 100) * 113.1} 113.1`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-on-surface-variant tabular-nums">
            {progress}%
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-on-surface group-hover:text-zinc-100 truncate transition-colors">
            {roadmap.goal}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-tertiary">
            <span className="capitalize">{roadmap.skill_level}</span>
            <span className="text-outline-variant">·</span>
            <span>{totalLessons} lessons</span>
            <span className="text-outline-variant">·</span>
            <span>{roadmap.target_months}mo</span>
          </div>
        </div>

        {/* Right side: progress bar + chevron */}
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
          <div className="w-24">
            <ProgressBar value={progress} size="sm" />
          </div>
          <ChevronRight className="w-4 h-4 text-outline group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </motion.div>
    </Link>
  )
}
