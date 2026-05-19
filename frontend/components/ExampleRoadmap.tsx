'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Clock, BookOpen, Zap } from 'lucide-react'

const exampleRoadmap = {
  title: 'Become a Full Stack Developer',
  phases: [
    {
      name: 'Foundation',
      chapters: [
        { title: 'HTML & CSS Fundamentals', lessons: 8, completed: 8 },
        { title: 'JavaScript Essentials', lessons: 12, completed: 12 },
      ],
      progress: 100,
    },
    {
      name: 'Backend Development',
      chapters: [
        { title: 'Node.js & Express', lessons: 10, completed: 6 },
        { title: 'Databases', lessons: 8, completed: 0 },
      ],
      progress: 33,
    },
    {
      name: 'Frontend Frameworks',
      chapters: [
        { title: 'React Fundamentals', lessons: 14, completed: 0 },
        { title: 'State Management', lessons: 8, completed: 0 },
      ],
      progress: 0,
    },
  ],
}

export function ExampleRoadmap() {
  return (
    <section id="examples" className="py-20 bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-on-surface mb-4">
            See What Your Roadmap Looks Like
          </h2>
          <p className="text-on-surface-variant text-lg">
            Preview an example roadmap for becoming a Full Stack Developer
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-border shadow-medium overflow-hidden max-w-4xl mx-auto"
        >
          <div className="p-6 bg-primary">
            <h3 className="text-xl font-heading font-bold text-white">
              {exampleRoadmap.title}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> 6 months
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> 68 lessons
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4" /> 3 phases
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {exampleRoadmap.phases.map((phase, index) => (
              <div key={phase.name}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      phase.progress === 100
                        ? 'bg-success text-white'
                        : phase.progress > 0
                        ? 'bg-primary text-white'
                        : 'bg-surface text-on-surface-variant'
                    }`}>
                      {phase.progress === 100 ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                    <h4 className="font-heading font-bold text-on-surface">{phase.name}</h4>
                  </div>
                  <span className="text-sm font-medium text-on-surface-variant">{phase.progress}%</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
                <div className="mt-3 space-y-2">
                  {phase.chapters.map((chapter) => (
                    <div
                      key={chapter.title}
                      className="flex items-center justify-between p-3 bg-surface rounded-lg"
                    >
                      <span className="text-sm text-on-surface-variant">{chapter.title}</span>
                      <span className="text-xs text-on-surface-variant">
                        {chapter.completed}/{chapter.lessons} lessons
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
