'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card'
import type { Roadmap } from '@/types'
import { truncateText } from '@/lib/utils'

interface SkillsRadarProps {
  roadmap: Roadmap
  completedLessons: Set<string>
}

export function SkillsRadar({ roadmap, completedLessons }: SkillsRadarProps) {
  const data = roadmap.generated_roadmap.phases.map((phase) => {
    let totalPhaseLessons = 0
    let completedPhaseLessons = 0

    phase.chapters.forEach(chapter => {
      chapter.lessons.forEach(lesson => {
        totalPhaseLessons++
        if (completedLessons.has(lesson.id)) {
          completedPhaseLessons++
        }
      })
    })

    const percentage = totalPhaseLessons > 0 
      ? Math.round((completedPhaseLessons / totalPhaseLessons) * 100) 
      : 0

    return {
      subject: truncateText(phase.name, 15),
      fullSubject: phase.name,
      A: percentage,
      fullMark: 100,
    }
  })

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Skills Mastery</CardTitle>
        <CardDescription>Progress across learning phases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[220px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="55%" data={data}>
              <PolarGrid stroke="var(--outline-variant)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: 'var(--on-surface-variant)', fontSize: 10 }} 
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: 'var(--tertiary)', fontSize: 9 }}
                tickCount={6}
                stroke="var(--outline-variant)"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--surface-container)',
                  borderColor: 'var(--outline-variant)',
                  borderRadius: '0.75rem',
                  color: 'var(--on-surface)',
                }}
                itemStyle={{ color: 'var(--primary)' }}
                formatter={(value: unknown) => [`${value}%`, 'Mastery']}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.fullSubject
                  }
                  return label
                }}
              />
              <Radar
                name="Mastery"
                dataKey="A"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.25}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
