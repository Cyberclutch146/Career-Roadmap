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
    <section id="examples" className="relative min-h-0 md:min-h-[100dvh] w-full flex flex-col justify-center border-b border-white/5 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-16"
        >
          <h2 className="font-headline text-2xl md:text-5xl text-white font-bold leading-tight mb-3 md:mb-4">
            See your roadmap <span className="font-serif italic text-amber-400 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">in action.</span>
          </h2>
          <p className="font-body text-zinc-400 text-base md:text-lg max-w-xl mx-auto">
            Preview an example roadmap for becoming a Full Stack Developer
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden max-w-4xl mx-auto shadow-[0_0_30px_rgba(245,158,11,0.03)]"
        >
          <div className="p-4 md:p-6 bg-gradient-to-r from-amber-500/[0.03] via-orange-500/[0.01] to-transparent border-b border-zinc-800">
            <h3 className="font-headline text-lg md:text-2xl font-semibold text-white">
              {exampleRoadmap.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 md:mt-3 text-zinc-400 text-sm font-label">
              <span className="flex items-center gap-1.5 bg-zinc-950 px-3.5 py-1.5 rounded-full border border-zinc-800 text-xs">
                <Clock className="w-4 h-4 text-amber-400" /> 6 months
              </span>
              <span className="flex items-center gap-1.5 bg-zinc-950 px-3.5 py-1.5 rounded-full border border-zinc-800 text-xs">
                <BookOpen className="w-4 h-4 text-orange-400" /> 68 lessons
              </span>
              <span className="flex items-center gap-1.5 bg-zinc-950 px-3.5 py-1.5 rounded-full border border-zinc-800 text-xs">
                <Zap className="w-4 h-4 text-amber-400" /> 3 phases
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
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : phase.progress > 0
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-zinc-950 text-zinc-500 border border-zinc-800'
                    }`}>
                      {phase.progress === 100 ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                    <h4 className="font-headline font-semibold text-white">{phase.name}</h4>
                  </div>
                  <span className="font-label text-sm text-zinc-400">{phase.progress}%</span>
                </div>
                <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-1 gap-2 md:gap-3 mt-3">
                  {phase.chapters.map((chapter) => (
                    <div
                      key={chapter.title}
                      className="flex items-center justify-between gap-2 p-3 md:p-4 bg-zinc-900/40 rounded-xl border border-zinc-800 hover:border-amber-500/30 transition-all duration-200"
                    >
                      <span className="font-body text-xs md:text-sm text-zinc-300 min-w-0 truncate">{chapter.title}</span>
                      <span className="font-label text-[10px] md:text-xs text-amber-400 bg-amber-500/5 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full border border-amber-500/10 whitespace-nowrap flex-shrink-0">
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
