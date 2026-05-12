export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'
export type LearningStyle = 'visual' | 'auditory' | 'reading' | 'active'

export interface ResourceItem {
  type: 'documentation' | 'video' | 'article' | 'course' | 'github' | 'practice'
  title: string
  url: string
  description?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  rating?: number
}

export interface Lesson {
  id: string
  title: string
  description: string
  duration_minutes: number
  resources: ResourceItem[]
  practice_exercises: string[]
  completed: boolean
}

export interface Chapter {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  estimated_hours: number
  completed: boolean
}

export interface Phase {
  id: string
  name: string
  description: string
  chapters: Chapter[]
  estimated_weeks: number
  completed: boolean
}

export interface LearningObjective {
  id: string
  objective: string
  mastered: boolean
}

export interface TimelineWeek {
  week: number
  focus: string
  tasks: string[]
}

export interface RoadmapOverview {
  title: string
  description: string
  total_estimated_hours: number
  total_lessons: number
  total_chapters: number
  difficulty_start: string
  difficulty_end: string
}

export interface GeneratedRoadmap {
  overview: RoadmapOverview
  learning_objectives: LearningObjective[]
  timeline_weeks: TimelineWeek[]
  phases: Phase[]
  resources: Record<string, ResourceItem[]>
  revision_strategy: string
  interview_preparation: string
  final_assessment: string
}

export interface Roadmap {
  id: string
  user_id?: string
  goal: string
  skill_level: SkillLevel
  daily_hours: number
  learning_style: LearningStyle
  target_months: number
  generated_roadmap: GeneratedRoadmap
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name: string
  created_at?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface RoadmapFormData {
  goal: string
  skill_level: SkillLevel
  daily_hours: number
  learning_style: LearningStyle
  target_months: number
}
