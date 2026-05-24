'use client'

import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { useStore } from '@/store'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { RichTextEditor } from './RichTextEditor'
import { api } from '@/lib/api'
import { shouldSyncWithFirestore } from '@/lib/sync'
import {
  X,
  BookOpen,
  Code,
  MessageSquare,
  FileText,
  Video,
  Play,
  RotateCcw,
  CheckCircle2,
  Circle,
  HelpCircle,
  AlertCircle,
  Sparkles,
  Loader2,
  BookmarkCheck,
  Bookmark,
} from 'lucide-react'
import type { Lesson, Roadmap, ResourceItem } from '@/types'

interface LessonWorkspaceProps {
  lesson: Lesson
  roadmap: Roadmap
  phaseName: string
  phaseDescription: string
  isCompleted: boolean
  isBookmarked: boolean
  onToggleComplete: () => void
  onToggleBookmark: () => void
  onClose: () => void
}

export function LessonWorkspace({
  lesson,
  roadmap,
  phaseName,
  phaseDescription,
  isCompleted,
  isBookmarked,
  onToggleComplete,
  onToggleBookmark,
  onClose,
}: LessonWorkspaceProps) {
  const { user } = useStore()
  const [activeTab, setActiveTab] = useState<'content' | 'code' | 'interview' | 'notes' | 'cheatsheet'>('content')

  // Notes state & auto-save
  const [noteContent, setNoteContent] = useState('')
  const [noteStatus, setNoteStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cheat Sheet State
  const [cheatSheetContent, setCheatSheetContent] = useState('')
  const [cheatSheetStatus, setCheatSheetStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const cheatSheetSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Coding Sandbox state
  const [htmlCode, setHtmlCode] = useState('<h1>Hello World</h1>\n<p>Start editing to see changes live!</p>\n<button id="btn">Click Me</button>')
  const [cssCode, setCssCode] = useState('body {\n  font-family: sans-serif;\n  background: #f8fafc;\n  padding: 20px;\n  text-align: center;\n}\nh1 {\n  color: #6366f1;\n}\nbutton {\n  background: #6366f1;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  margin-top: 10px;\n}')
  const [jsCode, setJsCode] = useState('document.getElementById("btn").addEventListener("click", () => {\n  alert("Button clicked!");\n});')
  const [sandboxTab, setSandboxTab] = useState<'html' | 'css' | 'js'>('html')
  const [srcDoc, setSrcDoc] = useState('')
  const [isExecutingCode, setIsExecutingCode] = useState(false)

  // Interview state
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewHistory, setInterviewHistory] = useState<any[]>([])
  const [userAnswer, setUserAnswer] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [feedback, setFeedback] = useState('')
  const [finalEvaluation, setFinalEvaluation] = useState('')
  const [isInterviewLoading, setIsInterviewLoading] = useState(false)

  // Debugger state
  const [executionError, setExecutionError] = useState<string | null>(null)
  const [isDebugging, setIsDebugging] = useState(false)
  const [debugExplanation, setDebugExplanation] = useState<string | null>(null)
  const [debugFixedCode, setDebugFixedCode] = useState<string | null>(null)
  const [rateLimitNote, setRateLimitNote] = useState<string | null>(null)

  // Summarizer state
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'EXECUTION_ERROR') {
        setExecutionError(event.data.error)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Load Note on Mount or Lesson Change
  useEffect(() => {
    const fetchNoteAndCheatSheet = async () => {
      setNoteStatus('idle')
      setCheatSheetStatus('idle')
      const syncWithFirestore = shouldSyncWithFirestore(user)
      if (user && syncWithFirestore) {
        try {
          const { doc, getDoc } = await import('firebase/firestore')
          const { db } = await import('@/lib/firebase')
          
          const noteDocRef = doc(db, 'users', user.id, 'roadmaps', roadmap.id, 'notes', lesson.id)
          const noteSnap = await getDoc(noteDocRef)
          if (noteSnap.exists()) {
            setNoteContent(noteSnap.data().content || '')
          } else {
            setNoteContent('')
          }

          const cheatSheetRef = doc(db, 'users', user.id, 'roadmaps', roadmap.id, 'cheatsheets', lesson.id)
          const cheatSnap = await getDoc(cheatSheetRef)
          if (cheatSnap.exists()) {
            setCheatSheetContent(cheatSnap.data().content || '')
          } else {
            setCheatSheetContent('')
          }
        } catch (e) {
          console.error("Error loading note or cheat sheet:", e)
        }
      } else {
        const localNote = window.localStorage.getItem(`note_${roadmap.id}_${lesson.id}`)
        setNoteContent(localNote || '')
        
        const localCheatSheet = window.localStorage.getItem(`cheatsheet_${roadmap.id}_${lesson.id}`)
        setCheatSheetContent(localCheatSheet || '')
      }
    }

    fetchNoteAndCheatSheet()
    // Reset interview & playground states when switching lessons
    setInterviewStarted(false)
    setInterviewHistory([])
    setUserAnswer('')
    setCurrentQuestion('')
    setFeedback('')
    setFinalEvaluation('')

    // Populate code editor with lesson-specific template
    const defaultHtml = `<!-- Lesson: ${lesson.title} -->\n<div style="padding: 20px; background: white; border-radius: 8px; border: 1px solid #e2e8f0; max-width: 500px; margin: 0 auto;">\n  <h1 style="color: #4f46e5; margin-top: 0;">${lesson.title}</h1>\n  <p style="color: #475569; font-size: 14px;">Use this sandbox to work through the practice exercises!</p>\n  <button id="action-btn" style="background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Execute Code</button>\n  <div id="output" style="margin-top: 15px; padding: 10px; background: #f8fafc; border-radius: 6px; min-height: 40px; font-family: monospace; font-size: 13px; border: 1px solid #f1f5f9; color: #334155;">\n    Console output will appear here...\n  </div>\n</div>`
    const defaultCss = `/* Custom Styles for ${lesson.title} */\nbody {\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;\n  padding: 20px;\n  background-color: #f8fafc;\n}`
    const exercisesComment = lesson.practice_exercises && lesson.practice_exercises.length > 0
      ? lesson.practice_exercises.map((ex, i) => `// Exercise ${i + 1}: ${ex}`).join('\n')
      : '// Try implementing the concepts of this lesson!'
    
    const defaultJs = `${exercisesComment}\n\n// Helper to write to output element\nconst log = (msg) => {\n  const out = document.getElementById("output");\n  if (out) out.innerText = msg;\n};\n\n// Action button handler\ndocument.getElementById("action-btn")?.addEventListener("click", () => {\n  log("JavaScript action triggered!");\n});\n`

    setHtmlCode(defaultHtml)
    setCssCode(defaultCss)
    setJsCode(defaultJs)
    
    setSrcDoc(`
      <html>
        <head>
          <style>${defaultCss}</style>
        </head>
        <body>
          ${defaultHtml}
          <script>
            try {
              ${defaultJs}
            } catch (err) {
              console.error(err);
              document.body.innerHTML += '<div style="color:red; margin-top:15px; font-weight:bold;">Error: ' + err.message + '</div>';
              window.parent.postMessage({ type: 'EXECUTION_ERROR', error: err.message }, '*');
            }
          </script>
        </body>
      </html>
    `)
  }, [lesson.id, roadmap.id, user])

  // Save Note logic
  const handleNoteChange = (val: string) => {
    setNoteContent(val)
    setNoteStatus('saving')

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(async () => {
      const syncWithFirestore = shouldSyncWithFirestore(user)
      if (user && syncWithFirestore) {
        try {
          const { doc, setDoc } = await import('firebase/firestore')
          const { db } = await import('@/lib/firebase')
          const noteDocRef = doc(db, 'users', user.id, 'roadmaps', roadmap.id, 'notes', lesson.id)
          await setDoc(noteDocRef, {
            content: val,
            updated_at: new Date().toISOString()
          }, { merge: true })
          setNoteStatus('saved')
        } catch (e) {
          console.error(e)
          setNoteStatus('error')
        }
      } else {
        try {
          window.localStorage.setItem(`note_${roadmap.id}_${lesson.id}`, val)
          setNoteStatus('saved')
        } catch (e) {
          setNoteStatus('error')
        }
      }
    }, 1000)
  }

  // Save Cheat Sheet logic
  const handleCheatSheetChange = (val: string) => {
    setCheatSheetContent(val)
    setCheatSheetStatus('saving')

    if (cheatSheetSaveTimeoutRef.current) clearTimeout(cheatSheetSaveTimeoutRef.current)

    cheatSheetSaveTimeoutRef.current = setTimeout(async () => {
      const syncWithFirestore = shouldSyncWithFirestore(user)
      if (user && syncWithFirestore) {
        try {
          const { doc, setDoc } = await import('firebase/firestore')
          const { db } = await import('@/lib/firebase')
          const cheatSheetRef = doc(db, 'users', user.id, 'roadmaps', roadmap.id, 'cheatsheets', lesson.id)
          await setDoc(cheatSheetRef, {
            content: val,
            updated_at: new Date().toISOString()
          }, { merge: true })
          setCheatSheetStatus('saved')
        } catch (e) {
          console.error(e)
          setCheatSheetStatus('error')
        }
      } else {
        try {
          window.localStorage.setItem(`cheatsheet_${roadmap.id}_${lesson.id}`, val)
          setCheatSheetStatus('saved')
        } catch (e) {
          setCheatSheetStatus('error')
        }
      }
    }, 1000)
  }

  // Extract YouTube ID helper
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const videoResources = lesson.resources.filter(r => r.type === 'video')
  const otherResources = lesson.resources.filter(r => r.type !== 'video')
  const mainVideo = videoResources.length > 0 ? videoResources[0] : null
  const youtubeId = mainVideo ? getYouTubeId(mainVideo.url) : null

  // Run Code logic
  const runCode = () => {
    setIsExecutingCode(true)
    setExecutionError(null)
    setDebugExplanation(null)
    setDebugFixedCode(null)
    setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>${cssCode}</style>
          </head>
          <body>
            ${htmlCode}
            <script>
              try {
                ${jsCode}
              } catch (err) {
                console.error(err);
                document.body.innerHTML += '<div style="color:red; margin-top:15px; font-weight:bold;">Error: ' + err.message + '</div>';
                window.parent.postMessage({ type: 'EXECUTION_ERROR', error: err.message }, '*');
              }
            </script>
          </body>
        </html>
      `)
      setTimeout(() => setIsExecutingCode(false), 200)
    }, 100)
  }

  const handleDebug = async () => {
    if (!executionError) return
    setIsDebugging(true)
    setRateLimitNote(null)
    try {
      const response = await api.post('/api/debug', {
        js_code: jsCode,
        html_code: htmlCode,
        css_code: cssCode,
        error_message: executionError
      })
      setDebugExplanation(response.data.explanation)
      setDebugFixedCode(response.data.fixed_code)
    } catch (e: any) {
      if (e.response?.status === 429) {
        setRateLimitNote('Rate limit exceeded (5/min). Please try again in a minute. (Note: Since this is a portfolio project, strict limits apply!)')
      } else {
        setRateLimitNote('An error occurred while debugging.')
      }
      console.error(e)
    } finally {
      setIsDebugging(false)
    }
  }

  const applyDebugFix = () => {
    if (debugFixedCode) {
      setJsCode(debugFixedCode)
      setExecutionError(null)
      setDebugExplanation(null)
      setDebugFixedCode(null)
      setSandboxTab('js')
    }
  }

  const generateCheatSheet = async () => {
    setIsGeneratingSummary(true)
    setRateLimitNote(null)
    try {
      const response = await api.post('/api/summarize', {
        lesson_title: lesson.title,
        lesson_description: lesson.description,
        resources: lesson.resources,
        exercises: lesson.practice_exercises || []
      })
      const newSummary = response.data.markdown_summary
      handleCheatSheetChange(newSummary)
      setActiveTab('cheatsheet')
    } catch (e: any) {
      if (e.response?.status === 429) {
        setRateLimitNote('Rate limit exceeded (3/min). Please try again later. (Note: Since this is a portfolio project, strict limits apply!)')
      } else {
        setRateLimitNote('An error occurred while generating the cheat sheet.')
      }
      console.error(e)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  // Mock Interview Handlers
  const startInterview = async () => {
    setIsInterviewLoading(true)
    try {
      const response = await api.post('/api/interview/chat', {
        roadmap_goal: roadmap.goal,
        phase_name: phaseName,
        phase_description: phaseDescription,
        user_answer: '',
        history: []
      })
      const data = response.data
      setCurrentQuestion(data.next_question)
      setInterviewHistory(data.history || [])
      setInterviewStarted(true)
    } catch (e) {
      console.error("Failed to start mock interview:", e)
    } finally {
      setIsInterviewLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return
    setIsInterviewLoading(true)
    try {
      const response = await api.post('/api/interview/chat', {
        roadmap_goal: roadmap.goal,
        phase_name: phaseName,
        phase_description: phaseDescription,
        user_answer: userAnswer,
        history: interviewHistory
      })
      const data = response.data
      setFeedback(data.feedback)
      setInterviewHistory(data.history || [])
      setUserAnswer('')

      if (data.next_question) {
        setCurrentQuestion(data.next_question)
      } else {
        setCurrentQuestion('')
        setFinalEvaluation(data.final_evaluation)
      }
    } catch (e) {
      console.error("Failed to submit interview answer:", e)
    } finally {
      setIsInterviewLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 lg:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full h-full lg:max-w-6xl lg:h-[90vh] bg-zinc-950/70 backdrop-blur-3xl lg:rounded-3xl lg:ring-1 lg:ring-white/10 shadow-[0_16px_64px_-12px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
      >
      {/* Header */}
      <div className="bg-white/[0.02] border-b border-white/5 p-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleComplete}
            className="flex-shrink-0"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-success" />
            ) : (
              <Circle className="w-6 h-6 text-on-surface-variant hover:text-primary transition-colors" />
            )}
          </button>
          <div>
            <h2 className="font-headline font-bold text-lg text-on-surface leading-tight">
              {lesson.title}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Phase: {phaseName} • {lesson.duration_minutes} mins
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Bookmark toggle */}
          <button
            onClick={onToggleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-amber-500 hover:text-amber-600 bg-amber-500/10'
                : 'text-on-surface-variant hover:text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs list (iOS Segmented Control Style) */}
      <div className="bg-zinc-950/40 border-b border-white/5 px-6 py-4 flex gap-2 overflow-x-auto scrollbar-hide shrink-0 z-10 backdrop-blur-md">
        {[
          { id: 'content', label: 'Lesson & Resources', icon: BookOpen },
          { id: 'code', label: 'Playground', icon: Code },
          { id: 'interview', label: 'AI Mock Interview', icon: MessageSquare },
          { id: 'notes', label: 'Notes Workspace', icon: FileText },
          { id: 'cheatsheet', label: 'Cheat Sheet', icon: Sparkles },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary' : ''}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Workspace Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              {/* Lesson Description */}
              <div className="bg-white/[0.02] p-8 rounded-2xl border border-white/5 ring-1 ring-white/5 shadow-sm">
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Lesson Overview</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-base">{lesson.description}</p>
              </div>

              {/* YouTube split screen or integrated video player */}
              {youtubeId && (
                <div className="bg-white/[0.02] p-8 rounded-2xl border border-white/5 ring-1 ring-white/5 shadow-sm space-y-4">
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Lesson Video</h3>
                  <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={mainVideo?.title || 'YouTube Player'}
                    />
                  </div>
                  <p className="text-xs text-white/40 italic">
                    Source: <a href={mainVideo?.url} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80 transition-colors underline">{mainVideo?.title}</a>
                  </p>
                </div>
              )}

              {/* Practice Exercises */}
              {lesson.practice_exercises && lesson.practice_exercises.length > 0 && (
                <div className="bg-white/[0.02] p-8 rounded-2xl border border-white/5 ring-1 ring-white/5 shadow-sm">
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Practice Exercises
                  </h3>
                  <ul className="space-y-2">
                    {lesson.practice_exercises.map((exercise, idx) => (
                      <li key={idx} className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/5 transition-colors duration-300 group">
                        <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-white/70 flex items-center justify-center font-medium text-xs mt-0.5 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all shadow-sm shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-white/80 leading-relaxed pt-0.5 text-sm">{exercise}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Resources */}
              {otherResources.length > 0 && (
                <div className="bg-white/[0.02] p-8 rounded-2xl border border-white/5 ring-1 ring-white/5 shadow-sm">
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-6">Additional Readings & Resources</h3>
                  <div className="grid gap-3">
                    {otherResources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-start justify-between p-4 bg-white/[0.01] border border-white/5 rounded-xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 shadow-sm"
                      >
                        <div>
                          <h4 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">{res.title}</h4>
                          {res.description && <p className="text-xs text-white/50 mt-1.5">{res.description}</p>}
                        </div>
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-md mt-0.5 ring-1 ring-primary/20">
                          {res.type}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex flex-col space-y-4"
            >
              <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/40 overflow-hidden flex flex-col flex-1 min-h-[300px]">
                {/* Sandbox tabs */}
                <div className="bg-surface-container px-4 py-2 border-b border-border flex items-center justify-between">
                  <div className="flex gap-2">
                    {(['html', 'css', 'js'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setSandboxTab(tab)}
                        className={`text-xs px-3 py-1.5 rounded-md font-semibold uppercase tracking-wider transition-colors ${
                          sandboxTab === tab
                            ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="flex items-center gap-1 text-xs py-1"
                    onClick={runCode}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Run Code
                  </Button>
                </div>

                {/* Editors */}
                <div className="flex-1 flex flex-col p-4 bg-[#1e1e1e]">
                  {sandboxTab === 'html' && (
                    <Editor
                      height="100%"
                      defaultLanguage="html"
                      theme="vs-dark"
                      value={htmlCode}
                      onChange={(val) => setHtmlCode(val || '')}
                      options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
                    />
                  )}
                  {sandboxTab === 'css' && (
                    <Editor
                      height="100%"
                      defaultLanguage="css"
                      theme="vs-dark"
                      value={cssCode}
                      onChange={(val) => setCssCode(val || '')}
                      options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
                    />
                  )}
                  {sandboxTab === 'js' && (
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={jsCode}
                      onChange={(val) => setJsCode(val || '')}
                      options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
                    />
                  )}
                </div>
              </div>

              {/* Output Preview */}
              <div className="flex flex-col h-[280px] bg-zinc-900/60 rounded-xl border border-zinc-800/40 overflow-hidden shadow-sm relative">
                <div className="bg-surface-container px-4 py-2 border-b border-border flex items-center justify-between text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Live Preview Output
                </div>
                <div className="flex-1 bg-zinc-950 relative">
                  {isExecutingCode && (
                    <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      </div>
                      <span className="text-xs font-medium text-primary uppercase tracking-wider">Compiling...</span>
                    </div>
                  )}
                  {srcDoc ? (
                    <iframe
                      srcDoc={srcDoc}
                      title="Live Preview"
                      sandbox="allow-scripts"
                      className="w-full h-full border-none"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-sm text-on-surface-variant">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 animate-pulse">
                        <Code className="w-6 h-6 text-primary" />
                      </div>
                      <p>Click <span className="font-semibold text-primary">Run Code</span> to preview changes</p>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Debugger UI */}
              {executionError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex flex-col gap-3 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="font-semibold text-sm line-clamp-2">Error Detected! Let AI help you fix it.</span>
                    </div>
                    <Button size="sm" onClick={handleDebug} disabled={isDebugging} className="flex-shrink-0 ml-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700">
                      {isDebugging ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2 text-indigo-400" />}
                      AI Debugger
                    </Button>
                  </div>
                  {rateLimitNote && isDebugging === false && (
                    <p className="text-xs text-red-400">{rateLimitNote}</p>
                  )}
                  {debugExplanation && (
                    <div className="mt-2 space-y-3">
                      <div className="p-3 bg-zinc-950/80 rounded-lg text-sm text-zinc-300 border border-zinc-800/80 leading-relaxed whitespace-pre-line">
                        {debugExplanation}
                      </div>
                      <div className="flex justify-end">
                        <Button size="sm" variant="primary" onClick={applyDebugFix} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Apply Fix
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'interview' && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {!interviewStarted ? (
                <div className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800/40 text-center space-y-4 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">AI Mock Technical Interview</h3>
                  <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                    Test your understanding of the concepts in <strong>{phaseName}</strong>. 
                    The AI will ask you 3 challenging conceptual questions one by one, evaluate your answers, 
                    and give you a final technical score.
                  </p>
                  <Button
                    onClick={startInterview}
                    isLoading={isInterviewLoading}
                    className="flex items-center justify-center gap-2 mx-auto"
                  >
                    <Sparkles className="w-4 h-4" />
                    Start Mock Interview
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Transcript History */}
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                    {interviewHistory.map((item, idx) => (
                      <div key={idx} className="space-y-3">
                        {/* Question */}
                        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                            Question {idx + 1}
                          </p>
                          <p className="text-sm font-medium text-on-surface">{item.question}</p>
                        </div>
                        {/* Answer & Feedback */}
                        {item.answer && (
                          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
                            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                              Your Answer
                            </p>
                            <p className="text-sm text-on-surface-variant italic">"{item.answer}"</p>

                            {item.feedback && (
                              <div className="mt-3 border-t border-border pt-2">
                                <p className="text-xs font-semibold text-success-dark uppercase tracking-wider flex items-center gap-1 mb-1">
                                  <BookmarkCheck className="w-3.5 h-3.5" />
                                  Interviewer Feedback
                                </p>
                                <p className="text-sm text-on-surface-variant leading-relaxed">{item.feedback}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Current Active Question or Final Score */}
                  {currentQuestion ? (
                    <Card className="p-4 border border-primary/20 bg-primary/[0.01] shadow-sm">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="space-y-3 flex-1">
                          <p className="text-sm font-semibold text-on-surface leading-relaxed">
                            {currentQuestion}
                          </p>
                          <textarea
                            value={userAnswer}
                            onChange={e => setUserAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            rows={3}
                            disabled={isInterviewLoading}
                            className="w-full text-sm p-3 border border-zinc-800 rounded-lg outline-none focus:border-primary resize-none bg-zinc-900 text-zinc-200 shadow-inner"
                          />
                          <div className="flex justify-end">
                            <Button
                              onClick={submitAnswer}
                              disabled={!userAnswer.trim() || isInterviewLoading}
                              className="text-xs"
                            >
                              {isInterviewLoading ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                                  Evaluating...
                                </>
                              ) : (
                                'Submit Answer'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    finalEvaluation && (
                      <Card className="p-6 border border-success/20 bg-success/[0.01] shadow-sm space-y-4">
                        <div className="flex items-center gap-2.5 text-success-dark">
                          <Sparkles className="w-5 h-5" />
                          <h4 className="font-headline font-bold text-lg">Interview Evaluation Completed!</h4>
                        </div>
                        <div className="text-sm text-on-surface-variant leading-relaxed prose max-w-none whitespace-pre-line">
                          {finalEvaluation}
                        </div>
                        <div className="flex justify-center pt-2">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setInterviewStarted(false)
                              setInterviewHistory([])
                              setFinalEvaluation('')
                            }}
                            className="text-xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                            Restart Interview
                          </Button>
                        </div>
                      </Card>
                    )
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex flex-col space-y-4"
            >
              <div className="flex-1 flex flex-col bg-zinc-900/60 rounded-xl border border-zinc-800/40 p-4 shadow-sm min-h-[350px]">
                <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                  <div className="flex items-center gap-3">
                    <span>Take notes as you learn</span>
                  </div>
                  <AnimatePresence>
                    {noteStatus !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium lowercase shadow-sm ${
                          noteStatus === 'saving' ? 'bg-primary/10 text-primary' :
                          noteStatus === 'saved' ? 'bg-success/10 text-success-dark' :
                          'bg-error/10 text-error'
                        }`}
                      >
                        {noteStatus === 'saving' && (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            saving...
                          </>
                        )}
                        {noteStatus === 'saved' && (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            saved
                          </>
                        )}
                        {noteStatus === 'error' && (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            error saving
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {rateLimitNote && !isGeneratingSummary && (
                  <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 font-medium">
                    {rateLimitNote}
                  </div>
                )}
                <div className="flex-1 min-h-[400px]">
                  <RichTextEditor
                    content={noteContent}
                    onChange={handleNoteChange}
                    placeholder="Notes are automatically saved to your library..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'cheatsheet' && (
            <motion.div
              key="cheatsheet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex flex-col space-y-4"
            >
              {rateLimitNote && (
                <div className="text-amber-500 text-xs bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-center">
                  {rateLimitNote}
                </div>
              )}
              
              {!cheatSheetContent ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900/60 rounded-xl border border-zinc-800/40 p-8 shadow-sm text-center">
                  <Sparkles className="w-12 h-12 text-indigo-400/50 mb-4" />
                  <h3 className="font-headline font-semibold text-zinc-200 mb-2">No Cheat Sheet Generated</h3>
                  <p className="text-zinc-500 text-sm max-w-sm mb-6">
                    Use AI to instantly generate a summarized, markdown-formatted cheat sheet from this lesson's content.
                  </p>
                  <Button 
                    onClick={generateCheatSheet} 
                    disabled={isGeneratingSummary}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isGeneratingSummary ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" /> Generate Cheat Sheet</>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col bg-zinc-900/60 rounded-xl border border-zinc-800/40 p-6 shadow-sm overflow-y-auto">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
                    <h3 className="font-headline font-semibold text-zinc-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      Lesson Summary
                    </h3>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={generateCheatSheet} 
                      disabled={isGeneratingSummary}
                      className="text-xs h-8"
                    >
                      {isGeneratingSummary ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <RotateCcw className="w-3 h-3 mr-1.5" />}
                      Regenerate
                    </Button>
                  </div>
                  <div className="prose prose-invert prose-indigo max-w-none prose-sm sm:prose-base">
                    <ReactMarkdown>{cheatSheetContent}</ReactMarkdown>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
    </div>
  )
}
