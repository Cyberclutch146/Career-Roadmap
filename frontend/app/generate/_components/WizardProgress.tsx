'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface WizardProgressProps {
  steps: { label: string; icon: any }[]
  currentStep: number
  onStepClick: (step: number) => void
}

export function WizardProgress({ steps, currentStep, onStepClick }: WizardProgressProps) {
  return (
    <div className="w-full mb-8 relative z-20">
      {/* Desktop Floating Pill Progress */}
      <div className="hidden md:flex justify-center">
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-full p-2 flex items-center gap-2 relative">
          {steps.map((step, idx) => {
            const stepNum = idx + 1
            const isActive = currentStep === stepNum
            const isCompleted = currentStep > stepNum
            const Icon = step.icon

            return (
              <div key={idx} className="flex items-center">
                <button
                  onClick={() => isCompleted && onStepClick(stepNum)}
                  disabled={!isCompleted}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                    ${isActive ? 'bg-amber-500/10 text-amber-500' : ''}
                    ${isCompleted ? 'hover:bg-zinc-800/50 cursor-pointer text-zinc-300' : ''}
                    ${!isActive && !isCompleted ? 'text-zinc-600 cursor-not-allowed' : ''}
                  `}
                >
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                    ${isActive ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]' : ''}
                    ${isCompleted ? 'bg-zinc-800 text-zinc-300' : ''}
                    ${!isActive && !isCompleted ? 'bg-zinc-800/50 text-zinc-600' : ''}
                  `}>
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-amber-500' : ''}`}>
                    {step.label}
                  </span>
                  
                  {/* Active Indicator Line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeStep"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-amber-500 rounded-t-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>

                {/* Connector */}
                {idx < steps.length - 1 && (
                  <div className="w-6 h-px mx-1 bg-zinc-800/50">
                    <div 
                      className="h-full bg-amber-500/50 transition-all duration-500"
                      style={{ width: currentStep > stepNum ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Progress Track */}
      <div className="md:hidden flex flex-col gap-3">
        <div className="flex justify-between items-center px-2">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm font-medium text-zinc-200">
            {steps[currentStep - 1].label}
          </span>
        </div>
        <div className="flex gap-1.5 px-2">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full flex-1 transition-all duration-500 ${
                idx + 1 === currentStep ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 
                idx + 1 < currentStep ? 'bg-zinc-700' : 'bg-zinc-800/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
