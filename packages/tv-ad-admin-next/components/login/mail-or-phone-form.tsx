import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import ArrowRightIcon from '@/public/icons/arrow-right.svg'
import MailIcon from '@/public/icons/mail.svg'
import PhoneIcon from '@/public/icons/phone.svg'
import { validateEmail, validatePhone } from '@/utils/validation'

import { LabeledField } from '../custom-ui/labeled-field'
import { ShakeInput } from '../custom-ui/shake-input'

type MailOrPhoneFormProps = {
  status: 'email' | 'phone' | 'OPT'
  email: string
  phone: string
  setEmail: (email: string) => void
  setPhone: (phone: string) => void
  setStatus: React.Dispatch<React.SetStateAction<'email' | 'phone' | 'OPT'>>
  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  loadingMessage?: string
  error: string
}

const emailId = 'email'
const phoneId = 'phone'

export default function MailOrPhoneForm({
  status,
  email,
  phone,
  setEmail,
  setPhone,
  setStatus,
  handleSubmit,
  isLoading,
  loadingMessage,
  error,
}: MailOrPhoneFormProps) {
  // 即時驗證狀態
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isPhoneValid, setIsPhoneValid] = useState(false)

  // 防抖值
  const debouncedEmail = useDebounce(email, 500)
  const debouncedPhone = useDebounce(phone, 500)

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

  // 即時驗證手機號碼
  useEffect(() => {
    if (!debouncedPhone) {
      setPhoneError('')
      setIsPhoneValid(false)
      return
    }

    const validation = validatePhone(debouncedPhone)
    setPhoneError(validation.error || '')
    setIsPhoneValid(validation.isValid)
  }, [debouncedPhone])

  // 判斷是否可以提交
  const canSubmit = status === 'email' ? isEmailValid : isPhoneValid

  return (
    <>
      <h3 className="text-center text-text-primary">鏡新聞個人廣告系統</h3>
      <p className="text-center text-text-secondary">
        請輸入您註冊應援科技使用的電子信箱／手機號碼
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex w-full flex-col gap-4">
        {status === 'email' && (
          <LabeledField id={emailId} label="電子信箱" className="mb-2">
            <ShakeInput
              id={emailId}
              type={emailId}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sample@gmail.com"
              className="h-[45px] rounded-lg"
              error={
                error.includes('電子信箱') ||
                error.includes('信箱') ||
                emailError
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
        )}

        {status === 'phone' && (
          <LabeledField id={phoneId} label="手機號碼" className="mb-2">
            <ShakeInput
              id={phoneId}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="範例：0912345678"
              className="rounded-lg"
              error={
                error.includes('手機號碼') || phoneError ? 'error' : undefined
              }
              errorMessage={error.includes('手機號碼') ? error : phoneError}
              icon={<PhoneIcon />}
            />
          </LabeledField>
        )}

        <p
          onClick={() =>
            setStatus((prev) => (prev === 'email' ? 'phone' : 'email'))
          }
          className="flex cursor-pointer items-center text-sm leading-normal font-medium text-brand-primary hover:cursor-pointer"
        >
          使用{status === 'email' ? '手機號碼' : '電子信箱'}登入
          <ArrowRightIcon />
        </p>

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
