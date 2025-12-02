'use client'

import { DotLoader } from './dot-loader'

import { cn } from '@/utils'


type ButtonLoadingTextProps = {
  text?: string
  className?: string
  dotClassName?: string
  dotLoaderClassName?: string
  intervalMs?: number
}

export function ButtonLoadingText({
  text = 'Loading',
  className,
  dotClassName,
  dotLoaderClassName,
  intervalMs,
}: ButtonLoadingTextProps) {
  return (
    <span
      className={cn('inline-flex items-baseline gap-1 font-medium', className)}
    >
      {text}
      <DotLoader
        className={cn('gap-1', dotLoaderClassName)}
        dotClassName={cn('bg-gray-5 size-1',dotClassName)}
        intervalMs={intervalMs}
      />
    </span>
  )
}
