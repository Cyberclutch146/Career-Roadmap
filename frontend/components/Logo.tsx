import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-serif italic font-bold tracking-tight text-on-surface text-xl", className)}>
      Roadmap<span className="text-amber-500 font-sans not-italic">AI</span>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 ml-0.5"></span>
    </span>
  )
}
