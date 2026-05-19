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
    <section id="examples" className="section-container">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="section-heading mb-4">
            See What Your Roadmap Looks Like
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant">
            Preview an example roadmap for becoming a Full Stack Developer
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card overflow-hidden max-w-4xl mx-auto border border-outline-variant/30 shadow-lifted"
        >
          <div className="p-6 bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent border-b border-outline-variant/30">
            <h3 className="font-headline text-headline-md font-bold text-on-surface">
              {exampleRoadmap.title}
            </h3>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-on-surface-variant text-sm font-label">
              <span className="flex items-center gap-1.5 bg-surface-container/60 px-3 py-1 rounded-full border border-outline-variant/20">
                <Clock className="w-4 h-4 text-primary" /> 6 months
              </span>
              <span className="flex items-center gap-1.5 bg-surface-container/60 px-3 py-1 rounded-full border border-outline-variant/20">
                <BookOpen className="w-4 h-4 text-secondary" /> 68 lessons
              </span>
              <span className="flex items-center gap-1.5 bg-surface-container/60 px-3 py-1 rounded-full border border-outline-variant/20">
                <Zap className="w-4 h-4 text-primary" /> 3 phases
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {exampleRoadmap.phases.map((phase, index) => (
              <div key={phase.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label text-sm ${
                      phase.progress === 100
                        ? 'bg-success/20 text-success border border-success/40'
                        : phase.progress > 0
                        ? 'bg-primary/20 text-primary border border-primary/40'
                        : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
                    }`}>
                      {phase.progress === 100 ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                    <h4 className="font-headline font-semibold text-on-surface">{phase.name}</h4>
                  </div>
                  <span className="font-label text-sm text-on-surface-variant">{phase.progress}%</span>
                </div>
                <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {phase.chapters.map((chapter) => (
                    <div
                      key={chapter.title}
                      className="flex items-center justify-between p-4 bg-surface-container-low/40 rounded-xl border border-outline-variant/10 hover:border-outline-variant/30 transition-colors duration-200"
                    >
                      <span className="font-body text-body-md text-on-surface-variant">{chapter.title}</span>
                      <span className="font-label text-xs text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
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
