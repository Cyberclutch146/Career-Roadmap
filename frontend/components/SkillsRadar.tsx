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
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#a1a1aa', fontSize: 11 }} 
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: '#71717a', fontSize: 9 }}
                tickCount={6}
                stroke="#27272a"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#141415',
                  borderColor: '#27272a',
                  borderRadius: '0.75rem',
                  color: '#fafafa',
                }}
                itemStyle={{ color: '#f59e0b' }}
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
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.25}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
