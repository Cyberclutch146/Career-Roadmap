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

  if (resolvedTheme === 'light') {
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-background">
        <div className="absolute top-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/[0.1] blur-[180px]" />
        <div className="absolute bottom-[-20%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-orange-500/[0.08] blur-[200px]" />
      </div>
    )
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
