'use client'

import { cn } from '@/utils'

type DotLoaderProps = {
  count?: number
  className?: string
  dotClassName?: string
  intervalMs?: number // per-dot delay; default 140ms
}

export function DotLoader({
  count = 3,
  className,
  dotClassName,
  intervalMs = 140,
}: DotLoaderProps) {
  const dots = Array.from({ length: count })
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex items-center gap-[3px] align-middle',
        className
      )}
    >
      {dots.map((_, i) => (
        <span
          key={i}
          className={cn(
            'inline-block h-1.5 w-1.5 animate-dot-fade rounded-full bg-gray-9',
            dotClassName
          )}
          style={{ animationDelay: `${i * intervalMs}ms` }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  )
}
