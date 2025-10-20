import React, { type ComponentProps, forwardRef } from 'react'

import { cn } from '@/utils'

type InputProps = ComponentProps<'input'> & {
  error?: string
  errorMessage?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, icon, ...props }, ref) => {
    const inputElement = (
      <div className="relative">
        <input
          type={type}
          ref={ref}
          data-slot="input"
          className={cn(
            // Base styles
            'h-9 min-h-[45px] w-full min-w-0 rounded-md py-1 text-base transition-[color,box-shadow] outline-none',
            'text-text-primary placeholder:text-text-tertiary',
            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            'md:text-sm dark:bg-input/30',
            // Padding based on icon presence
            icon ? 'pr-3 pl-10' : 'px-3',
            // Background - common to all states
            'bg-surface-tertiary',
            // Border states - use transparent border to prevent layout shift
            !error && [
              'border border-transparent',
              'hover:border-text-primary',
              'focus:border-text-secondary',
            ],
            error && ['border-red-7', 'focus:border-red-7'],
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute top-1/2 left-3 -translate-y-1/2">{icon}</div>
        )}
      </div>
    )

    if (error && errorMessage) {
      return (
        <div className="flex flex-col gap-1">
          {inputElement}
          <div className="text-sm text-red-7">{errorMessage}</div>
        </div>
      )
    }

    return inputElement
  }
)

Input.displayName = 'Input'

export { Input }
