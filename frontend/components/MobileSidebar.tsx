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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed z-50 bg-surface-container shadow-2xl lg:hidden flex flex-col top-0 right-0 bottom-0 w-80 border-l border-border"
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 text-on-surface-variant hover:text-on-surface bg-surface-container-high rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-12">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
