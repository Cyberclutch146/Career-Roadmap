'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User, Sparkles } from 'lucide-react'
import { Button } from './ui/Button'
import { api } from '@/lib/api'
import type { Roadmap, ChatMessage } from '@/types'
import ReactMarkdown from 'react-markdown'

interface AIMentorProps {
  roadmap: Roadmap
  onClose: () => void
}

const suggestedQuestions = [
  'What should I learn next?',
  'Explain this concept in simple terms',
  'Give me some practice exercises',
  'How does this connect to what I learned before?',
  'Help me understand this topic better',
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
                isUser ? 'bg-white/20 text-white' : 'bg-surface-container-high text-on-surface'
              }`}
            >
              {children}
            </code>
          ) : (
            <pre
              className={`my-2 p-3 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap ${
                isUser ? 'bg-white/20 text-white' : 'bg-surface-container-high text-green-300'
              }`}
            >
              <code>{children}</code>
            </pre>
          ),
        blockquote: ({ children }) => (
          <blockquote
            className={`border-l-2 pl-3 my-1 italic text-sm ${
              isUser ? 'border-white/40 text-white/80' : 'border-primary/40 text-on-surface-variant'
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your AI learning mentor for **"${roadmap.goal}"**. I can help you understand concepts, suggest next steps, and guide you through your learning journey. What would you like to know?`,
      timestamp: new Date().toISOString(),
    },
  ])
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

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await api.post('/api/chat', {
        roadmap_context: {
          goal: roadmap.goal,
          progress: 'In progress',
          phases: roadmap.generated_roadmap.phases
        },
        message: textToSend,
      })

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.reply,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg h-[36rem] bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-on-surface">AI Mentor</h3>
              <p className="text-xs text-on-surface-variant">Based on your roadmap · supports markdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface-variant transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-primary text-white rounded-tr-sm'
                    : 'bg-surface-container text-on-surface-variant rounded-tl-sm'
                }`}
              >
                <MarkdownMessage content={message.content} isUser={message.role === 'user'} />
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-surface-container px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-border p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => handleSend(question)}
                className="text-xs px-3 py-1.5 bg-surface text-on-surface-variant rounded-full hover:bg-surface-container hover:text-on-surface-variant transition-colors"
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
              placeholder="Ask me anything about your learning..."
              className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={1}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="flex-shrink-0"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
