'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import MailOrPhoneForm from '@/components/login/mail-or-phone-form'
import OptForm from '@/components/login/opt-form'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'

export default function HomePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'email' | 'phone' | 'OPT'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [canResend, setCanResend] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (status === 'email') {
        if (!email.trim()) {
          setError('請輸入電子信箱')
          return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          setError('請輸入有效的電子信箱格式')
          return
        }
      }

      if (status === 'phone') {
        if (!phone.trim()) {
          setError('請輸入手機號碼')
          return
        }
        const phoneRegex = /^09\d{8}$/
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
          setError('請輸入有效的手機號碼格式 (例：0922119187)')
          return
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStatus('OPT')
      setCountdown(60)
      setCanResend(false)
      console.log('驗證碼已發送到:', status === 'email' ? email : phone)
    } catch (err) {
      console.error(err)
      setError('發送驗證碼失敗，請稍後再試')
    } finally {
      setIsLoading(false)
    }
  }

  // 倒數計時效果
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else {
      setCanResend(true)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  // 驗證碼驗證
  const handleOtpSubmit = async (value?: string) => {
    setError('')
    setIsLoading(true)

    try {
      const otpValue = value
      if (!otpValue?.trim()) {
        setError('請輸入驗證碼')
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log('驗證碼驗證成功:', otpValue)
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      setError('驗證碼錯誤，請重新輸入')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!canResend) return

    setError('')
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCountdown(60)
      setCanResend(false)
      console.log('重新發送驗證碼到:', status === 'email' ? email : phone)
    } catch (err) {
      console.error(err)
      setError('重新發送失敗，請稍後再試')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageHeader variant="centered" />
      <PageMain className="flex justify-center py-5 md:my-auto">
        <div className="flex h-fit max-w-[288px] flex-col items-center rounded-xl border border-border-default bg-surface-primary p-4 shadow-lg md:max-w-[448px] md:min-w-[448px] md:p-6">
          {status !== 'OPT' && (
            <MailOrPhoneForm
              status={status}
              email={email}
              phone={phone}
              setEmail={setEmail}
              setPhone={setPhone}
              setStatus={setStatus}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          )}

          {status === 'OPT' && (
            <OptForm
              email={email}
              phone={phone}
              error={error}
              isLoading={isLoading}
              countdown={countdown}
              canResend={canResend}
              handleOtpSubmit={handleOtpSubmit}
              handleResendOtp={handleResendOtp}
            />
          )}
        </div>
      </PageMain>
    </>
  )
}
