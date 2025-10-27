import { useState, useEffect } from 'react'

import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { validateEmail, validatePhone } from '@/utils/validation'

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
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="font-sans text-sm leading-normal font-medium text-text-primary"
            >
              電子信箱
            </label>
            <Input
              id="email"
              type="email"
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
              icon={
                <Image
                  src="/assets/icons/mail.svg"
                  alt="mail"
                  width={16}
                  height={16}
                />
              }
            />
          </div>
        )}

        {status === 'phone' && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="phone"
              className="font-sans text-sm leading-normal font-medium text-text-primary"
            >
              手機號碼
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="範例：0912345678"
              className="rounded-lg"
              error={
                error.includes('手機號碼') || phoneError ? 'error' : undefined
              }
              errorMessage={error.includes('手機號碼') ? error : phoneError}
              icon={
                <Image
                  src="/assets/icons/phone.svg"
                  alt="phone"
                  width={16}
                  height={16}
                />
              }
            />
          </div>
        )}

        <p
          onClick={() =>
            setStatus((prev) => (prev === 'email' ? 'phone' : 'email'))
          }
          className="flex cursor-pointer items-center text-sm leading-normal font-medium text-brand-primary hover:cursor-pointer"
        >
          使用{status === 'email' ? '手機號碼' : '電子信箱'}登入
          <Image
            src="/assets/icons/arrow.svg"
            alt="arrow"
            width={16}
            height={16}
            className="inline"
          />
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
