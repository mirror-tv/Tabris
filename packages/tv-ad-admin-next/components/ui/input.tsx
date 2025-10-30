import React, {
  type ComponentProps,
  forwardRef,
  useState,
  useEffect,
} from 'react'

import { cn } from '@/utils'

type InputProps = ComponentProps<'input'> & {
  error?: string
  errorMessage?: string
  icon?: React.ReactNode
}

// 錯誤圖示 component
function ErrorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-4 text-red-6"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, icon, ...props }, ref) => {
    const [shake, setShake] = useState(false)

    // 當錯誤出現時觸發震動動畫
    useEffect(() => {
      if (error && errorMessage) {
        setShake(true)
        const timer = setTimeout(() => setShake(false), 650)
        return () => clearTimeout(timer)
      }
    }, [error, errorMessage])

    const inputElement = (
      <div className={cn('relative', shake && 'animate-shake')}>
        <input
          type={type}
          ref={ref}
          data-slot="input"
          className={cn(
            // Base styles
            'h-9 min-h-[45px] w-full min-w-0 rounded-md py-1 text-base transition-all duration-200 outline-none',
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
            error && [
              'border border-red-6',
              'focus:border-red-7',
              'bg-red-50/50',
            ],
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
          <div className="flex items-center gap-1 text-sm text-red-6 animate-fade-in">
            <ErrorIcon />
            <span>{errorMessage}</span>
          </div>
        </div>
      )
    }

    return inputElement
  }
)

Input.displayName = 'Input'

export { Input }
