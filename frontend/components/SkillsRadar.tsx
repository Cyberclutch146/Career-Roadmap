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
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#64748b', fontSize: 12 }} 
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickCount={6}
              />
              <Tooltip 
                formatter={(value: any) => [`${value}%`, 'Mastery']}
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
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
