'use client'

import { useState, useEffect, forwardRef } from 'react'

import { CustomInput, type CustomInputProps } from './custom-input'

import { cn } from '@/utils'


export type ShakeInputProps = CustomInputProps

const ShakeInput = forwardRef<HTMLInputElement, ShakeInputProps>(
  ({ error, errorMessage, className, ...props }, ref) => {
    const [shake, setShake] = useState(false)

    useEffect(() => {
      if (error && errorMessage) {
        setShake(true)
        const timer = setTimeout(() => setShake(false), 650)
        return () => clearTimeout(timer)
      }
    }, [error, errorMessage])

    return (
      <div className={cn('relative', shake && 'animate-shake')}>
        <CustomInput
          ref={ref}
          error={error}
          errorMessage={errorMessage}
          className={cn('transition-all duration-200', className)}
          {...props}
        />
      </div>
    )
  }
)

ShakeInput.displayName = 'ShakeInput'

export { ShakeInput }
