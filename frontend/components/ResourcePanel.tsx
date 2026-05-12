'use client'

import {
  FileText,
  PlayCircle,
  BookOpen,
  GraduationCap,
  Github,
  Code,
  ExternalLink,
} from 'lucide-react'
import type { ResourceItem } from '@/types'

interface ResourcePanelProps {
  resources: Record<string, ResourceItem[]>
}

const resourceCategories = [
  { key: 'documentation', label: 'Documentation', icon: FileText, color: 'bg-blue-500' },
  { key: 'videos', label: 'Videos', icon: PlayCircle, color: 'bg-red-500' },
  { key: 'articles', label: 'Articles', icon: BookOpen, color: 'bg-green-500' },
  { key: 'courses', label: 'Courses', icon: GraduationCap, color: 'bg-purple-500' },
  { key: 'github', label: 'GitHub', icon: Github, color: 'bg-gray-700' },
  { key: 'practice', label: 'Practice', icon: Code, color: 'bg-orange-500' },
]

export function ResourcePanel({ resources }: ResourcePanelProps) {
  const hasResources = Object.values(resources).some((arr) => arr.length > 0)

  if (!hasResources) {
    return (
      <div className="text-center py-8">
        <p className="text-ink-500">Resources will be populated as you progress through lessons.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {resourceCategories.map(({ key, label, icon: Icon, color }) => {
        const categoryResources = resources[key] || []
        if (categoryResources.length === 0) return null

        return (
          <div key={key}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-serif font-bold text-ink-900">{label}</h4>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {categoryResources.slice(0, 6).map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 bg-paper-50 rounded-lg hover:bg-paper-100 transition-colors group"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <ExternalLink className="w-4 h-4 text-ink-300 group-hover:text-accent transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-ink-900 group-hover:text-accent transition-colors">
                      {resource.title}
                    </div>
                    {resource.description && (
                      <div className="text-sm text-ink-500 mt-1 line-clamp-2">
                        {resource.description}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      {resource.difficulty && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          resource.difficulty === 'beginner' ? 'bg-success/10 text-success' :
                          resource.difficulty === 'intermediate' ? 'bg-warning/10 text-warning' :
                          'bg-error/10 text-error'
                        }`}>
                          {resource.difficulty}
                        </span>
                      )}
                      {resource.rating && (
                        <span className="text-xs text-ink-300">
                          Rating: {resource.rating}/5
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
