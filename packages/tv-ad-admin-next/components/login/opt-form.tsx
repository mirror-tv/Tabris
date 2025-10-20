import { Button } from '@/components/ui/button'
import RadixInspiredOTP from '@/components/ui/radix-inspired-otp'

type OptFormProps = {
  email: string
  phone: string
  error: string
  isLoading: boolean
  countdown: number
  canResend: boolean
  handleOtpSubmit: (value?: string) => void
  handleResendOtp: () => void
}

export default function OptForm({
  email,
  phone,
  error,
  isLoading,
  countdown,
  canResend,
  handleOtpSubmit,
  handleResendOtp,
}: OptFormProps) {
  return (
    <>
      <h3 className="text-center text-text-primary">輸入驗證碼</h3>
      <p className="text-center font-sans text-sm leading-normal font-normal text-text-secondary">
        驗證碼已發送到{' '}
        <span className="inline-block max-w-full truncate">
          {email || phone}
        </span>
        <br />
        請輸入您收到的六位數驗證碼
      </p>

      <div className="mt-4 flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="otp"
            className="font-sans text-sm leading-normal font-medium text-text-primary"
          >
            驗證碼
          </label>
          <RadixInspiredOTP
            length={6}
            validationType="numeric"
            className="gap-1"
            name="otp"
            error={error}
            errorMessage={error}
          />
        </div>

        <Button
          type="button"
          onClick={() => handleOtpSubmit()}
          disabled={isLoading}
          variant="blue"
          size="lg"
          className="w-full"
        >
          {isLoading ? '驗證中...' : '登入'}
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
      </div>
    </>
  )
}
