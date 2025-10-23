'use client'

import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

import { cn } from '@/utils'

type InstructionsProps = {
  className?: string
  title?: string
  icon?: ReactNode
  wordings: string[]
  isDot?: boolean
}

export function Instructions({
  className = '',
  title = '',
  icon,
  wordings,
  isDot = false,
}: InstructionsProps) {
  return (
    <Card variant="note" className={className}>
      {!!title && (
        <CardHeader className="flex w-full items-center">
          {icon}
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ul className={cn('space-y-s', isDot && 'list-disc pl-5')}>
          {wordings.map((wording, index) => (
            <li key={index}>{wording}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
