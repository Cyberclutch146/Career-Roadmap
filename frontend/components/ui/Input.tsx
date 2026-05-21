'use client'

import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-label font-medium text-on-surface mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 bg-surface-container/80 backdrop-blur-sm border rounded-xl text-on-surface placeholder:text-on-surface-variant/50',
            'focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20',
            'transition-all duration-200',
            error ? 'border-error/50 focus:border-error focus:ring-error/20' : 'border-outline-variant',
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn('mt-1.5 text-sm', error ? 'text-error' : 'text-on-surface-variant')}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
