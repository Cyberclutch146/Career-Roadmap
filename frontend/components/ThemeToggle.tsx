'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="p-2 rounded-full border border-outline/20 bg-surface-container/50 text-on-surface-variant hover:text-on-surface hover:bg-surface-container/80 transition-all opacity-50 cursor-default">
        <Sun className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full border border-outline/20 bg-surface-container/50 text-on-surface-variant hover:text-on-surface hover:bg-surface-container/80 transition-all group"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Moon className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-rotate-12" />
      ) : (
        <Sun className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:rotate-45" />
      )}
    </button>
  )
}
