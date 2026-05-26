'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Clock, BookOpen, Zap, ExternalLink, Play, ChevronRight } from 'lucide-react'

interface SampleLesson {
  id: string
  title: string
  duration: string
  type: string
  completed: boolean
}

// Curated preview roadmaps
const sampleRoadmaps = [
  {
    id: 'fullstack',
    title: 'Become a Full Stack Developer',
    description: 'Master frontend, backend, databases, and deployment pipelines.',
    duration: '6 months',
    lessonsCount: 68,
    phasesCount: 3,
    phases: [
      {
        id: 'fs-phase-1',
        name: 'Phase 1: Foundation',
        progress: 100,
        chapters: [
          {
            id: 'fs-c1',
            title: 'HTML & CSS Fundamentals',
            lessons: [
              { id: 'fs-l1', title: 'Semantic HTML & SEO Best Practices', duration: '25 min', type: 'article', completed: true },
              { id: 'fs-l2', title: 'CSS Grid & Flexbox Masterclass', duration: '45 min', type: 'video', completed: true },
              { id: 'fs-l3', title: 'Responsive Design & Media Queries', duration: '35 min', type: 'article', completed: true },
            ],
          },
          {
            id: 'fs-c2',
            title: 'JavaScript Essentials',
            lessons: [
              { id: 'fs-l4', title: 'DOM Manipulation & Event Listeners', duration: '40 min', type: 'video', completed: true },
              { id: 'fs-l5', title: 'Promises, Async/Await & APIs', duration: '50 min', type: 'article', completed: true },
            ],
          },
        ],
      },
      {
        id: 'fs-phase-2',
        name: 'Phase 2: Modern Frontend',
        progress: 40,
        chapters: [
          {
            id: 'fs-c3',
            title: 'React Fundamentals',
            lessons: [
              { id: 'fs-l6', title: 'Components, Props & State Management', duration: '45 min', type: 'video', completed: true },
              { id: 'fs-l7', title: 'Hooks deep dive (useState, useEffect)', duration: '60 min', type: 'article', completed: true },
              { id: 'fs-l8', title: 'React Router & Client-side Navigation', duration: '30 min', type: 'video', completed: false },
            ],
          },
          {
            id: 'fs-c4',
            title: 'State Management',
            lessons: [
              { id: 'fs-l9', title: 'Context API vs Zustand/Redux', duration: '40 min', type: 'article', completed: false },
              { id: 'fs-l10', title: 'Async state management with TanStack Query', duration: '55 min', type: 'video', completed: false },
            ],
          },
        ],
      },
      {
        id: 'fs-phase-3',
        name: 'Phase 3: Backend & Systems',
        progress: 0,
        chapters: [
          {
            id: 'fs-c5',
            title: 'Node.js & Databases',
            lessons: [
              { id: 'fs-l11', title: 'Express.js Rest API Architecture', duration: '50 min', type: 'video', completed: false },
              { id: 'fs-l12', title: 'SQL vs NoSQL (PostgreSQL & MongoDB)', duration: '65 min', type: 'article', completed: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ai-ml',
    title: 'Machine Learning Engineer',
    description: 'From mathematical basics to training and deploying LLMs.',
    duration: '8 months',
    lessonsCount: 92,
    phasesCount: 3,
    phases: [
      {
        id: 'ml-phase-1',
        name: 'Phase 1: Math & Python Foundations',
        progress: 100,
        chapters: [
          {
            id: 'ml-c1',
            title: 'Linear Algebra & Calculus',
            lessons: [
              { id: 'ml-l1', title: 'Matrices, Eigenvectors & Dot Products', duration: '35 min', type: 'article', completed: true },
              { id: 'ml-l2', title: 'Gradient Descent & Partial Derivatives', duration: '50 min', type: 'video', completed: true },
            ],
          },
          {
            id: 'ml-c2',
            title: 'Scientific Python Stack',
            lessons: [
              { id: 'ml-l3', title: 'Data Manipulation with Pandas & NumPy', duration: '45 min', type: 'video', completed: true },
              { id: 'ml-l4', title: 'Data Visualization with Matplotlib & Seaborn', duration: '30 min', type: 'article', completed: true },
            ],
          },
        ],
      },
      {
        id: 'ml-phase-2',
        name: 'Phase 2: Core Machine Learning',
        progress: 50,
        chapters: [
          {
            id: 'ml-c3',
            title: 'Supervised & Unsupervised Learning',
            lessons: [
              { id: 'ml-l5', title: 'Linear & Logistic Regression Models', duration: '55 min', type: 'video', completed: true },
              { id: 'ml-l6', title: 'Random Forests & Gradient Boosting', duration: '60 min', type: 'article', completed: true },
              { id: 'ml-l7', title: 'Clustering algorithms: K-Means & PCA', duration: '40 min', type: 'video', completed: false },
            ],
          },
          {
            id: 'ml-c4',
            title: 'Model Evaluation & Tuning',
            lessons: [
              { id: 'ml-l8', title: 'Cross-Validation & Hyperparameter Tuning', duration: '45 min', type: 'article', completed: false },
            ],
          },
        ],
      },
      {
        id: 'ml-phase-3',
        name: 'Phase 3: Deep Learning & LLMs',
        progress: 0,
        chapters: [
          {
            id: 'ml-c5',
            title: 'Neural Networks & PyTorch',
            lessons: [
              { id: 'ml-l9', title: 'Building Neural Nets from Scratch', duration: '75 min', type: 'video', completed: false },
              { id: 'ml-l10', title: 'Fine-tuning LLMs with HuggingFace', duration: '90 min', type: 'article', completed: false },
            ],
          },
        ],
      },
    ],
  },
]

export function ExampleRoadmap() {
  const [selectedTrack, setSelectedTrack] = useState('fullstack')
  const [activeRoadmap, setActiveRoadmap] = useState(() => sampleRoadmaps[0])
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => {
    const completed = new Set<string>()
    sampleRoadmaps[0].phases.forEach(p => 
      p.chapters.forEach(c => 
        c.lessons.forEach(l => { if (l.completed) completed.add(l.id) })
      )
    )
    return completed
  })
  
  const [selectedLesson, setSelectedLesson] = useState<SampleLesson | null>(
    sampleRoadmaps[0].phases[1].chapters[0].lessons[2] // Select an active incomplete lesson
  )
  const [showMobileExample, setShowMobileExample] = useState(false)

  const handleTrackChange = (trackId: string) => {
    setSelectedTrack(trackId)
    const newRoadmap = sampleRoadmaps.find(r => r.id === trackId) || sampleRoadmaps[0]
    setActiveRoadmap(newRoadmap)
    
    // Populate completed set
    const completed = new Set<string>()
    newRoadmap.phases.forEach(p => 
      p.chapters.forEach(c => 
        c.lessons.forEach(l => { if (l.completed) completed.add(l.id) })
      )
    )
    setCompletedLessonIds(completed)
    // Select first incomplete lesson
    let found = null
    for (const p of newRoadmap.phases) {
      for (const c of p.chapters) {
        for (const l of c.lessons) {
          if (!l.completed) {
            found = l
            break
          }
        }
        if (found) break
      }
      if (found) break
    }
    setSelectedLesson(found || newRoadmap.phases[0].chapters[0].lessons[0])
  }

  const toggleLesson = (lessonId: string) => {
    const newCompleted = new Set(completedLessonIds)
    if (newCompleted.has(lessonId)) {
      newCompleted.delete(lessonId)
    } else {
      newCompleted.add(lessonId)
    }
    setCompletedLessonIds(newCompleted)
  }

  // Calculate phase progress based on user state
  const getPhaseProgress = (phase: typeof activeRoadmap.phases[0]) => {
    let total = 0
    let done = 0
    phase.chapters.forEach(c => {
      c.lessons.forEach(l => {
        total++
        if (completedLessonIds.has(l.id)) done++
      })
    })
    return total > 0 ? Math.round((done / total) * 100) : 0
  }

  const getOverallProgress = () => {
    let total = 0
    let done = 0
    activeRoadmap.phases.forEach(p => {
      p.chapters.forEach(c => {
        c.lessons.forEach(l => {
          total++
          if (completedLessonIds.has(l.id)) done++
        })
      })
    })
    return total > 0 ? Math.round((done / total) * 100) : 0
  }

  return (
    <section id="examples" className="relative min-h-0 md:min-h-[100dvh] w-full flex flex-col justify-center border-b border-outline-variant/50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-14"
        >
          <h2 className="font-headline text-2xl md:text-5xl text-on-surface font-bold leading-tight mb-3 md:mb-4">
            See your roadmap <span className="font-serif italic text-amber-400 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">in action.</span>
          </h2>
          <p className="font-body text-on-surface-variant text-base md:text-lg max-w-xl mx-auto">
            Interact with a live preview. Click checkboxes to track progress or lessons to view resources.
          </p>
        </motion.div>

        {/* Mobile Toggle Trigger */}
        {!showMobileExample && (
          <div className="flex md:hidden flex-col items-center justify-center p-6 rounded-2xl bg-surface-container/60 border border-outline-variant text-center gap-4 mt-2 max-w-md mx-auto">
            <p className="text-on-surface-variant text-xs sm:text-sm font-body leading-relaxed">
              Explore a live interactive roadmap to see features like progress tracking, resource recommendation, and active mentor chat.
            </p>
            <button
              onClick={() => setShowMobileExample(true)}
              className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-semibold font-label text-sm transition-all active:scale-95 shadow-glow"
            >
              See Example
            </button>
          </div>
        )}

        {/* Hide Example Button on Mobile (Only shown when expanded) */}
        {showMobileExample && (
          <div className="flex md:hidden justify-center mb-6">
            <button
              onClick={() => setShowMobileExample(false)}
              className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-semibold font-label text-xs hover:text-on-surface transition-all active:scale-95"
            >
              Hide Example
            </button>
          </div>
        )}

        {/* Switcher & Grid (Always visible on desktop, toggleable on mobile) */}
        <div className={showMobileExample ? 'block' : 'hidden md:block'}>
          {/* Track Switcher Tabs */}
          <div className="flex justify-center gap-3 mb-8">
            {sampleRoadmaps.map((track) => (
              <button
                key={track.id}
                onClick={() => handleTrackChange(track.id)}
                className={`px-5 py-2.5 rounded-full font-label text-xs sm:text-sm font-semibold border transition-all duration-300 active:scale-95 ${
                  selectedTrack === track.id
                    ? 'bg-amber-500 text-black border-amber-500 shadow-glow'
                    : 'bg-surface-container/60 text-on-surface-variant border-outline-variant hover:text-on-surface hover:border-outline'
                }`}
              >
                {track.title}
              </button>
            ))}
          </div>

          {/* The Live Interactive Roadmap Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Main Roadmap Tree (2 Cols on lg) */}
            <motion.div
              layout
              className="lg:col-span-2 rounded-2xl bg-surface-container/60 border border-outline-variant overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              {/* Header info */}
              <div className="p-5 md:p-6 bg-gradient-to-b from-zinc-800/20 to-transparent border-b border-outline-variant">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-[10px] font-label font-bold tracking-widest text-amber-500 uppercase">Live Preview</span>
                    <h3 className="font-headline text-lg sm:text-2xl font-bold text-on-surface mt-1">
                      {activeRoadmap.title}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1 max-w-md">
                      {activeRoadmap.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-2 font-label">
                    <span className="text-on-surface-variant text-xs">Total Progress:</span>
                    <span className="text-amber-400 font-bold text-sm">{getOverallProgress()}%</span>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-5 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                    animate={{ width: `${getOverallProgress()}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4 text-on-surface-variant text-xs font-label">
                  <span className="flex items-center gap-1 bg-zinc-950/60 px-3 py-1.5 rounded-full border border-zinc-800/80">
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> {activeRoadmap.duration}
                  </span>
                  <span className="flex items-center gap-1 bg-zinc-950/60 px-3 py-1.5 rounded-full border border-zinc-800/80">
                    <BookOpen className="w-3.5 h-3.5 text-orange-500" /> {activeRoadmap.lessonsCount} lessons
                  </span>
                  <span className="flex items-center gap-1 bg-zinc-950/60 px-3 py-1.5 rounded-full border border-zinc-800/80">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> {activeRoadmap.phasesCount} Phased Paths
                  </span>
                </div>
              </div>

              {/* Phased Roadmap Nodes Container */}
              <div className="p-5 md:p-6 space-y-6 max-h-[480px] overflow-y-auto scrollbar-hide">
                {activeRoadmap.phases.map((phase, pIndex) => {
                  const phaseProgress = getPhaseProgress(phase)
                  return (
                    <div key={phase.id} className="space-y-3 relative">
                      {/* Phase Node Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-label font-bold text-xs ${
                            phaseProgress === 100
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : phaseProgress > 0
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                              : 'bg-zinc-950 text-tertiary border-outline-variant'
                          }`}>
                            {phaseProgress === 100 ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <span>{pIndex + 1}</span>
                            )}
                          </div>
                          <h4 className="font-headline font-bold text-on-surface text-sm sm:text-base">{phase.name}</h4>
                        </div>
                        <span className="font-label text-xs sm:text-sm text-on-surface-variant font-medium">{phaseProgress}%</span>
                      </div>

                      {/* Phase Progress Bar */}
                      <div className="w-full bg-zinc-950/80 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                          animate={{ width: `${phaseProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      {/* Chapters & Lessons */}
                      <div className="space-y-2 mt-3 pl-3 border-l border-zinc-800/80 ml-4">
                        {phase.chapters.map(chapter => (
                          <div key={chapter.id} className="space-y-2">
                            <h5 className="font-body text-xs font-bold text-on-surface-variant tracking-wide uppercase mt-2">
                              {chapter.title}
                            </h5>

                            <div className="space-y-1.5">
                              {chapter.lessons.map(lesson => {
                                const isCompleted = completedLessonIds.has(lesson.id)
                                const isSelected = selectedLesson?.id === lesson.id
                                return (
                                  <div
                                    key={lesson.id}
                                    onClick={() => setSelectedLesson(lesson)}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                                      isSelected
                                        ? 'bg-amber-500/[0.04] border-amber-500/30'
                                        : 'bg-zinc-950/20 border-outline-variant/60 hover:bg-zinc-800/30 hover:border-zinc-700/60'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                      {/* Real Checklist functionality */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toggleLesson(lesson.id)
                                        }}
                                        className="flex-shrink-0 focus:outline-none hover:scale-105 active:scale-95 transition-transform"
                                      >
                                        {isCompleted ? (
                                          <CheckCircle2 className="w-5 h-5 text-amber-500 fill-amber-500/10" />
                                        ) : (
                                          <Circle className="w-5 h-5 text-tertiary hover:text-amber-500/60 transition-colors" />
                                        )}
                                      </button>
                                      <span className={`font-body text-xs sm:text-sm truncate transition-colors ${
                                        isCompleted ? 'text-on-surface-variant line-through' : 'text-on-surface'
                                      }`}>
                                        {lesson.title}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <span className="font-label text-[10px] text-on-surface-variant px-2 py-0.5 rounded bg-surface-container border border-zinc-800/80">
                                        {lesson.duration}
                                      </span>
                                      <ChevronRight className={`w-3.5 h-3.5 text-tertiary transition-transform ${isSelected ? 'translate-x-0.5 text-amber-500' : ''}`} />
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Interactive Lesson Resource Inspector Sidebar (1 Col on lg) */}
            <motion.div
              layout
              className="rounded-2xl bg-surface-container/60 border border-outline-variant overflow-hidden shadow-2xl p-5 md:p-6 flex flex-col justify-between h-full bg-gradient-to-br from-zinc-900/80 to-zinc-950/40 relative"
            >
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-label font-bold tracking-widest text-amber-500 uppercase bg-amber-500/5 px-2.5 py-1 rounded-full border border-amber-500/10">
                    Node Inspector
                  </span>
                  <span className="font-label text-xs text-on-surface-variant flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {selectedLesson?.duration || '15 min'}
                  </span>
                </div>

                {selectedLesson ? (
                  <>
                    <div className="space-y-2 mt-2">
                      <h4 className="font-headline font-bold text-lg text-on-surface leading-snug">
                        {selectedLesson.title}
                      </h4>
                      <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                        This node covers deep learning fundamentals, hands-on architectural code practices, and core diagnostic patterns. Click checkout to unlock curriculum resources.
                      </p>
                    </div>

                    {/* Mock Interactive Resource Cards */}
                    <div className="space-y-3 pt-3">
                      <span className="text-[11px] font-label font-bold tracking-wider text-on-surface-variant uppercase block">Curated Materials:</span>
                      
                      <div className="p-3 bg-surface-container/40 border border-outline-variant hover:border-amber-500/20 rounded-xl transition-all duration-200 group flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 border border-amber-500/20 text-amber-400 text-xs font-bold font-label">
                          AI
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-body text-xs font-bold text-on-surface group-hover:text-amber-400 transition-colors">AI Lecture Video</span>
                            <ExternalLink className="w-3 h-3 text-on-surface-variant flex-shrink-0" />
                          </div>
                          <p className="font-body text-[10px] text-on-surface-variant mt-0.5 truncate">Adaptive Masterclass Core Lecture</p>
                        </div>
                      </div>

                      <div className="p-3 bg-surface-container/40 border border-outline-variant hover:border-amber-500/20 rounded-xl transition-all duration-200 group flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 border border-orange-500/20 text-orange-400 text-xs font-bold font-label">
                          DOC
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-body text-xs font-bold text-on-surface group-hover:text-orange-400 transition-colors">MDN Architecture Docs</span>
                            <ExternalLink className="w-3 h-3 text-on-surface-variant flex-shrink-0" />
                          </div>
                          <p className="font-body text-[10px] text-on-surface-variant mt-0.5 truncate">Practical Reference Implementation</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Mentor Assistant Widget */}
                    <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[10px] font-label font-bold text-on-surface-variant tracking-wider uppercase">AI Mentor Active</span>
                      </div>
                      <p className="font-body text-[11px] text-on-surface italic leading-relaxed">
                        &ldquo;Hi! You are reviewing the {selectedLesson.type === 'video' ? 'video training' : 'technical doc'} node. Click the checkbox in the path list once you feel confident with this topic to update your overall scoring!&rdquo;
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-on-surface-variant font-body text-sm">
                    Select a lesson node from the path tree to inspect educational learning resources.
                  </div>
                )}
              </div>

              {/* Call To Action Inside Preview Card */}
              <div className="pt-6 mt-6 border-t border-outline-variant/60">
                <button
                  onClick={() => {
                    const targetElement = document.getElementById('features')
                    if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-black font-semibold font-label text-xs rounded-xl hover:bg-amber-400 transition-all active:scale-[0.98] shadow-glow"
                >
                  <Play className="w-3.5 h-3.5 fill-black" /> Explore Features
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
