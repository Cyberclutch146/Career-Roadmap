'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProgressBar } from './ui/ProgressBar'
import {
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle,
  ExternalLink,
  PlayCircle,
  BookOpen,
  Github,
  FileText,
} from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import type { Phase, Chapter, Lesson, ResourceItem } from '@/types'

interface ChapterListProps {
  phases: Phase[]
  completedLessons: Set<string>
  onToggleLesson: (lessonId: string) => void
  onSelectLesson: (lesson: Lesson) => void
}

export function ChapterList({
  phases,
  completedLessons,
  onToggleLesson,
  onSelectLesson,
}: ChapterListProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(
    new Set(phases.length > 0 ? [phases[0].id] : [])
  )

  const togglePhase = (phaseId: string) => {
    const newExpanded = new Set(expandedPhases)
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId)
    } else {
      newExpanded.add(phaseId)
    }
    setExpandedPhases(newExpanded)
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return PlayCircle
      case 'documentation':
        return FileText
      case 'github':
        return Github
      case 'article':
        return BookOpen
      default:
        return ExternalLink
    }
  }

  const getTotalLessons = (chapters: Chapter[]) =>
    chapters.reduce((sum, ch) => sum + ch.lessons.length, 0)

  const getCompletedLessons = (chapters: Chapter[]) =>
    chapters.reduce(
      (sum, ch) =>
        sum + ch.lessons.filter((l) => completedLessons.has(l.id)).length,
      0
    )

  return (
    <div className="space-y-4">
      {phases.map((phase, phaseIndex) => {
        const totalLessons = getTotalLessons(phase.chapters)
        const completedCount = getCompletedLessons(phase.chapters)
        const phaseProgress =
          totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
        const isExpanded = expandedPhases.has(phase.id)

        return (
          <div key={phase.id} className="bg-white rounded-xl border border-paper-300 overflow-hidden">
            <button
              onClick={() => togglePhase(phase.id)}
              className="w-full p-6 flex items-center justify-between hover:bg-paper-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    phaseProgress === 100
                      ? 'bg-success text-white'
                      : phaseProgress > 0
                      ? 'bg-accent text-white'
                      : 'bg-paper-200 text-ink-500'
                  }`}
                >
                  {phaseProgress === 100 ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    phaseIndex + 1
                  )}
                </div>
                <div className="text-left">
                  <h3 className="font-serif font-bold text-lg text-ink-900">
                    {phase.name}
                  </h3>
                  <p className="text-sm text-ink-500">{phase.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-ink-700">
                    {completedCount}/{totalLessons} lessons
                  </div>
                  <div className="w-24">
                    <ProgressBar value={phaseProgress} size="sm" />
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-ink-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-ink-400" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-paper-200"
                >
                  <div className="p-6 space-y-4">
                    {phase.chapters.map((chapter) => (
                      <div key={chapter.id} className="bg-paper-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-serif font-bold text-ink-900">
                            {chapter.title}
                          </h4>
                          <span className="text-xs text-ink-500">
                            {chapter.lessons.length} lessons
                          </span>
                        </div>
                        <p className="text-sm text-ink-500 mb-4">{chapter.description}</p>

                        <div className="space-y-2">
                          {chapter.lessons.map((lesson) => {
                            const isCompleted = completedLessons.has(lesson.id)
                            return (
                              <div
                                key={lesson.id}
                                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                                  isCompleted
                                    ? 'bg-success/5 border border-success/20'
                                    : 'bg-white border border-paper-200 hover:border-paper-300'
                                }`}
                              >
                                <button
                                  onClick={() => onToggleLesson(lesson.id)}
                                  className="mt-0.5 flex-shrink-0"
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-ink-300 hover:text-accent transition-colors" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <div
                                    className={`font-medium cursor-pointer ${
                                      isCompleted
                                        ? 'text-ink-500 line-through'
                                        : 'text-ink-900 hover:text-accent'
                                    }`}
                                    onClick={() => onSelectLesson(lesson)}
                                  >
                                    {lesson.title}
                                  </div>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-ink-300 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {formatDuration(lesson.duration_minutes)}
                                    </span>
                                    {lesson.resources.length > 0 && (
                                      <span className="text-xs text-ink-300">
                                        {lesson.resources.length} resources
                                      </span>
                                    )}
                                  </div>
                                  {lesson.resources.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {lesson.resources.slice(0, 3).map((resource, idx) => {
                                        const Icon = getResourceIcon(resource.type)
                                        return (
                                          <a
                                            key={idx}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-paper-100 rounded hover:bg-paper-200 transition-colors text-ink-500 hover:text-ink-900"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <Icon className="w-3 h-3" />
                                            {resource.title}
                                          </a>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
