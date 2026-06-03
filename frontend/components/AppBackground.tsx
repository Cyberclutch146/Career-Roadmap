'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Galaxy from './Galaxy'

export function AppBackground() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="fixed inset-0 pointer-events-none -z-10 bg-background" />
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-background">
      <Galaxy 
        transparent={true} 
        mouseInteraction={true} 
        mouseRepulsion={true}
        density={1.2}
        glowIntensity={0.2}
        saturation={0}
        hueShift={240}
        className="w-full h-full opacity-80"
      />
    </div>
  )
}
