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
    if (count === 0) return 'bg-surface-container border-border/50'
    if (count === 1) return 'bg-primary-light/30 border-primary/20 hover:scale-110'
    if (count === 2) return 'bg-primary-light/60 border-primary/40 hover:scale-110'
    if (count === 3) return 'bg-primary/80 text-white border-primary/60 hover:scale-110'
    return 'bg-primary text-white border-primary hover:scale-110'
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
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-on-surface flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Progress & Consistency History
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Hover over dates to see completed lessons, click to view details.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-warning-light/10 border border-warning/20 px-3 py-1.5 rounded-full">
            <Flame className="w-5 h-5 text-warning fill-warning animate-pulse" />
            <span className="text-sm font-medium text-on-surface">
              <strong className="text-warning-dark font-bold">{streak} Day</strong> Streak
            </span>
          </div>

          <div className="flex items-center gap-2 bg-primary-light/10 border border-primary/20 px-3 py-1.5 rounded-full">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-on-surface">
              <strong className="text-primary font-bold">{completions.length}</strong> Total
            </span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid container */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[640px] flex gap-2 justify-center">
          {/* Weekday labels */}
          <div className="flex flex-col justify-between text-[10px] text-on-surface-variant pr-2 pt-6 pb-2 h-[120px] select-none font-medium">
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>

          {/* Grid columns */}
          <div className="flex gap-1.5">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1.5">
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
                        className={`w-4.5 h-4.5 rounded-[4px] border transition-all duration-150 ${getHeatmapColor(count)} ${
                          isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                        } ${isToday ? 'border-primary-dark border-2' : 'border-border'}`}
                        title={`${count} lessons completed on ${formatDateFull(date)}`}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 pointer-events-none">
                        <div className="bg-surface-container text-on-surface text-[11px] font-medium rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg border border-border">
                          <p className="font-bold">{formatDateFull(date)}</p>
                          <p className="text-on-surface-variant">{count} {count === 1 ? 'lesson' : 'lessons'} completed</p>
                        </div>
                        <div className="w-2.5 h-2.5 bg-surface-container rotate-45 absolute -bottom-1.25 left-1/2 -translate-x-1/2 border-r border-b border-border" />
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
      <div className="flex justify-end items-center gap-1.5 text-xs text-on-surface-variant mt-3 pr-4">
        <span>Less</span>
        <div className="w-3 h-3 rounded-[3px] bg-surface-container border border-border" />
        <div className="w-3 h-3 rounded-[3px] bg-primary-light/30 border border-primary/20" />
        <div className="w-3 h-3 rounded-[3px] bg-primary-light/60 border border-primary/40" />
        <div className="w-3 h-3 rounded-[3px] bg-primary/80 border border-primary/60" />
        <div className="w-3 h-3 rounded-[3px] bg-primary border border-primary" />
        <span>More</span>
      </div>

      {/* Selected day completions */}
      <AnimatePresence mode="wait">
        {selectedDateStr && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 border-t border-border pt-5"
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
                    className="flex items-start gap-3 p-3 bg-surface rounded-xl border border-border hover:border-primary-light/30 transition-all duration-150"
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
