'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import {
  BookOpen,
  Clock,
  Target,
  ChevronRight,
  Plus,
  Calendar,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import type { Roadmap } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const { user, savedRoadmaps } = useStore()

  return (
    <div className="min-h-screen bg-paper-50">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-serif font-bold text-ink-900 mb-2">
              {user ? `Welcome back, ${user.name}` : 'Your Learning Dashboard'}
            </h1>
            <p className="text-ink-500">
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
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-ink-900">{savedRoadmaps.length}</div>
                <div className="text-sm text-ink-500">Active Roadmaps</div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <div className="text-2xl font-bold text-ink-900">0</div>
                <div className="text-sm text-ink-500">Lessons Completed</div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-warning" />
                </div>
                <div className="text-2xl font-bold text-ink-900">0</div>
                <div className="text-sm text-ink-500">Day Streak</div>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-serif font-bold text-ink-900 mb-4">Your Roadmaps</h2>

            {savedRoadmaps.length === 0 ? (
              <Card className="text-center py-12">
                <div className="w-16 h-16 bg-paper-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-ink-300" />
                </div>
                <h3 className="text-lg font-serif font-bold text-ink-900 mb-2">
                  No roadmaps yet
                </h3>
                <p className="text-ink-500 mb-6 max-w-md mx-auto">
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
  const completedLessons = 0
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <Link href={`/roadmap/${roadmap.id}`}>
      <Card hover className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-accent" />
          </div>
          <span className="text-xs text-ink-300">
            {roadmap.target_months} months
          </span>
        </div>

        <h3 className="font-serif font-bold text-ink-900 mb-2 line-clamp-2">
          {roadmap.goal}
        </h3>

        <div className="flex items-center gap-2 text-xs text-ink-500 mb-4">
          <span className="capitalize">{roadmap.skill_level}</span>
          <span>&bull;</span>
          <span className="capitalize">{roadmap.learning_style}</span>
          <span>&bull;</span>
          <span>{roadmap.daily_hours}h/day</span>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-ink-500">Progress</span>
            <span className="font-medium text-ink-900">{progress}%</span>
          </div>
          <ProgressBar value={progress} size="sm" />
        </div>

        <div className="text-xs text-ink-300">
          {totalLessons} lessons &bull; {roadmap.generated_roadmap.overview.total_estimated_hours}h total
        </div>
      </Card>
    </Link>
  )
}
