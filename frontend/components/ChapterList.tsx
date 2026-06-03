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
  Bookmark,
  BookmarkCheck,
  Layers,
} from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import type { Phase, Chapter, Lesson, ResourceItem } from '@/types'

interface ChapterListProps {
  phases: Phase[]
  completedLessons: Set<string>
  bookmarkedLessons: Set<string>
  onToggleLesson: (lessonId: string) => void
  onToggleBookmark: (lessonId: string) => void
  onSelectLesson: (lesson: Lesson) => void
}

export function ChapterList({
  phases,
  completedLessons,
  bookmarkedLessons,
  onToggleLesson,
  onToggleBookmark,
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
        const isComplete = phaseProgress === 100
        const isActive = phaseProgress > 0 && phaseProgress < 100

        return (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: phaseIndex * 0.05 }}
            className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
              isComplete
                ? 'bg-amber-500/[0.03] border-amber-500/20'
                : isExpanded
                ? 'bg-surface-container/80 border-zinc-700/50'
                : 'bg-surface-container/40 border-outline-variant/50 hover:border-outline/50'
            }`}
          >
            {/* Phase Header */}
            <button
              onClick={() => togglePhase(phase.id)}
              className="w-full p-5 sm:p-6 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isComplete
                      ? 'bg-amber-500 text-black shadow-glow'
                      : isActive
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-surface-container-high text-on-surface-variant border border-outline'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="font-headline">{phaseIndex + 1}</span>
                  )}
                </div>
                <div className="text-left">
                  <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface group-hover:text-on-surface transition-colors">
                    {phase.name}
                  </h3>
                  <p className="text-sm text-on-surface-variant line-clamp-1 max-w-md">{phase.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-xs text-on-surface-variant font-medium tabular-nums">
                    {completedCount}/{totalLessons}
                  </span>
                  <div className="w-20">
                    <ProgressBar value={phaseProgress} size="sm" />
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-tertiary transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Mobile progress bar */}
            <div className="px-5 pb-3 sm:hidden">
              <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1.5">
                <span>{completedCount}/{totalLessons} lessons</span>
                <span>{phaseProgress}%</span>
              </div>
              <ProgressBar value={phaseProgress} size="sm" />
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="border-t border-outline-variant/60"
                >
                  <div className="p-4 sm:p-6 space-y-5">
                    {phase.chapters.map((chapter, chapterIdx) => {
                      const chapterCompleted = chapter.lessons.filter(l => completedLessons.has(l.id)).length
                      const chapterTotal = chapter.lessons.length
                      const chapterDone = chapterCompleted === chapterTotal && chapterTotal > 0

                      return (
                        <div
                          key={chapter.id}
                          className="rounded-xl bg-zinc-950/50 border border-outline-variant/40 overflow-hidden"
                        >
                          {/* Chapter Header */}
                          <div className="px-4 sm:px-5 py-4 flex items-center justify-between border-b border-zinc-800/30">
                            <div className="flex items-center gap-3">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                chapterDone
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-zinc-800/80 text-on-surface-variant'
                              }`}>
                                {chapterDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                              </div>
                              <div>
                                <h4 className="font-headline font-semibold text-sm text-on-surface">
                                  {chapter.title}
                                </h4>
                                <p className="text-xs text-tertiary line-clamp-1 max-w-sm mt-0.5">{chapter.description}</p>
                              </div>
                            </div>
                            <span className="text-xs text-tertiary font-medium tabular-nums flex-shrink-0 ml-3">
                              {chapterCompleted}/{chapterTotal}
                            </span>
                          </div>

                          {/* Lessons */}
                          <div className="divide-y divide-zinc-800/30">
                            {chapter.lessons.map((lesson) => {
                              const isCompleted = completedLessons.has(lesson.id)
                              const isBookmarked = bookmarkedLessons.has(lesson.id)
                              return (
                                <motion.div
                                  key={lesson.id}
                                  whileHover={{ y: -2, scale: 1.01 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`flex items-start gap-3 px-4 sm:px-5 py-3.5 transition-all duration-200 group/lesson ${
                                    isCompleted
                                      ? 'bg-amber-500/[0.03]'
                                      : 'hover:bg-zinc-800/20 hover:shadow-glow-secondary'
                                  }`}
                                >
                                  {/* Completion toggle */}
                                  <button
                                    onClick={() => onToggleLesson(lesson.id)}
                                    className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
                                    title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-[18px] h-[18px] text-amber-500" />
                                    ) : (
                                      <Circle className="w-[18px] h-[18px] text-outline group-hover/lesson:text-zinc-500 transition-colors" />
                                    )}
                                  </button>

                                  {/* Lesson content */}
                                  <div className="flex-1 min-w-0">
                                    <div
                                      className={`text-sm font-medium cursor-pointer transition-colors ${
                                        isCompleted
                                          ? 'text-on-surface-variant line-through decoration-zinc-700'
                                          : 'text-on-surface hover:text-amber-400'
                                      }`}
                                      onClick={() => onSelectLesson(lesson)}
                                    >
                                      {lesson.title}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5">
                                      <span className="text-xs text-tertiary flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDuration(lesson.duration_minutes)}
                                      </span>
                                      {lesson.resources.length > 0 && (
                                        <span className="text-xs text-tertiary">
                                          {lesson.resources.length} resources
                                        </span>
                                      )}
                                      {isBookmarked && (
                                        <span className="text-xs text-amber-500/80 flex items-center gap-0.5 font-medium">
                                          <BookmarkCheck className="w-3 h-3" />
                                          Saved
                                        </span>
                                      )}
                                    </div>

                                    {/* Resource badges */}
                                    {lesson.resources.length > 0 && (
                                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                                        {lesson.resources.slice(0, 3).map((resource, idx) => {
                                          const Icon = getResourceIcon(resource.type)
                                          return (
                                            <a
                                              key={idx}
                                              href={resource.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-zinc-800/50 border border-outline-variant/60 rounded-lg hover:border-amber-500/30 hover:text-amber-400 transition-all text-on-surface-variant"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <Icon className="w-3 h-3" />
                                              <span className="truncate max-w-[140px]">{resource.title}</span>
                                            </a>
                                          )
                                        })}
                                      </div>
                                    )}
                                  </div>

                                  {/* Bookmark toggle */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onToggleBookmark(lesson.id)
                                    }}
                                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
                                    className={`mt-0.5 flex-shrink-0 transition-all opacity-0 group-hover/lesson:opacity-100 ${
                                      isBookmarked
                                        ? 'opacity-100 text-amber-500 hover:text-amber-400'
                                        : 'text-outline hover:text-amber-500'
                                    }`}
                                  >
                                    {isBookmarked ? (
                                      <BookmarkCheck className="w-4 h-4" />
                                    ) : (
                                      <Bookmark className="w-4 h-4" />
                                    )}
                                  </button>
                                </motion.div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
