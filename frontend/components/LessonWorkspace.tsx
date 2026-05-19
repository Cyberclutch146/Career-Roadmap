'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { api } from '@/lib/api'
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
  const [activeTab, setActiveTab] = useState<'content' | 'code' | 'interview' | 'notes'>('content')

  // Notes state & auto-save
  const [noteContent, setNoteContent] = useState('')
  const [noteStatus, setNoteStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Coding Sandbox state
  const [htmlCode, setHtmlCode] = useState('<h1>Hello World</h1>\n<p>Start editing to see changes live!</p>\n<button id="btn">Click Me</button>')
  const [cssCode, setCssCode] = useState('body {\n  font-family: sans-serif;\n  background: #f8fafc;\n  padding: 20px;\n  text-align: center;\n}\nh1 {\n  color: #6366f1;\n}\nbutton {\n  background: #6366f1;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  margin-top: 10px;\n}')
  const [jsCode, setJsCode] = useState('document.getElementById("btn").addEventListener("click", () => {\n  alert("Button clicked!");\n});')
  const [sandboxTab, setSandboxTab] = useState<'html' | 'css' | 'js'>('html')
  const [srcDoc, setSrcDoc] = useState('')

  // Interview state
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewHistory, setInterviewHistory] = useState<any[]>([])
  const [userAnswer, setUserAnswer] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [feedback, setFeedback] = useState('')
  const [finalEvaluation, setFinalEvaluation] = useState('')
  const [isInterviewLoading, setIsInterviewLoading] = useState(false)

  // Load Note on Mount or Lesson Change
  useEffect(() => {
    const fetchNote = async () => {
      setNoteStatus('idle')
      if (user) {
        try {
          const { doc, getDoc } = await import('firebase/firestore')
          const { db } = await import('@/lib/firebase')
          const noteDocRef = doc(db, 'users', user.id, 'roadmaps', roadmap.id, 'notes', lesson.id)
          const docSnap = await getDoc(noteDocRef)
          if (docSnap.exists()) {
            setNoteContent(docSnap.data().content || '')
          } else {
            setNoteContent('')
          }
        } catch (e) {
          console.error("Error loading note:", e)
        }
      } else {
        const localNote = window.localStorage.getItem(`note_${roadmap.id}_${lesson.id}`)
        setNoteContent(localNote || '')
      }
    }

    fetchNote()
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
      if (user) {
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
            }
          </script>
        </body>
      </html>
    `)
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
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-16 right-0 bottom-0 w-full lg:w-[60%] bg-paper-50 shadow-2xl border-l border-paper-300 z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-white border-b border-paper-300 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleComplete}
            className="flex-shrink-0"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-success" />
            ) : (
              <Circle className="w-6 h-6 text-ink-300 hover:text-accent transition-colors" />
            )}
          </button>
          <div>
            <h2 className="font-serif font-bold text-lg text-ink-900 leading-tight">
              {lesson.title}
            </h2>
            <p className="text-xs text-ink-400 mt-0.5">
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
                ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                : 'text-ink-300 hover:text-amber-400 hover:bg-amber-50'
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
            className="p-1.5 hover:bg-paper-100 rounded-lg text-ink-400 hover:text-ink-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="bg-white border-b border-paper-200 px-5 flex gap-4 text-sm font-medium">
        <button
          onClick={() => setActiveTab('content')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'content'
              ? 'border-accent text-accent'
              : 'border-transparent text-ink-500 hover:text-ink-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Lesson & Resources
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'code'
              ? 'border-accent text-accent'
              : 'border-transparent text-ink-500 hover:text-ink-900'
          }`}
        >
          <Code className="w-4 h-4" />
          Playground
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'interview'
              ? 'border-accent text-accent'
              : 'border-transparent text-ink-500 hover:text-ink-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          AI Mock Interview
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'notes'
              ? 'border-accent text-accent'
              : 'border-transparent text-ink-500 hover:text-ink-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Notes Workspace
        </button>
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
              className="space-y-6"
            >
              {/* Lesson Description */}
              <div className="bg-white p-5 rounded-xl border border-paper-300">
                <h3 className="text-sm font-semibold text-ink-400 uppercase tracking-wider mb-2">Lesson Overview</h3>
                <p className="text-ink-700 leading-relaxed whitespace-pre-wrap">{lesson.description}</p>
              </div>

              {/* YouTube split screen or integrated video player */}
              {youtubeId && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-ink-400 uppercase tracking-wider">Lesson Video</h3>
                  <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-paper-300 shadow-sm">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={mainVideo?.title || 'YouTube Player'}
                    />
                  </div>
                  <p className="text-xs text-ink-500 italic">
                    Source: <a href={mainVideo?.url} target="_blank" rel="noreferrer" className="text-accent underline">{mainVideo?.title}</a>
                  </p>
                </div>
              )}

              {/* Practice Exercises */}
              {lesson.practice_exercises && lesson.practice_exercises.length > 0 && (
                <div className="bg-white p-5 rounded-xl border border-paper-300">
                  <h3 className="text-sm font-semibold text-ink-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-accent" />
                    Practice Exercises
                  </h3>
                  <ul className="space-y-2.5">
                    {lesson.practice_exercises.map((exercise, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-sm text-ink-700">
                        <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{exercise}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Resources */}
              {otherResources.length > 0 && (
                <div className="bg-white p-5 rounded-xl border border-paper-300">
                  <h3 className="text-sm font-semibold text-ink-400 uppercase tracking-wider mb-3">Additional Readings & Resources</h3>
                  <div className="grid gap-3">
                    {otherResources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start justify-between p-3 border border-paper-200 rounded-lg hover:border-accent/30 hover:bg-accent/[0.02] transition-all"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-ink-900">{res.title}</h4>
                          {res.description && <p className="text-xs text-ink-500 mt-1">{res.description}</p>}
                        </div>
                        <span className="text-[10px] font-semibold text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-full mt-0.5">
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
              <div className="bg-white rounded-xl border border-paper-300 overflow-hidden flex flex-col flex-1 min-h-[300px]">
                {/* Sandbox tabs */}
                <div className="bg-paper-100 px-4 py-2 border-b border-paper-200 flex items-center justify-between">
                  <div className="flex gap-2">
                    {(['html', 'css', 'js'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setSandboxTab(tab)}
                        className={`text-xs px-3 py-1.5 rounded-md font-semibold uppercase tracking-wider transition-colors ${
                          sandboxTab === tab
                            ? 'bg-white text-ink-900 shadow-sm border border-paper-200'
                            : 'text-ink-500 hover:text-ink-900'
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
                <div className="flex-1 flex flex-col p-4">
                  {sandboxTab === 'html' && (
                    <textarea
                      value={htmlCode}
                      onChange={e => setHtmlCode(e.target.value)}
                      className="w-full h-full font-mono text-sm p-3 border border-paper-200 rounded-lg outline-none focus:border-accent resize-none bg-paper-50"
                    />
                  )}
                  {sandboxTab === 'css' && (
                    <textarea
                      value={cssCode}
                      onChange={e => setCssCode(e.target.value)}
                      className="w-full h-full font-mono text-sm p-3 border border-paper-200 rounded-lg outline-none focus:border-accent resize-none bg-paper-50"
                    />
                  )}
                  {sandboxTab === 'js' && (
                    <textarea
                      value={jsCode}
                      onChange={e => setJsCode(e.target.value)}
                      className="w-full h-full font-mono text-sm p-3 border border-paper-200 rounded-lg outline-none focus:border-accent resize-none bg-paper-50"
                    />
                  )}
                </div>
              </div>

              {/* Output Preview */}
              <div className="flex flex-col h-[280px] bg-white rounded-xl border border-paper-300 overflow-hidden shadow-sm">
                <div className="bg-paper-100 px-4 py-2 border-b border-paper-200 flex items-center justify-between text-xs font-semibold text-ink-500 uppercase tracking-wider">
                  Live Preview Output
                </div>
                <div className="flex-1 bg-white">
                  {srcDoc ? (
                    <iframe
                      srcDoc={srcDoc}
                      title="Live Preview"
                      sandbox="allow-scripts"
                      className="w-full h-full border-none"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-ink-400">
                      Click "Run Code" to preview changes
                    </div>
                  )}
                </div>
              </div>
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
                <div className="bg-white p-6 rounded-xl border border-paper-300 text-center space-y-4 shadow-sm">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-ink-900">AI Mock Technical Interview</h3>
                  <p className="text-sm text-ink-500 max-w-md mx-auto leading-relaxed">
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
                        <div className="bg-accent/5 border border-accent/10 rounded-xl p-4">
                          <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
                            Question {idx + 1}
                          </p>
                          <p className="text-sm font-medium text-ink-900">{item.question}</p>
                        </div>
                        {/* Answer & Feedback */}
                        {item.answer && (
                          <div className="bg-white border border-paper-300 rounded-xl p-4 space-y-2">
                            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">
                              Your Answer
                            </p>
                            <p className="text-sm text-ink-700 italic">"{item.answer}"</p>

                            {item.feedback && (
                              <div className="mt-3 border-t border-paper-200 pt-2">
                                <p className="text-xs font-semibold text-success-dark uppercase tracking-wider flex items-center gap-1 mb-1">
                                  <BookmarkCheck className="w-3.5 h-3.5" />
                                  Interviewer Feedback
                                </p>
                                <p className="text-sm text-ink-700 leading-relaxed">{item.feedback}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Current Active Question or Final Score */}
                  {currentQuestion ? (
                    <Card className="p-4 border border-accent/20 bg-accent/[0.01] shadow-sm">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <div className="space-y-3 flex-1">
                          <p className="text-sm font-semibold text-ink-900 leading-relaxed">
                            {currentQuestion}
                          </p>
                          <textarea
                            value={userAnswer}
                            onChange={e => setUserAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            rows={3}
                            disabled={isInterviewLoading}
                            className="w-full text-sm p-3 border border-paper-200 rounded-lg outline-none focus:border-accent resize-none bg-white shadow-inner"
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
                          <h4 className="font-serif font-bold text-lg">Interview Evaluation Completed!</h4>
                        </div>
                        <div className="text-sm text-ink-700 leading-relaxed prose max-w-none whitespace-pre-line">
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
              <div className="flex-1 flex flex-col bg-white rounded-xl border border-paper-300 p-4 shadow-sm min-h-[350px]">
                <div className="flex items-center justify-between text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">
                  <span>Take notes as you learn</span>
                  <span className="flex items-center gap-1 font-medium lowercase">
                    {noteStatus === 'saving' && (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-accent" />
                        saving...
                      </>
                    )}
                    {noteStatus === 'saved' && (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-success" />
                        saved
                      </>
                    )}
                    {noteStatus === 'error' && (
                      <>
                        <AlertCircle className="w-3 h-3 text-danger" />
                        error saving
                      </>
                    )}
                  </span>
                </div>
                <textarea
                  value={noteContent}
                  onChange={e => handleNoteChange(e.target.value)}
                  placeholder="Notes are automatically saved to your library..."
                  className="w-full flex-1 p-3 border border-paper-200 rounded-lg outline-none focus:border-accent resize-none bg-paper-50 font-sans text-sm leading-relaxed"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
