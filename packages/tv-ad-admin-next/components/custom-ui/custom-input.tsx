import { forwardRef } from 'react'
import type { ComponentProps, ReactNode } from 'react'

import { ErrorMessage } from './error-message'
import { Input as BaseInput } from '../ui/input'

import { layout } from '@/constants'
import { cn } from '@/utils'


export type CustomInputProps = ComponentProps<'input'> & {
  error?: string
  errorMessage?: string
  icon?: ReactNode
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, error, errorMessage, icon, ...props }, ref) => {
    return (
      <div className="relative">
        <BaseInput
          ref={ref}
          className={cn(
            // Base styles
            'h-9 min-h-[45px] w-full min-w-0 rounded-md py-1 text-base outline-none',
            'text-text-primary placeholder:text-text-tertiary',
            // disabled
            layout.disabled,
            'disabled:opacity-100', // overwrite base input style
            'md:text-sm dark:bg-input/30',
            // Padding based on icon presence
            icon ? 'pr-3 pl-10' : 'px-3',
            // Background - common to all states
            'bg-surface-tertiary',
            // Border states - use transparent border to prevent layout shift
            !error && [layout.hoverBorder, 'focus:border-text-secondary'],
            error && ['border border-red-7', 'focus:border-red-8'],
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-5">
            {icon}
          </div>
        )}

        {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </div>
    )
  }
)

CustomInput.displayName = 'CustomInput'

export { CustomInput }
