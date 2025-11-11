import { useState } from 'react'

import Link from 'next/link'

import RadixInspiredOTP from '@/components/custom-ui/radix-inspired-otp'
import { Button } from '@/components/ui/button'

type OptFormProps = {
  email: string
  error: string
  isLoading: boolean
  countdown: number
  canResend: boolean
  failedAttempts: number
  maxAttempts: number
  handleOtpSubmit: (value?: string) => void
  handleResendOtp: () => void
}

export default function OptForm({
  email,
  error,
  isLoading,
  countdown,
  canResend,
  failedAttempts,
  maxAttempts,
  handleOtpSubmit,
  handleResendOtp,
}: OptFormProps) {
  const [otpValue, setOtpValue] = useState('')
  const isLocked = failedAttempts >= maxAttempts

  return (
    <>
      <h3 className="text-center text-text-primary">輸入驗證碼</h3>
      <p className="text-center font-sans text-sm leading-normal font-normal text-text-secondary">
        驗證碼已發送到{' '}
        <span className="inline max-w-full truncate">{email}</span>
        <br />
        請輸入您收到的六位數驗證碼
      </p>

      <div className="mt-4 flex w-full flex-col gap-6">
        <div className="flex flex-col gap-1">
          <RadixInspiredOTP
            length={6}
            validationType="numeric"
            className="gap-1"
            name="otp"
            value={otpValue}
            onValueChange={setOtpValue}
            error={error}
            errorMessage={error}
          />
        </div>

        <Button
          type="button"
          onClick={() => handleOtpSubmit(otpValue)}
          disabled={isLoading || isLocked}
          size="lg"
          className="w-full"
        >
          {isLoading ? '驗證中...' : isLocked ? '已鎖定' : '登入'}
        </Button>

        <div className="flex items-center justify-center text-sm">
          <span className="font-sans text-sm leading-normal font-medium text-text-secondary">
            沒收到驗證碼？
          </span>
          <Button
            type="button"
            variant="link"
            onClick={handleResendOtp}
            disabled={!canResend || isLoading}
            className={`h-auto p-0 underline transition-colors duration-200 ${
              canResend && !isLoading
                ? 'text-text-secondary hover:text-text-primary focus:text-text-tertiary'
                : 'text-text-secondary'
            }`}
          >
            重新發送{canResend ? '' : `(${countdown}s)`}
          </Button>
        </div>
        <Link
          href={`/`}
          className="-mt-2 text-center text-sm leading-normal font-medium text-brand-primary hover:font-bold"
        >
          重新填寫電子信箱
        </Link>
      </div>
    </>
  )
}
