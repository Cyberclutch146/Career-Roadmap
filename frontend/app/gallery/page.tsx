'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useStore } from '@/store'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import {
  Search,
  Sparkles,
  BookOpen,
  Target,
  Clock,
  Compass,
  ArrowRight,
  Bookmark,
  CheckCircle,
  FolderPlus,
  Layers,
  TrendingUp,
  Zap,
} from 'lucide-react'
import type { Roadmap } from '@/types'

export default function GalleryPage() {
  const { user } = useStore()
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<Roadmap[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedDuration, setSelectedDuration] = useState('all')
  const [clonedRoadmaps, setClonedRoadmaps] = useState<Set<string>>(new Set())
  const [cloningId, setCloningId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPublicRoadmaps = async () => {
      try {
        const { collection, getDocs } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')

        const publicRef = collection(db, 'public_roadmaps')
        const snapshot = await getDocs(publicRef)
        const items: Roadmap[] = []
        
        snapshot.forEach(docSnap => {
          items.push({
            ...docSnap.data(),
            id: docSnap.id
          } as Roadmap)
        })

        // Sort by created_at descending or fallback to title
        items.sort((a, b) => {
          const timeA = new Date(a.created_at || 0).getTime()
          const timeB = new Date(b.created_at || 0).getTime()
          return timeB - timeA
        })

        setRoadmaps(items)
        setFilteredRoadmaps(items)
      } catch (err) {
        console.error("Failed to load public roadmaps:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublicRoadmaps()
  }, [])

  // Handle Filtering
  useEffect(() => {
    let result = roadmaps

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r => 
        r.goal.toLowerCase().includes(q) || 
        r.generated_roadmap.overview.title.toLowerCase().includes(q) ||
        r.generated_roadmap.overview.description.toLowerCase().includes(q)
      )
    }

    if (selectedDifficulty !== 'all') {
      result = result.filter(r => r.skill_level === selectedDifficulty)
    }

    if (selectedDuration !== 'all') {
      if (selectedDuration === 'short') {
        result = result.filter(r => r.target_months <= 3)
      } else if (selectedDuration === 'medium') {
        result = result.filter(r => r.target_months > 3 && r.target_months <= 6)
      } else if (selectedDuration === 'long') {
        result = result.filter(r => r.target_months > 6)
      }
    }

    setFilteredRoadmaps(result)
  }, [searchQuery, selectedDifficulty, selectedDuration, roadmaps])

  const handleCloneRoadmap = async (e: React.MouseEvent, roadmap: Roadmap) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      alert("Please sign in to save roadmaps to your library.")
      return
    }

    setCloningId(roadmap.id)
    try {
      const { doc, setDoc } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')

      // Save to user's personal roadmaps collection
      const userRoadmapRef = doc(db, 'users', user.id, 'roadmaps', roadmap.id)
      const cloned: Roadmap = {
        ...roadmap,
        user_id: user.id,
        is_public: false, // private copy by default
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      await setDoc(userRoadmapRef, cloned)
      setClonedRoadmaps(prev => new Set([...prev, roadmap.id]))
      alert("Roadmap cloned to your library successfully!")
    } catch (err) {
      console.error("Failed to clone roadmap:", err)
      alert("Failed to clone roadmap. Please try again.")
    } finally {
      setCloningId(null)
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'intermediate': return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      case 'advanced': return 'text-red-400 bg-red-500/10 border-red-500/20'
      default: return 'text-on-surface-variant bg-surface-container-high border-outline'
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col justify-between">
      <Navbar />

      <div className="pt-24 pb-16 flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 text-amber-400 rounded-full text-xs font-semibold mb-5 border border-amber-500/20">
              <Compass className="w-3.5 h-3.5" />
              Community Library
            </div>
            <h1 className="text-3xl sm:text-5xl font-headline font-bold text-on-surface mb-4 tracking-tight">
              Discover Learning Roadmaps
            </h1>
            <p className="text-on-surface-variant text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Explore customized, AI-generated roadmaps shared by other learners.
              Add them to your library to track your own progress.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-surface-container/60 border border-outline-variant/50 p-5 mb-10 grid md:grid-cols-12 gap-4 items-end"
          >
            <div className="md:col-span-6 space-y-2">
              <label className="text-[10px] font-semibold text-tertiary uppercase tracking-widest">Search Goals</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                <Input
                  className="pl-10"
                  placeholder="e.g. Full Stack Developer, React, DSA..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-semibold text-tertiary uppercase tracking-widest">Difficulty</label>
              <Select
                options={[
                  { value: 'all', label: 'All Levels' },
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' }
                ]}
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-semibold text-tertiary uppercase tracking-widest">Duration</label>
              <Select
                options={[
                  { value: 'all', label: 'All Durations' },
                  { value: 'short', label: 'Short (≤ 3 Months)' },
                  { value: 'medium', label: 'Medium (4-6 Months)' },
                  { value: 'long', label: 'Long (7+ Months)' }
                ]}
                value={selectedDuration}
                onChange={e => setSelectedDuration(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Roadmap Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              <span className="text-tertiary text-sm">Discovering roadmaps...</span>
            </div>
          ) : filteredRoadmaps.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-outline-variant/50 bg-zinc-900/30 text-center py-20 px-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mx-auto mb-5">
                <BookOpen className="w-7 h-7 text-tertiary" />
              </div>
              <h3 className="text-lg font-headline font-bold text-on-surface mb-2">No roadmaps found</h3>
              <p className="text-tertiary max-w-md mx-auto text-sm leading-relaxed mb-6">
                We couldn&apos;t find any public roadmaps matching your filters. Try adjusting your search query or be the first to share one!
              </p>
              <Link href="/generate">
                <Button size="sm" className="gap-2">
                  <Zap className="w-4 h-4" />
                  Create a Roadmap
                </Button>
              </Link>
            </motion.div>
          ) : (
            /* Roadmap Cards Grid */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRoadmaps.map((roadmap, index) => {
                const totalLessons = roadmap.generated_roadmap.overview.total_lessons
                const hours = roadmap.generated_roadmap.overview.total_estimated_hours
                const phases = roadmap.generated_roadmap.phases.length
                const isCloned = clonedRoadmaps.has(roadmap.id)

                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link href={`/roadmap/${roadmap.id}`}>
                      <div className="group h-full flex flex-col justify-between rounded-2xl bg-zinc-900/50 border border-outline-variant/50 hover:border-zinc-700/60 p-5 transition-all duration-300 hover:shadow-[0_4px_24px_-8px_rgba(245,158,11,0.08)]">
                        <div>
                          {/* Top row: icon + duration badge */}
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center group-hover:bg-amber-500/15 transition-colors">
                              <Target className="w-5 h-5 text-amber-500" />
                            </div>
                            <span className="text-[10px] text-on-surface-variant font-semibold px-2.5 py-1 bg-zinc-800/60 border border-outline-variant rounded-lg uppercase tracking-wider">
                              {roadmap.target_months}mo
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-headline font-bold text-on-surface mb-2 text-base line-clamp-2 group-hover:text-zinc-100 transition-colors">
                            {roadmap.goal}
                          </h3>

                          {/* Description */}
                          <p className="text-xs text-tertiary line-clamp-2 mb-4 leading-relaxed">
                            {roadmap.generated_roadmap.overview.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded-md ${getDifficultyColor(roadmap.skill_level)}`}>
                              {roadmap.skill_level}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-zinc-800/50 text-on-surface-variant border border-outline-variant rounded-md">
                              {roadmap.learning_style}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-zinc-800/50 text-on-surface-variant border border-outline-variant rounded-md">
                              {roadmap.daily_hours}h/day
                            </span>
                          </div>
                        </div>

                        {/* Footer: stats + save button */}
                        <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 text-xs text-tertiary">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              {phases} phases
                            </span>
                            <span className="text-outline-variant">&middot;</span>
                            <span>{totalLessons} lessons</span>
                            <span className="text-outline-variant">&middot;</span>
                            <span>{hours}h</span>
                          </div>

                          <button
                            disabled={isCloned || cloningId === roadmap.id}
                            onClick={(e) => handleCloneRoadmap(e, roadmap)}
                            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                              isCloned
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                                : cloningId === roadmap.id
                                ? 'bg-surface-container-high text-on-surface-variant cursor-wait'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 active:scale-95'
                            }`}
                          >
                            {isCloned ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                Saved
                              </>
                            ) : cloningId === roadmap.id ? (
                              'Saving...'
                            ) : (
                              <>
                                <FolderPlus className="w-3.5 h-3.5" />
                                Save
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
