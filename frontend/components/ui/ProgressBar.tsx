'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  className
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2.5'
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-surface-container-highest rounded-full overflow-hidden', sizeClasses[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-on-surface-variant">{percentage}%</span>
        </div>
      )}
    </div>
  )
}
