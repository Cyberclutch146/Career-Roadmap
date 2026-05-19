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
        <p className="text-on-surface-variant">Resources will be populated as you progress through lessons.</p>
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
              <h4 className="font-heading font-bold text-on-surface">{label}</h4>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {categoryResources.slice(0, 6).map((resource, idx) => {
                // Handle legacy/malformed data where resource is just a string
                const isString = typeof resource === 'string'
                const url = isString ? '#' : resource.url
                const title = isString ? resource : resource.title
                const description = isString ? null : resource.description
                const difficulty = isString ? null : resource.difficulty
                const rating = isString ? null : resource.rating

                return (
                <a
                  key={idx}
                  href={url}
                  target={isString ? undefined : "_blank"}
                  rel={isString ? undefined : "noopener noreferrer"}
                  className="flex items-start gap-3 p-4 bg-surface rounded-lg hover:bg-surface-container transition-colors group"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <ExternalLink className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-on-surface group-hover:text-primary transition-colors">
                      {title}
                    </div>
                    {description && (
                      <div className="text-sm text-on-surface-variant mt-1 line-clamp-2">
                        {description}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      {difficulty && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          difficulty === 'beginner' ? 'bg-success/10 text-success' :
                          difficulty === 'intermediate' ? 'bg-warning/10 text-warning' :
                          'bg-error/10 text-error'
                        }`}>
                          {difficulty}
                        </span>
                      )}
                      {rating && (
                        <span className="text-xs text-on-surface-variant">
                          Rating: {rating}/5
                        </span>
                      )}
                    </div>
                  </div>
                </a>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
