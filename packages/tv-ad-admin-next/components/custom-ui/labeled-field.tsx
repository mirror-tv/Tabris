import { forwardRef, type ReactNode } from 'react'

import { cn } from '@/utils'

export type LabeledFieldProps = {
  id: string
  label: string
  labelIcon?: ReactNode
  className?: string
  children: ReactNode
}
export const LabeledField = forwardRef<HTMLInputElement, LabeledFieldProps>(
  ({ id, label, labelIcon, className, children }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-2 w-full', className)}>
      <label htmlFor={id} className="typography-h6 flex items-center gap-1">
        {labelIcon && <span className="text-gray-5">{labelIcon}</span>}
        {label}
      </label>
      {children}
    </div>
  )
)

LabeledField.displayName = 'LabeledField'
