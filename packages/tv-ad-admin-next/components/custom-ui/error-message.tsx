'use client'

import { type ReactNode } from 'react'

import { cn } from '@/utils'

export function ErrorMessage({ children }: { children?: ReactNode }) {
  if (!children) return null

  return (
    <span
      className={cn('absolute -bottom-6 left-0 animate-fade-in text-red-7')}
    >
      {children}
    </span>
  )
}
