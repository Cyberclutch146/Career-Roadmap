'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { X, Send, Bot, User, Sparkles, Brain } from 'lucide-react'
import { api } from '@/lib/api'
import { useStore } from '@/store'
import type { Roadmap, ChatMessage } from '@/types'
import ReactMarkdown from 'react-markdown'

interface AIMentorProps {
  roadmap?: Roadmap | null
  onClose: () => void
}

function ActionRenderer({ action, onSend }: { action: { type: string; payload: any }, onSend: (msg: string) => void }) {
  const router = useRouter()
  if (!action) return null
  
  if (action.type === 'navigate_to_view') {
    return (
      <div className="mt-2 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
        <p className="text-xs text-zinc-300 mb-2">I can take you there:</p>
        <button 
          onClick={() => router.push(action.payload.view_name === 'dashboard' ? '/dashboard' : '/')}
          className="text-xs px-3 py-1.5 bg-amber-500 text-black rounded-lg hover:bg-amber-400 font-semibold"
        >
          Go to {action.payload.view_name}
        </button>
      </div>
    )
  }
  
  if (action.type === 'generate_mini_quiz') {
    return (
      <div className="mt-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
        <p className="text-xs text-amber-500 font-semibold mb-2">Mini Quiz Generated!</p>
        <p className="text-xs text-zinc-300">Topic: {action.payload.topic}</p>
        <button 
          onClick={() => onSend(`Please give me a 3-question mini quiz about ${action.payload.topic}. Ask me one question at a time and wait for my answer before grading it.`)}
          className="mt-2 text-xs px-3 py-1.5 bg-zinc-800 text-zinc-200 rounded-lg border border-zinc-700 hover:bg-zinc-700">
          Start Quiz
        </button>
      </div>
    )
  }

  if (action.type === 'update_lesson_status') {
    return (
      <div className="mt-2 p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-xs text-emerald-400">Lesson updated in roadmap.</p>
      </div>
    )
  }

  return null
}

const generalQuestions = [
  'What should I learn next?',
  'Help me pick a career path',
  'Explain a concept to me',
]

const roadmapQuestions = [
  'What should I learn next?',
  'Explain this concept simply',
  'Give me practice exercises',
]

/** Renders assistant markdown content with code-block and inline-code styles */
function MarkdownMessage({ content, isUser }: { content: string; isUser: boolean }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p className="text-sm leading-relaxed mb-1 last:mb-0">{children}</p>
        ),
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-0.5 text-sm my-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-0.5 text-sm my-1">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        code: ({ inline, children }: any) =>
          inline ? (
            <code
              className={`px-1 py-0.5 rounded text-xs font-mono ${
                isUser ? 'bg-white/20 text-white' : 'bg-zinc-800 text-amber-300'
              }`}
            >
              {children}
            </code>
          ) : (
            <pre
              className={`my-2 p-3 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap ${
                isUser ? 'bg-white/20 text-white' : 'bg-zinc-900 text-green-300 border border-zinc-800'
              }`}
            >
              <code>{children}</code>
            </pre>
          ),
        blockquote: ({ children }) => (
          <blockquote
            className={`border-l-2 pl-3 my-1 italic text-sm ${
              isUser ? 'border-white/40 text-white/80' : 'border-amber-500/40 text-zinc-400'
            }`}
          >
            {children}
          </blockquote>
        ),
        h1: ({ children }) => <h1 className="font-bold text-base mb-1">{children}</h1>,
        h2: ({ children }) => <h2 className="font-semibold text-sm mb-1">{children}</h2>,
        h3: ({ children }) => <h3 className="font-semibold text-sm mb-0.5">{children}</h3>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export function AIMentor({ roadmap, onClose }: AIMentorProps) {
  const welcomeMessage = roadmap
    ? `Hi! I'm your AI mentor for **"${roadmap.goal}"**. I can help you understand concepts, suggest next steps, and guide you through your learning journey. What would you like to know?`
    : `Hi! I'm your AI learning assistant. I can help you explore career paths, explain concepts, recommend roadmaps, and answer questions about your learning journey. What's on your mind?`

  const { chatHistory, setChatHistory, addChatMessage } = useStore()

  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        {
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date().toISOString(),
        }
      ])
    }
  }, [chatHistory.length, setChatHistory, welcomeMessage])

  const messages = chatHistory.length > 0 ? chatHistory : [{
    role: 'assistant',
    content: welcomeMessage,
    timestamp: new Date().toISOString(),
  } as ChatMessage]

  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (message?: string) => {
    const textToSend = message || inputValue.trim()
    if (!textToSend) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    }

    addChatMessage(userMessage)
    setInputValue('')
    setIsLoading(true)

    try {
      const payload: any = { 
        message: textToSend,
        history: messages.map(m => ({ role: m.role, content: m.content }))
      }

      if (roadmap) {
        payload.roadmap_context = {
          goal: roadmap.goal,
          progress: 'In progress',
          phases: roadmap.generated_roadmap.phases,
        }
      }

      const response = await api.post('/api/chat', payload)

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.reply,
        timestamp: new Date().toISOString(),
        action: response.data.action,
      }

      addChatMessage(assistantMessage)
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      }
      addChatMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestions = roadmap ? roadmapQuestions : generalQuestions

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full sm:max-w-lg h-[85vh] sm:h-[36rem] bg-zinc-950 sm:rounded-2xl border border-zinc-800/60 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-200">AI Mentor</h3>
              <p className="text-[11px] text-zinc-600">
                {roadmap ? 'Roadmap context active' : 'General assistant'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-600 hover:text-zinc-400 rounded-lg hover:bg-zinc-800/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2.5 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  message.role === 'user'
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Bot className="w-3.5 h-3.5" />
                )}
              </div>
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-amber-500 text-black rounded-tr-md'
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-800/50 rounded-tl-md'
                }`}
              >
                <MarkdownMessage content={message.content} isUser={message.role === 'user'} />
                {message.action && <ActionRenderer action={message.action} onSend={handleSend} />}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-400 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-zinc-900 border border-zinc-800/50 px-3.5 py-2.5 rounded-2xl rounded-tl-md">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-zinc-800/50 p-3.5">
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {suggestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSend(question)}
                className="text-[11px] px-2.5 py-1 bg-zinc-900 text-zinc-500 border border-zinc-800/50 rounded-lg hover:text-amber-400 hover:border-amber-500/20 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 px-3.5 py-2 bg-zinc-900 border border-zinc-800/50 rounded-xl text-sm text-zinc-200 placeholder:text-zinc-700 resize-none focus:outline-none focus:border-zinc-600 transition-colors"
              rows={1}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

import { usePathname } from 'next/navigation'

/**
 * Global chat widget FAB + chat panel.
 * Drop this into layout.tsx to make it available on every page.
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentRoadmap } = useStore()
  const pathname = usePathname()

  if (pathname === '/') return null

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.5, stiffness: 200, damping: 15 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 md:bottom-6 right-6 w-14 h-14 bg-amber-500 text-black rounded-full shadow-glow flex items-center justify-center hover:bg-amber-400 hover:shadow-glow-hover transition-all duration-300 z-40 active:scale-95"
          aria-label="Open AI Mentor"
        >
          <Brain className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <AIMentor
            roadmap={currentRoadmap}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
