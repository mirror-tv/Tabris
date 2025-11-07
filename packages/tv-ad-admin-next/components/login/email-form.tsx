import { useState, useEffect } from 'react'

import { LabeledField } from '../custom-ui/labeled-field'
import { ShakeInput } from '../custom-ui/shake-input'

import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import MailIcon from '@/public/icons/mail.svg'
import { validateEmail } from '@/utils/validation'

type EmailFormProps = {
  email: string
  setEmail: (email: string) => void
  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  loadingMessage?: string
  error: string
}

const emailId = 'email'

export default function EmailForm({
  email,
  setEmail,
  handleSubmit,
  isLoading,
  loadingMessage,
  error,
}: EmailFormProps) {
  // 即時驗證狀態
  const [emailError, setEmailError] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)

  // 防抖值
  const debouncedEmail = useDebounce(email, 500)

  // 即時驗證 Email
  useEffect(() => {
    if (!debouncedEmail) {
      setEmailError('')
      setIsEmailValid(false)
      return
    }

    const validation = validateEmail(debouncedEmail)
    setEmailError(validation.error || '')
    setIsEmailValid(validation.isValid)
  }, [debouncedEmail])

  // 判斷是否可以提交
  const canSubmit = isEmailValid

  return (
    <>
      <h3 className="text-center text-text-primary">鏡新聞個人廣告系統</h3>
      <p className="text-center text-text-secondary">
        請輸入您在應援科技平台購買商品時，
        <br />
        使用的電子信箱
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex w-full flex-col gap-4">
        <LabeledField id={emailId} label="電子信箱" className="mb-2">
          <ShakeInput
            id={emailId}
            type={emailId}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sample@gmail.com"
            className="h-[45px] rounded-lg"
            error={
              error.includes('電子信箱') || error.includes('信箱') || emailError
                ? 'error'
                : undefined
            }
            errorMessage={
              error.includes('電子信箱') || error.includes('信箱')
                ? error
                : emailError
            }
            icon={<MailIcon />}
          />
        </LabeledField>

        <Button
          type="submit"
          disabled={isLoading || !canSubmit}
          size="lg"
          className="w-full"
        >
          {isLoading ? loadingMessage || '發送中...' : '發送驗證碼'}
        </Button>
      </form>
    </>
  )
}
