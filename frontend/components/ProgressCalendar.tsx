'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Flame, Award } from 'lucide-react'

export interface CompletionItem {
  roadmapId: string
  roadmapTitle: string
  lessonId: string
  lessonTitle: string
  completedAt: string
  durationMinutes?: number
}

interface ProgressCalendarProps {
  completions: CompletionItem[]
  streak: number
}

export function ProgressCalendar({ completions, streak }: ProgressCalendarProps) {
  // We want to render a grid representing the last 133 days (19 weeks)
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null)
  
  // Group completions by date string (YYYY-MM-DD)
  const completionsByDate: { [dateStr: string]: CompletionItem[] } = {}
  completions.forEach((c) => {
    try {
      const dateStr = new Date(c.completedAt).toISOString().split('T')[0]
      if (!completionsByDate[dateStr]) {
        completionsByDate[dateStr] = []
      }
      completionsByDate[dateStr].push(c)
    } catch (e) {
      // Ignore invalid date strings
    }
  })

  // Generate grid dates (last 18 weeks, starting from Sunday of the week 18 weeks ago)
  const today = new Date()
  const todayDay = today.getDay() // 0 = Sun, 6 = Sat
  
  // Go back 18 full weeks plus the current week
  const daysToShow = 18 * 7 + (todayDay + 1)
  const datesList: Date[] = []
  
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - daysToShow + 1)
  
  // Align to the start of the week (Sunday)
  const startDay = startDate.getDay()
  startDate.setDate(startDate.getDate() - startDay)
  
  const currentDate = new Date(startDate)
  while (currentDate <= today) {
    datesList.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Format a date for display
  const formatDateFull = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-surface-container border-outline-variant/30'
    if (count === 1) return 'bg-primary/20 border-primary/30 hover:scale-110'
    if (count === 2) return 'bg-primary/40 border-primary/50 hover:scale-110'
    if (count === 3) return 'bg-primary/70 text-on-primary border-primary/70 hover:scale-110'
    return 'bg-primary text-on-primary border-primary hover:scale-110'
  }

  // Group dates by week (columns)
  const weeks: Date[][] = []
  let currentWeek: Date[] = []
  datesList.forEach((date) => {
    currentWeek.push(date)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  const selectedCompletions = selectedDateStr ? completionsByDate[selectedDateStr] || [] : []

  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Progress & Consistency History
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Hover over dates to see completed lessons, click to view details.
          </p>
        </div>

        <div className="flex flex-row flex-wrap items-center gap-2.5 sm:gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2 bg-warning/10 border border-warning/20 px-3 py-1.5 rounded-full">
            <Flame className="w-5 h-5 text-warning fill-warning animate-pulse" />
            <span className="text-sm font-medium text-on-surface">
              <strong className="text-warning font-bold">{streak} Day</strong> Streak
            </span>
          </div>

          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-on-surface">
              <strong className="text-primary font-bold">{completions.length}</strong> Total
            </span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid container */}
      <div className="flex justify-between items-end mb-2">
        <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest sm:hidden">Swipe to view history &rarr;</p>
      </div>
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="min-w-max flex gap-1.5 md:gap-2 justify-start">
          {/* Weekday labels */}
          <div className="flex flex-col gap-1 md:gap-1.5 text-[9px] md:text-[10px] text-on-surface-variant pr-2 select-none font-medium pt-0.5">
            <span className="h-3 md:h-4 flex items-center">Sun</span>
            <span className="h-3 md:h-4 flex items-center"></span>
            <span className="h-3 md:h-4 flex items-center">Tue</span>
            <span className="h-3 md:h-4 flex items-center"></span>
            <span className="h-3 md:h-4 flex items-center">Thu</span>
            <span className="h-3 md:h-4 flex items-center"></span>
            <span className="h-3 md:h-4 flex items-center">Sat</span>
          </div>

          {/* Grid columns */}
          <div className="flex gap-1 md:gap-1.5">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1 md:gap-1.5">
                {week.map((date) => {
                  const dateStr = date.toISOString().split('T')[0]
                  const items = completionsByDate[dateStr] || []
                  const count = items.length
                  const isSelected = selectedDateStr === dateStr
                  const isToday = new Date().toISOString().split('T')[0] === dateStr

                  return (
                    <div key={dateStr} className="relative group">
                      <button
                        onClick={() => setSelectedDateStr(isSelected ? null : dateStr)}
                        className={`w-3 h-3 md:w-4 md:h-4 rounded-[2px] md:rounded-[4px] border transition-all duration-150 ${getHeatmapColor(count)} ${
                          isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                        } ${isToday ? 'border-primary border-2' : 'border-outline-variant/30'}`}
                        title={`${count} lessons completed on ${formatDateFull(date)}`}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 pointer-events-none">
                        <div className="bg-surface-container-high text-on-surface text-[11px] font-medium rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg border border-outline-variant/30">
                          <p className="font-bold">{formatDateFull(date)}</p>
                          <p className="text-on-surface-variant">{count} {count === 1 ? 'lesson' : 'lessons'} completed</p>
                        </div>
                        <div className="w-2.5 h-2.5 bg-surface-container-high rotate-45 absolute -bottom-1.25 left-1/2 -translate-x-1/2 border-r border-b border-outline-variant/30" />
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-end items-center gap-1 md:gap-1.5 text-[10px] md:text-xs text-on-surface-variant mt-3 pr-4">
        <span>Less</span>
        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-[2px] md:rounded-[3px] bg-surface-container border border-outline-variant/30" />
        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-[2px] md:rounded-[3px] bg-primary/20 border border-primary/30" />
        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-[2px] md:rounded-[3px] bg-primary/40 border border-primary/50" />
        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-[2px] md:rounded-[3px] bg-primary/70 border border-primary/70" />
        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-[2px] md:rounded-[3px] bg-primary border border-primary" />
        <span>More</span>
      </div>

      {/* Selected day completions */}
      <AnimatePresence mode="wait">
        {selectedDateStr && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 border-t border-outline-variant/20 pt-5"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm text-on-surface">
                Activity on {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>
              <button 
                onClick={() => setSelectedDateStr(null)}
                className="text-xs text-primary hover:underline font-medium"
              >
                Clear selection
              </button>
            </div>

            {selectedCompletions.length === 0 ? (
              <p className="text-sm text-on-surface-variant py-2">No learning activity logged on this day.</p>
            ) : (
              <div className="space-y-2.5">
                {selectedCompletions.map((item, idx) => (
                  <motion.div
                    key={`${item.lessonId}-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 hover:border-primary/30 transition-all duration-150"
                  >
                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm text-on-surface leading-snug">
                        {item.lessonTitle}
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Roadmap: <span className="font-medium text-primary">{item.roadmapTitle}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
