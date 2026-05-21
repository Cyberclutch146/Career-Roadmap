'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function MobileSidebar({ isOpen, onClose, children }: MobileSidebarProps) {
  // Swappable mode for the user to try out: 'drawer' or 'bottomSheet'
  const [mode, setMode] = useState<'drawer' | 'bottomSheet'>('drawer')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sidebar Content */}
          <motion.div
            initial={
              mode === 'drawer' 
                ? { x: '-100%' } 
                : { y: '100%' }
            }
            animate={
              mode === 'drawer' 
                ? { x: 0 } 
                : { y: 0 }
            }
            exit={
              mode === 'drawer' 
                ? { x: '-100%' } 
                : { y: '100%' }
            }
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed z-50 bg-surface-container shadow-2xl lg:hidden flex flex-col ${
              mode === 'drawer'
                ? 'top-0 left-0 bottom-0 w-80 border-r border-border'
                : 'bottom-0 left-0 right-0 h-[85vh] rounded-t-3xl border-t border-border'
            }`}
          >
            {/* Mode Switcher (For testing purposes) */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setMode(mode === 'drawer' ? 'bottomSheet' : 'drawer')}
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-2 text-xs font-semibold"
                title="Swap Mobile View Mode"
              >
                <Settings2 className="w-4 h-4" />
                {mode === 'drawer' ? 'Try Bottom Sheet' : 'Try Slide Drawer'}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-on-surface-variant hover:text-on-surface bg-surface-container-high rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom sheet drag handle indicator */}
            {mode === 'bottomSheet' && (
              <div className="w-full flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-border" />
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-12">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
