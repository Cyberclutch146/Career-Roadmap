'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useStore } from '@/store'
import { api } from '@/lib/api'
import { shouldSyncWithFirestore } from '@/lib/sync'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { ChapterList } from '@/components/ChapterList'
import { ResourcePanel } from '@/components/ResourcePanel'
import { LessonWorkspace } from '@/components/LessonWorkspace'
import { SkillsRadar } from '@/components/SkillsRadar'
import { Navbar } from '@/components/Navbar'
import { MobileSidebar } from '@/components/MobileSidebar'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Target,
  ChevronRight,
  Calendar,
  Brain,
  MessageSquare,
  Download,
  Share2,
  CheckCircle2,
  Bookmark,
  FileText,
  Menu
} from 'lucide-react'
import type { Roadmap, Phase, Chapter, Lesson } from '@/types'

export default function RoadmapPage() {
  const params = useParams()
  const router = useRouter()
  const { currentRoadmap, setCurrentRoadmap, user } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [showResources, setShowResources] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [bookmarkedLessons, setBookmarkedLessons] = useState<Set<string>>(new Set())
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const [isSharing, setIsSharing] = useState(false)

  const getSelectedLessonPhaseInfo = () => {
    if (!selectedLesson || !roadmap) return { name: '', description: '' }
    for (const phase of roadmap.generated_roadmap.phases) {
      for (const chapter of phase.chapters) {
        if (chapter.lessons.some(l => l.id === selectedLesson.id)) {
          return { name: phase.name, description: phase.description }
        }
      }
    }
    return { name: '', description: '' }
  }
  const selectedLessonPhaseInfo = getSelectedLessonPhaseInfo()

  useEffect(() => {
    const loadRoadmap = async () => {
      const roadmapId = params.id as string

      try {
        let loadedRoadmap: Roadmap | null = null

        // Try local storage first
        try {
          const savedRoadmapRaw = window.localStorage.getItem(`roadmap_${roadmapId}`)
          if (savedRoadmapRaw) {
            loadedRoadmap = JSON.parse(savedRoadmapRaw) as Roadmap
          }
        } catch (e) {
          console.error("Failed to load local roadmap:", e)
        }

        // 1. Try owner collection if user is logged in (disabled for offline mode)
        const syncWithFirestore = shouldSyncWithFirestore(user)
        if (!loadedRoadmap && user && syncWithFirestore) {
          try {
            const { doc, getDoc } = await import('firebase/firestore')
            const { db } = await import('@/lib/firebase')
            const docRef = doc(db, 'users', user.id, 'roadmaps', roadmapId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
              loadedRoadmap = { ...docSnap.data(), id: docSnap.id } as Roadmap
            }
          } catch (err) {
            console.log("Not owner or failed to fetch from owner library, checking public...")
          }
        }

        // 2. Try public collection
        if (!loadedRoadmap) {
          try {
            const { doc, getDoc } = await import('firebase/firestore')
            const { db } = await import('@/lib/firebase')
            const docRef = doc(db, 'public_roadmaps', roadmapId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
              loadedRoadmap = { ...docSnap.data(), id: docSnap.id } as Roadmap
            }
          } catch (err) {
            console.error("Failed to fetch public roadmap:", err)
          }
        }

        if (!loadedRoadmap) throw new Error('Roadmap not found')

        setRoadmap(loadedRoadmap)
        setCurrentRoadmap(loadedRoadmap)

        // 3. Fetch progress: owner uses Firestore, others use localStorage (always use localStorage in offline/mock mode)
        if (user && syncWithFirestore && loadedRoadmap.user_id === user.id) {
          try {
            const { collection, getDocs, setDoc, doc: fsDoc } = await import('firebase/firestore')
            const { db } = await import('@/lib/firebase')
            const progressRef = collection(db, 'users', user.id, 'roadmaps', roadmapId, 'progress')
            const snapshot = await getDocs(progressRef)
            const completed = new Set<string>()
            snapshot.forEach(docSnap => {
              if (docSnap.data().completed) completed.add(docSnap.id)
            })

            // Initialize from loaded roadmap if Firestore progress is empty
            if (completed.size === 0) {
              loadedRoadmap.generated_roadmap.phases.forEach(phase => {
                phase.chapters.forEach(chapter => {
                  chapter.lessons.forEach(lesson => {
                    if (lesson.completed) {
                      completed.add(lesson.id)
                    }
                  })
                })
              })
              // Sync back to Firestore
              const completedList = Array.from(completed)
              for (const lId of completedList) {
                const pDocRef = fsDoc(db, 'users', user.id, 'roadmaps', roadmapId, 'progress', lId)
                await setDoc(pDocRef, { completed: true })
              }
            }
            setCompletedLessons(completed)

            // Load bookmarks from Firestore
            try {
              const { collection: col2, getDocs: gds2 } = await import('firebase/firestore')
              const bRef = col2(db, 'users', user.id, 'roadmaps', roadmapId, 'bookmarks')
              const bSnap = await gds2(bRef)
              const bSet = new Set<string>()
              bSnap.forEach(d => bSet.add(d.id))
              setBookmarkedLessons(bSet)
            } catch { /* silently fail */ }
          } catch {
            // Silently fail
          }
        } else {
          try {
            const storageKey = `progress_${roadmapId}`
            const saved = window.localStorage.getItem(storageKey)
            if (saved) {
              const array = JSON.parse(saved) as string[]
              setCompletedLessons(new Set(array))
            } else {
              const completed = new Set<string>()
              loadedRoadmap.generated_roadmap.phases.forEach(phase => {
                phase.chapters.forEach(chapter => {
                  chapter.lessons.forEach(lesson => {
                    if (lesson.completed) {
                      completed.add(lesson.id)
                    }
                  })
                })
              })
              setCompletedLessons(completed)
              window.localStorage.setItem(storageKey, JSON.stringify(Array.from(completed)))
            }
          } catch {
            // Silently fail
          }

          // Load bookmarks from localStorage for guests
          try {
            const bKey = `bookmarks_${roadmapId}`
            const saved = window.localStorage.getItem(bKey)
            if (saved) setBookmarkedLessons(new Set(JSON.parse(saved) as string[]))
          } catch { /* silently fail */ }
        }
      } catch (error) {
        console.error('Failed to load roadmap:', error)
        router.push('/generate')
      } finally {
        setIsLoading(false)
      }
    }

    loadRoadmap()
  }, [params.id, user]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleLessonComplete = async (lessonId: string) => {
    if (!roadmap) return

    const previousCompleted = new Set(completedLessons)
    const newCompleted = new Set(completedLessons)
    const isCompleted = newCompleted.has(lessonId)

    if (isCompleted) {
      newCompleted.delete(lessonId)
    } else {
      newCompleted.add(lessonId)
    }
    setCompletedLessons(newCompleted)

    const syncWithFirestore = shouldSyncWithFirestore(user)
    if (user && syncWithFirestore && roadmap.user_id === user.id) {
      try {
        const { doc, setDoc } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')
        const progressDoc = doc(db, 'users', user.id, 'roadmaps', roadmap.id, 'progress', lessonId)
        await setDoc(
          progressDoc,
          { 
            completed: !isCompleted,
            completed_at: !isCompleted ? new Date().toISOString() : null 
          },
          { merge: true }
        )
      } catch (error) {
        // Rollback to previous state on API failure
        setCompletedLessons(previousCompleted)
      }
    } else {
      // Guest or non-owner: store in localStorage
      try {
        const storageKey = `progress_${roadmap.id}`
        const localProgressArray = Array.from(newCompleted)
        window.localStorage.setItem(storageKey, JSON.stringify(localProgressArray))

        const datesKey = `progress_dates_${roadmap.id}`
        const savedDatesRaw = window.localStorage.getItem(datesKey)
        const savedDates = savedDatesRaw ? JSON.parse(savedDatesRaw) : {}
        if (!isCompleted) {
          savedDates[lessonId] = new Date().toISOString()
        } else {
          delete savedDates[lessonId]
        }
        window.localStorage.setItem(datesKey, JSON.stringify(savedDates))
      } catch (e) {
        console.error("Failed to save progress locally:", e)
      }
    }
  }

  const toggleBookmark = async (lessonId: string) => {
    if (!roadmap) return
    const newBookmarks = new Set(bookmarkedLessons)
    const isBookmarked = newBookmarks.has(lessonId)
    if (isBookmarked) {
      newBookmarks.delete(lessonId)
    } else {
      newBookmarks.add(lessonId)
    }
    setBookmarkedLessons(newBookmarks)

    const syncWithFirestore = shouldSyncWithFirestore(user)
    if (user && syncWithFirestore && roadmap.user_id === user.id) {
      try {
        const { doc, setDoc, deleteDoc } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')
        const bDoc = doc(db, 'users', user.id, 'roadmaps', roadmap.id, 'bookmarks', lessonId)
        if (!isBookmarked) {
          await setDoc(bDoc, { bookmarked_at: new Date().toISOString() })
        } else {
          await deleteDoc(bDoc)
        }
      } catch (e) {
        console.error('Failed to save bookmark:', e)
        setBookmarkedLessons(bookmarkedLessons) // rollback
      }
    } else {
      try {
        const bKey = `bookmarks_${roadmap.id}`
        window.localStorage.setItem(bKey, JSON.stringify(Array.from(newBookmarks)))
      } catch (e) {
        console.error('Failed to save bookmark locally:', e)
      }
    }
  }

  const handleShareToggle = async () => {
    if (!roadmap) return
    setIsSharing(true)
    try {
      const newIsPublic = !roadmap.is_public
      const updated = { ...roadmap, is_public: newIsPublic }
      setRoadmap(updated)
      window.localStorage.setItem(`roadmap_${roadmap.id}`, JSON.stringify(updated))
      
      const syncWithFirestore = shouldSyncWithFirestore(user)
      if (syncWithFirestore) {
        const { doc, setDoc, deleteDoc } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')
        const publicRef = doc(db, 'public_roadmaps', roadmap.id)
        if (newIsPublic) {
          await setDoc(publicRef, updated)
        } else {
          await deleteDoc(publicRef).catch(() => {})
        }
        
        if (user && roadmap.user_id === user.id) {
          const ownerRef = doc(db, 'users', user.id, 'roadmaps', roadmap.id)
          await setDoc(ownerRef, updated, { merge: true })
        }
      }
      
      if (newIsPublic) {
        await navigator.clipboard.writeText(window.location.href)
        alert("Roadmap is now public! Share link copied to clipboard.")
      } else {
        alert("Roadmap is now private.")
      }
    } catch (err) {
      console.error("Failed to share roadmap:", err)
      alert("Failed to update sharing settings.")
    } finally {
      setIsSharing(false)
    }
  }

  const exportToMarkdown = () => {
    if (!roadmap) return
    const gen = roadmap.generated_roadmap
    let md = `# ${gen.overview.title}\n\n`
    md += `**Target Duration:** ${roadmap.target_months} Months\n`
    md += `**Description:** ${gen.overview.description}\n\n`
    
    md += `## Learning Phases\n\n`
    gen.phases.forEach((phase: Phase, phaseIdx: number) => {
      md += `### Phase ${phaseIdx + 1}: ${phase.name}\n`
      md += `**Duration:** ${phase.estimated_weeks} Weeks\n`
      md += `**Description:** ${phase.description}\n\n`
      
      phase.chapters.forEach((chapter: Chapter, chapterIdx: number) => {
        md += `#### Chapter ${chapterIdx + 1}: ${chapter.title}\n`
        md += `*Description:* ${chapter.description}\n\n`
        
        chapter.lessons.forEach((lesson: Lesson, lessonIdx: number) => {
          md += `##### Lesson ${lessonIdx + 1}: ${lesson.title}\n`
          md += `*   **Duration:** ${lesson.duration_minutes} Minutes\n`
          md += `*   **Description:** ${lesson.description}\n`
          if (lesson.practice_exercises && lesson.practice_exercises.length > 0) {
            md += `*   **Practice Exercises:**\n`
            lesson.practice_exercises.forEach((exercise) => {
              md += `        * ${exercise}\n`
            })
          }
          if (lesson.resources && lesson.resources.length > 0) {
            md += `*   **Resources:**\n`
            lesson.resources.forEach((res) => {
              md += `        * [${res.title}](${res.url}) (${res.type})\n`
            })
          }
          md += `\n`
        })
      })
    })

    if (gen.revision_strategy) {
      md += `## Revision Strategy\n\n${gen.revision_strategy}\n\n`
    }

    if (gen.interview_preparation) {
      md += `## Interview Preparation\n\n${gen.interview_preparation}\n\n`
    }

    if (gen.final_assessment) {
      md += `## Final Assessment\n\n${gen.final_assessment}\n\n`
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${gen.overview.title.replace(/\s+/g, '_')}_roadmap.md`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = () => {
    if (!roadmap) return
    const gen = roadmap.generated_roadmap
    
    // Create an iframe to print from
    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    iframe.style.width = '0px'
    iframe.style.height = '0px'
    iframe.style.border = 'none'
    document.body.appendChild(iframe)
    
    const doc = iframe.contentWindow?.document
    if (!doc) return

    let html = `
      <html>
        <head>
          <title>${gen.overview.title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #1e293b;
              line-height: 1.6;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              font-family: Georgia, serif;
              font-size: 32px;
              color: #0f172a;
              margin-bottom: 8px;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 12px;
            }
            .meta {
              font-size: 14px;
              color: #64748b;
              margin-bottom: 30px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .overview {
              font-size: 16px;
              color: #475569;
              margin-bottom: 40px;
              background: #f8fafc;
              padding: 20px;
              border-left: 4px solid #6366f1;
              border-radius: 4px;
            }
            .phase {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            .phase-header {
              background: #f1f5f9;
              padding: 12px 18px;
              border-radius: 6px;
              margin-bottom: 20px;
            }
            .phase-title {
              font-size: 20px;
              font-weight: bold;
              color: #1e293b;
              margin: 0;
            }
            .phase-meta {
              font-size: 12px;
              color: #64748b;
              margin-top: 4px;
            }
            .chapter {
              margin-left: 15px;
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .chapter-title {
              font-size: 18px;
              font-weight: bold;
              color: #334155;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 6px;
              margin-bottom: 12px;
            }
            .lesson {
              margin-left: 15px;
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            .lesson-title {
              font-size: 15px;
              font-weight: bold;
              color: #475569;
              margin-bottom: 4px;
            }
            .lesson-details {
              font-size: 13px;
              color: #64748b;
              margin-bottom: 6px;
            }
            .lesson-desc {
              font-size: 14px;
              margin-bottom: 8px;
            }
            .section-title {
              font-family: Georgia, serif;
              font-size: 22px;
              color: #0f172a;
              margin-top: 50px;
              margin-bottom: 20px;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 8px;
              page-break-before: always;
            }
            .section-content {
              font-size: 14px;
              color: #334155;
              white-space: pre-line;
            }
            @media print {
              body { padding: 0; }
              .phase { page-break-inside: avoid; }
              .chapter { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>${gen.overview.title}</h1>
          <div class="meta">Target Duration: ${roadmap.target_months} Months &bull; Total Lessons: ${gen.overview.total_lessons}</div>
          <div class="overview">${gen.overview.description}</div>
          
          <h2 style="font-family: Georgia, serif; font-size: 24px; margin-bottom: 25px;">Learning Path Structure</h2>
    `

    gen.phases.forEach((phase: Phase, phaseIdx: number) => {
      html += `
        <div class="phase">
          <div class="phase-header">
            <div class="phase-title">Phase ${phaseIdx + 1}: ${phase.name}</div>
            <div class="phase-meta">Duration: ${phase.estimated_weeks} weeks</div>
          </div>
          <div style="font-size: 14px; color: #475569; margin-bottom: 20px; font-style: italic;">${phase.description}</div>
      `
      
      phase.chapters.forEach((chapter: Chapter, chapterIdx: number) => {
        html += `
          <div class="chapter">
            <div class="chapter-title">Chapter ${chapterIdx + 1}: ${chapter.title}</div>
            <div style="font-size: 14px; color: #475569; margin-bottom: 15px; font-style: italic;">${chapter.description}</div>
        `
        
        chapter.lessons.forEach((lesson: Lesson, lessonIdx: number) => {
          html += `
            <div class="lesson">
              <div class="lesson-title">Lesson ${lessonIdx + 1}: ${lesson.title}</div>
              <div class="lesson-details">Duration: ${lesson.duration_minutes} minutes</div>
              <div class="lesson-desc">${lesson.description}</div>
          `
          if (lesson.practice_exercises && lesson.practice_exercises.length > 0) {
            html += `<div style="font-size: 13px; margin-bottom: 4px;"><strong>Practice Exercises:</strong> ${lesson.practice_exercises.join(', ')}</div>`
          }
          if (lesson.resources && lesson.resources.length > 0) {
            html += `<div style="font-size: 13px; margin-bottom: 4px;"><strong>Resources:</strong> ${lesson.resources.map(r => r.title).join(', ')}</div>`
          }
          html += `</div>`
        })
        
        html += `</div>`
      })
      
      html += `</div>`
    })

    if (gen.revision_strategy) {
      html += `
        <div class="section-title">Revision Strategy</div>
        <div class="section-content">${gen.revision_strategy}</div>
      `
    }

    if (gen.interview_preparation) {
      html += `
        <div class="section-title">Interview Preparation</div>
        <div class="section-content">${gen.interview_preparation}</div>
      `
    }

    if (gen.final_assessment) {
      html += `
        <div class="section-title">Final Assessment</div>
        <div class="section-content">${gen.final_assessment}</div>
      `
    }

    html += `
        </body>
      </html>
    `

    doc.open()
    doc.write(html)
    doc.close()

    // Wait for the iframe content to load/render and trigger print
    setTimeout(() => {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
      // Remove the iframe after printing (giving a bit of time for print dialog to show)
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 1000)
    }, 500)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-on-surface-variant">Loading your roadmap...</p>
        </div>
      </div>
    )
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">Roadmap not found</h2>
          <p className="text-on-surface-variant mb-4">The roadmap you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/generate">
            <Button>Create New Roadmap</Button>
          </Link>
        </div>
      </div>
    )
  }

  const generatedRoadmap = roadmap.generated_roadmap
  const totalLessons = generatedRoadmap.overview.total_lessons
  const completedCount = completedLessons.size
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const SidebarContent = () => (
    <div className="p-5">
      <Link href="/generate" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 mb-6 text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Generator
      </Link>

      <div className="mb-6">
        <h2 className="font-headline font-bold text-base text-zinc-100 mb-1.5 leading-snug">
          {generatedRoadmap.overview.title}
        </h2>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>{roadmap.target_months} months</span>
          <span className="text-zinc-700">·</span>
          <span>{totalLessons} lessons</span>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/50">
        <div className="flex justify-between text-sm mb-2.5">
          <span className="text-zinc-500 text-xs font-medium">Progress</span>
          <span className="font-bold text-amber-400 text-xs tabular-nums">{progressPercent}%</span>
        </div>
        <ProgressBar value={progressPercent} size="md" />
        <div className="mt-2.5 flex items-center justify-between text-xs text-zinc-600">
          <span>{completedCount} completed</span>
          <span>{totalLessons - completedCount} remaining</span>
        </div>
      </div>

      {user && roadmap.user_id === user.id ? (
        <div className="mb-5">
          <Button
            variant="secondary"
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleShareToggle}
            isLoading={isSharing}
          >
            <Share2 className="w-4 h-4" />
            {roadmap.is_public ? 'Shared (Copy Link)' : 'Share Roadmap'}
          </Button>
          {roadmap.is_public && (
            <p className="text-[10px] text-amber-500 mt-1 text-center font-medium">
              Public link copied!
            </p>
          )}
        </div>
      ) : (
        <div className="mb-5 p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-xl">
          <p className="text-xs text-zinc-300 text-center font-medium flex items-center justify-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-amber-500" />
            Viewing Shared Roadmap
          </p>
        </div>
      )}

      <div className="mb-6 border-t border-zinc-800/50 pt-4">
        <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest block mb-2.5">
          Export
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={exportToMarkdown}
            className="flex items-center justify-center gap-1.5 text-xs py-2.5 px-2 rounded-xl bg-zinc-900/80 border border-zinc-800/50 text-zinc-400 hover:text-amber-400 hover:border-amber-500/20 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            Markdown
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center justify-center gap-1.5 text-xs py-2.5 px-2 rounded-xl bg-zinc-900/80 border border-zinc-800/50 text-zinc-400 hover:text-amber-400 hover:border-amber-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>
      </div>

      <nav className="space-y-0.5">
        <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest block mb-2">
          Sections
        </span>
        {[
          { href: '#overview', label: 'Overview' },
          { href: '#phases', label: 'Learning Phases' },
          { href: '#resources', label: 'Resources' },
          { href: '#revision', label: 'Revision Strategy' },
          { href: '#interview', label: 'Interview Prep' },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block px-3 py-2 text-sm text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40 rounded-lg transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <Navbar />

      <div className="pt-16 flex">
        <aside className="fixed left-0 top-16 bottom-0 w-72 bg-zinc-950/90 border-r border-zinc-800/40 overflow-y-auto hidden lg:block backdrop-blur-sm">
          <SidebarContent />
        </aside>
        
        <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)}>
          <SidebarContent />
        </MobileSidebar>

        <main className="flex-1 lg:ml-72">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
                <Link href="/generate" className="hover:text-on-surface">Generate</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-on-surface">Roadmap</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high rounded-lg transition-colors">
                    <Menu className="w-5 h-5" />
                  </button>
                  <h1 className="text-3xl font-headline font-bold text-on-surface leading-tight">
                    {generatedRoadmap.overview.title}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:hidden self-start">
                  {user && roadmap.user_id === user.id ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center justify-center gap-2"
                      onClick={handleShareToggle}
                      isLoading={isSharing}
                    >
                      <Share2 className="w-4 h-4" />
                      {roadmap.is_public ? 'Shared (Copy Link)' : 'Share Roadmap'}
                    </Button>
                  ) : (
                    <div className="p-2 bg-primary/10 border border-primary/20 rounded-xl">
                      <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5 text-primary" />
                        Shared
                      </p>
                    </div>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center justify-center gap-1.5"
                    onClick={exportToMarkdown}
                  >
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    Markdown
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center justify-center gap-1.5"
                    onClick={exportToPDF}
                  >
                    <Download className="w-3.5 h-3.5 text-primary" />
                    PDF
                  </Button>
                </div>
              </div>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-prose">
                {generatedRoadmap.overview.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
            >
              {[
                { icon: Clock, value: `${generatedRoadmap.overview.total_estimated_hours}h`, label: 'Total Hours', color: 'from-amber-500/10 to-transparent' },
                { icon: BookOpen, value: totalLessons, label: 'Lessons', color: 'from-orange-500/10 to-transparent' },
                { icon: Target, value: generatedRoadmap.phases.length, label: 'Phases', color: 'from-amber-500/10 to-transparent' },
                { icon: CheckCircle2, value: completedCount, label: 'Completed', color: 'from-orange-500/10 to-transparent' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="relative rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-4 text-center overflow-hidden group hover:border-zinc-700/50 transition-all"
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative">
                    <stat.icon className="w-5 h-5 text-amber-500/70 mx-auto mb-2" />
                    <div className="font-bold text-xl text-zinc-100 font-headline tabular-nums">{stat.value}</div>
                    <div className="text-[11px] text-zinc-500 font-medium mt-0.5">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              id="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Learning Objectives</CardTitle>
                  <CardDescription>Key goals you&apos;ll achieve by the end of this roadmap</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {generatedRoadmap.learning_objectives.map((obj) => (
                      <li key={obj.id} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          obj.mastered ? 'bg-success text-white' : 'bg-surface'
                        }`}>
                          {obj.mastered && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className="text-on-surface-variant">{obj.objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <SkillsRadar roadmap={roadmap} completedLessons={completedLessons} />
            </motion.div>

            <motion.div
              id="phases"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-headline font-bold text-zinc-100 mb-6">Learning Phases</h2>
              <ChapterList
                phases={generatedRoadmap.phases}
                completedLessons={completedLessons}
                bookmarkedLessons={bookmarkedLessons}
                onToggleLesson={toggleLessonComplete}
                onToggleBookmark={toggleBookmark}
                onSelectLesson={setSelectedLesson}
              />
            </motion.div>

            <motion.div
              id="resources"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Curated Resources</CardTitle>
                  <CardDescription>Hand-picked resources to support your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResourcePanel resources={generatedRoadmap.resources} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              id="revision"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Revision Strategy</CardTitle>
                  <CardDescription>How to effectively revise and retain what you learn</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                    {generatedRoadmap.revision_strategy}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              id="interview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Interview Preparation</CardTitle>
                  <CardDescription>Guidance for technical interviews and assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                    {generatedRoadmap.interview_preparation}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Final Assessment</CardTitle>
                  <CardDescription>How to validate your mastery of the subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                    {generatedRoadmap.final_assessment}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>



        <AnimatePresence>
          {selectedLesson && (
            <LessonWorkspace
              lesson={selectedLesson}
              roadmap={roadmap}
              phaseName={selectedLessonPhaseInfo.name}
              phaseDescription={selectedLessonPhaseInfo.description}
              isCompleted={completedLessons.has(selectedLesson.id)}
              isBookmarked={bookmarkedLessons.has(selectedLesson.id)}
              onToggleComplete={() => toggleLessonComplete(selectedLesson.id)}
              onToggleBookmark={() => toggleBookmark(selectedLesson.id)}
              onClose={() => setSelectedLesson(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
