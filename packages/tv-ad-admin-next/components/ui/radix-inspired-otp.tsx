import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react'

type RadixInspiredOTPProps = {
  length?: number
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onAutoSubmit?: (value: string) => void
  autoSubmit?: boolean
  disabled?: boolean
  readOnly?: boolean
  type?: 'text' | 'password'
  validationType?: 'numeric' | 'alpha' | 'alphanumeric' | 'none'
  className?: string
  name?: string
  error?: string
  errorMessage?: string
}

type OTPInputProps = {
  index: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  readOnly?: boolean
  type?: 'text' | 'password'
  validationType?: 'numeric' | 'alpha' | 'alphanumeric' | 'none'
  maxLength?: number
  error?: boolean
}

function OTPInput({
  index,
  value,
  onChange,
  disabled,
  readOnly,
  type,
  validationType,
  maxLength = 1,
  error,
}: OTPInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value

    if (validationType === 'numeric') {
      inputValue = inputValue.replace(/[^0-9]/g, '')
    } else if (validationType === 'alpha') {
      inputValue = inputValue.replace(/[^a-zA-Z]/g, '')
    } else if (validationType === 'alphanumeric') {
      inputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '')
    }

    onChange(inputValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (readOnly) return

    if (e.key === 'Backspace' && value === '' && index > 0) {
      const previousInput = inputRef.current?.parentElement?.children[
        index - 1
      ] as HTMLInputElement
      previousInput?.focus()
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    onChange(pastedData)
  }

  return (
    <input
      ref={inputRef}
      type={type}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onPaste={handlePaste}
      maxLength={maxLength}
      disabled={disabled}
      readOnly={readOnly}
      inputMode={validationType === 'numeric' ? 'numeric' : 'text'}
      className={`flex h-10 w-10 items-center justify-center gap-3 rounded-lg p-2 text-center font-sans text-lg font-medium transition-all read-only:border-border-secondary read-only:bg-surface-tertiary focus:shadow-lg focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-tertiary disabled:opacity-50 ${
        error
          ? 'border border-red-6 bg-surface-tertiary hover:border-red-6 focus:border-red-6'
          : 'border-0 bg-surface-tertiary hover:border hover:border-text-primary focus:border focus:border-text-secondary'
      } text-text-primary`}
      aria-label={`驗證碼第 ${index + 1} 位`}
    />
  )
}

function HiddenInput({ name, value }: { name?: string; value: string }) {
  return (
    <input
      type="hidden"
      name={name}
      value={value}
      autoComplete="one-time-code"
    />
  )
}

export function RadixInspiredOTP({
  length = 6,
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  disabled = false,
  readOnly = false,
  type = 'text',
  validationType = 'numeric',
  className = '',
  name,
  error,
  errorMessage,
}: RadixInspiredOTPProps) {
  const [value, setValue] = useState<string[]>(
    () =>
      controlledValue?.split('') ||
      defaultValue.split('') ||
      new Array(length).fill('')
  )

  const [pastedLength, setPastedLength] = useState<number>(0)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue.split(''))
    }
  }, [controlledValue])

  // Handle focus after paste operation
  useLayoutEffect(() => {
    if (containerRef.current && pastedLength > 0) {
      const lastInput = containerRef.current.children[
        pastedLength - 1
      ] as HTMLInputElement
      lastInput?.focus()
      setPastedLength(0)
    }
  }, [pastedLength])

  const handleValueChange = useCallback(
    (newValue: string[]) => {
      if (!disabled && !readOnly) {
        setValue(newValue)
        onValueChange?.(newValue.join(''))
      }
    },
    [disabled, readOnly, onValueChange]
  )

  const updateChar = (index: number, char: string) => {
    const newValue = [...value]
    newValue[index] = char.slice(0, 1)

    if (char.length > 1) {
      const chars = char.slice(0, length)
      for (let i = 0; i < chars.length && i < length; i++) {
        newValue[i] = chars[i] || ''
      }
    }

    handleValueChange(newValue)

    if (char.length === 1 && index < length - 1) {
      setTimeout(() => {
        const nextInput = containerRef.current?.children[
          index + 1
        ] as HTMLInputElement
        nextInput?.focus()
      }, 0)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const cleanData = pastedData.replace(/\s/g, '').slice(0, length)

    const newValue = new Array(length).fill('')
    for (let i = 0; i < cleanData.length; i++) {
      newValue[i] = cleanData[i]
    }

    setPastedLength(cleanData.length)
    handleValueChange(newValue)
  }

  // Auto-submit functionality disabled per user request
  // useEffect(() => {
  //   const currentValue = value.join('')
  //   if (
  //     autoSubmit &&
  //     currentValue.length === length &&
  //     currentValue.length > 0
  //   ) {
  //     onAutoSubmit?.(currentValue)
  //   }
  // }, [value, length, autoSubmit, onAutoSubmit])

  const otpContainer = (
    <div
      ref={containerRef}
      role="group"
      className={`flex items-start justify-center gap-1 self-stretch ${className}`}
      style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }}
      onPaste={handlePaste}
    >
      {Array.from({ length }, (_, index) => (
        <OTPInput
          key={index}
          index={index}
          value={value[index] || ''}
          onChange={(char) => updateChar(index, char)}
          disabled={disabled}
          readOnly={readOnly}
          type={type}
          validationType={validationType}
          error={!!error}
        />
      ))}
      <HiddenInput name={name} value={value.join('')} />
    </div>
  )

  // 如果有錯誤訊息，需要包裝容器
  if (error && errorMessage) {
    return (
      <div className="flex flex-col gap-1">
        {otpContainer}
        <div className="text-center text-sm text-red-6">{errorMessage}</div>
      </div>
    )
  }

  // 沒有錯誤時直接返回容器，保持布局正確
  return otpContainer
}

export default RadixInspiredOTP
