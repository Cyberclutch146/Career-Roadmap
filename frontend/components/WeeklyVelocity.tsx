'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card'
import type { CompletionItem } from './ProgressCalendar'

interface WeeklyVelocityProps {
  completions: CompletionItem[]
}

export function WeeklyVelocity({ completions }: WeeklyVelocityProps) {
  const today = new Date()
  const data = []

  // Generate data for the last 8 weeks
  for (let i = 7; i >= 0; i--) {
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() - i * 7)
    
    // Find Sunday of that week
    const dayOfWeek = targetDate.getDay()
    const sunday = new Date(targetDate)
    sunday.setDate(targetDate.getDate() - dayOfWeek)
    sunday.setHours(0, 0, 0, 0)

    const saturday = new Date(sunday)
    saturday.setDate(sunday.getDate() + 6)
    saturday.setHours(23, 59, 59, 999)

    const weekLabel = sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const rangeLabel = `${weekLabel} - ${saturday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`

    // Count completions within this week range
    const count = completions.filter((c) => {
      try {
        const compTime = new Date(c.completedAt).getTime()
        return compTime >= sunday.getTime() && compTime <= saturday.getTime()
      } catch (e) {
        return false
      }
    }).length

    data.push({
      name: weekLabel,
      completions: count,
      rangeLabel,
    })
  }

  const hasCompletions = completions.length > 0

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Weekly Study Velocity</CardTitle>
        <CardDescription>Lessons completed per week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex items-center justify-center">
          {!hasCompletions ? (
            <div className="text-center text-on-surface-variant/60 text-sm py-32">
              No completion data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'var(--on-surface-variant)', fontSize: 11 }} 
                  stroke="var(--outline-variant)"
                />
                <YAxis 
                  tick={{ fill: 'var(--on-surface-variant)', fontSize: 11 }} 
                  stroke="var(--outline-variant)"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface-container)',
                    borderColor: 'var(--outline-variant)',
                    borderRadius: '0.75rem',
                    color: 'var(--on-surface)',
                  }}
                  cursor={{ fill: 'var(--primary)', fillOpacity: 0.05 }}
                  labelFormatter={(_, items) => {
                    if (items && items.length > 0) {
                      return items[0].payload.rangeLabel
                    }
                    return ''
                  }}
                  formatter={(value: any) => [`${value} ${value === 1 ? 'lesson' : 'lessons'}`, 'Velocity']}
                />
                <Bar 
                  dataKey="completions" 
                  fill="var(--primary)" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
