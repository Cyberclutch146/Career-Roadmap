'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useStore } from '@/store'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
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
  FolderPlus
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

  return (
    <div className="min-h-screen bg-paper-50 flex flex-col justify-between">
      <Navbar />

      <div className="pt-24 pb-16 flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
              <Compass className="w-4 h-4" />
              Community Library
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink-900 mb-4">
              Discover Learning Roadmaps
            </h1>
            <p className="text-ink-500 text-lg max-w-2xl mx-auto">
              Explore customized, AI-generated roadmaps shared by other learners. Add them to your library to track your own progress.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-paper-300 rounded-2xl p-5 mb-8 shadow-sm grid md:grid-cols-12 gap-4 items-end"
          >
            <div className="md:col-span-6 space-y-2">
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Search Goals</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
                <Input
                  className="pl-9"
                  placeholder="e.g. Full Stack Developer, React, DSA..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Difficulty</label>
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
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Duration</label>
              <Select
                options={[
                  { value: 'all', label: 'All Durations' },
                  { value: 'short', label: 'Short (<= 3 Months)' },
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
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-ink-400 text-sm">Loading roadmaps...</span>
            </div>
          ) : filteredRoadmaps.length === 0 ? (
            <Card className="text-center py-16">
              <div className="w-16 h-16 bg-paper-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-ink-300" />
              </div>
              <h3 className="text-lg font-serif font-bold text-ink-900 mb-2">No roadmaps found</h3>
              <p className="text-ink-500 max-w-md mx-auto">
                We couldn&apos;t find any public roadmaps matching your filters. Try adjusting your search query.
              </p>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoadmaps.map(roadmap => {
                const totalLessons = roadmap.generated_roadmap.overview.total_lessons
                const hours = roadmap.generated_roadmap.overview.total_estimated_hours
                const isCloned = clonedRoadmaps.has(roadmap.id)

                return (
                  <Link key={roadmap.id} href={`/roadmap/${roadmap.id}`}>
                    <Card hover className="h-full flex flex-col justify-between p-6">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-accent" />
                          </div>
                          <span className="text-xs text-ink-400 font-medium px-2 py-1 bg-paper-100 rounded border border-paper-200">
                            {roadmap.target_months} Months
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-ink-900 mb-2 text-base line-clamp-2">
                          {roadmap.goal}
                        </h3>

                        <p className="text-xs text-ink-500 line-clamp-3 mb-4 leading-relaxed">
                          {roadmap.generated_roadmap.overview.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-5">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-accent/5 text-accent border border-accent/10 rounded">
                            {roadmap.skill_level}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-paper-100 text-ink-500 border border-paper-200 rounded">
                            {roadmap.learning_style}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-paper-100 text-ink-500 border border-paper-200 rounded">
                            {roadmap.daily_hours}h/day
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-paper-200 flex items-center justify-between gap-4">
                        <span className="text-xs text-ink-400 font-semibold">
                          {totalLessons} lessons &bull; {hours}h
                        </span>

                        <Button
                          variant={isCloned ? 'secondary' : 'primary'}
                          size="sm"
                          disabled={isCloned || cloningId === roadmap.id}
                          onClick={(e) => handleCloneRoadmap(e, roadmap)}
                          className="text-xs gap-1.5 py-1.5"
                        >
                          {isCloned ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-success" />
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
                        </Button>
                      </div>
                    </Card>
                  </Link>
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
