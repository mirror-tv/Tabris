import { forwardRef, type ReactNode } from 'react'

import { cn } from '@/utils'

export type LabeledFieldProps = {
  id: string
  label: string
  labelIcon?: ReactNode
  className?: string
  children: ReactNode
  labelDescription?: string
  maxLength?: number
}
export const LabeledField = forwardRef<HTMLInputElement, LabeledFieldProps>(
  ({ id, label, labelIcon, className, children, labelDescription }, ref) => {
    return (
      <div ref={ref} className={cn('flex w-full flex-col gap-2', className)}>
        <label htmlFor={id} className="typography-h6 flex items-center gap-1">
          {labelIcon && <span className="text-gray-5">{labelIcon}</span>}
          {label}
          {labelDescription && (
            <div
              className="typography-caption1 ml-2 text-gray-5 md:ml-0"
              dangerouslySetInnerHTML={{ __html: labelDescription }}
            />
          )}
        </label>
        {children}
      </div>
    )
  }
)

LabeledField.displayName = 'LabeledField'
