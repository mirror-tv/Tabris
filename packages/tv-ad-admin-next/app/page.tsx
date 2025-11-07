'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import type { SendOtpResponse } from '@/types/api'

import EmailForm from '@/components/login/email-form'
import OptForm from '@/components/login/opt-form'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import { AUTH_MESSAGES, LOADING_MESSAGES } from '@/constants/messages'
import { useAuthStore } from '@/store'
import { validateEmail } from '@/utils/validation'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, login, initialize } = useAuthStore()

  const [isOtpMode, setIsOtpMode] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [canResend, setCanResend] = useState(true)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const maxAttempts = 3 // 與後端一致

  // 初始化認證狀態
  useEffect(() => {
    initialize()
  }, [initialize])

  // 如果已登入，重定向到 dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    setLoadingMessage(LOADING_MESSAGES.CHECKING_MEMBER)

    try {
      // 驗證輸入
      const validation = validateEmail(email)
      if (!validation.isValid) {
        setError(validation.error || AUTH_MESSAGES.EMAIL_INVALID)
        return
      }

      // 呼叫 Next.js API Route 發送 OTP
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      })

      const data: SendOtpResponse = await response.json()

      if (!data.success) {
        setError(data.message || AUTH_MESSAGES.SEND_OTP_FAILED)
        return
      }

      // 會員驗證通過，開始發送 OTP
      setLoadingMessage(LOADING_MESSAGES.SENDING_OTP)

      // 開發環境：在瀏覽器 Console 顯示驗證碼（帶顏色）
      if (data.data?.otp) {
        console.log(
          '%c🔐 ========== OTP 驗證碼 ==========',
          'color: #10b981; font-size: 14px; font-weight: bold;'
        )
        console.log(`%c📧 ${email}`, 'color: #3b82f6; font-size: 12px;')
        console.log(
          `%c🔢 驗證碼: ${data.data.otp}`,
          'color: #ef4444; font-size: 16px; font-weight: bold;'
        )
        console.log('%c⏰ 有效期: 5 分鐘', 'color: #f59e0b; font-size: 12px;')
        console.log(
          '%c=====================================',
          'color: #10b981; font-size: 14px;'
        )
      }

      setIsOtpMode(true)
      setCountdown(60)
      setCanResend(false)
    } catch (err) {
      console.error(err)
      setError(AUTH_MESSAGES.NETWORK_ERROR)
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
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
      // 驗證 OTP 格式
      const otpValue = value
      if (!otpValue?.trim()) {
        setError(AUTH_MESSAGES.OTP_REQUIRED)
        return
      }

      // 呼叫 Next.js API Route 驗證 OTP
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 重要：包含 cookies
        body: JSON.stringify({
          email,
          otp: otpValue,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        const newFailedAttempts = failedAttempts + 1
        setFailedAttempts(newFailedAttempts)

        if (newFailedAttempts >= maxAttempts) {
          setError(AUTH_MESSAGES.OTP_TOO_MANY_ATTEMPTS)
        } else {
          setError(data.message || AUTH_MESSAGES.OTP_INCORRECT)
        }
        return
      }

      // 登入成功，更新 store
      if (data.user) {
        // login 是同步函數，只是更新 zustand store 的 state，不需要 await
        login(data.user)
      }

      // 登入成功，跳轉到 dashboard
      // Cookie 已在 API 響應時設定，狀態更新是同步的，可直接跳轉
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      setError(AUTH_MESSAGES.NETWORK_ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!canResend) return

    setError('')
    setFailedAttempts(0) // 重置失敗次數
    setIsLoading(true)
    setLoadingMessage(LOADING_MESSAGES.CHECKING_MEMBER)

    try {
      // 呼叫 Next.js API Route 重新發送 OTP
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      })

      const data: SendOtpResponse = await response.json()

      if (!data.success) {
        setError(data.message || AUTH_MESSAGES.RESEND_OTP_FAILED)
        return
      }

      // 會員驗證通過，開始發送 OTP
      setLoadingMessage(LOADING_MESSAGES.SENDING_OTP)

      // 開發環境：在瀏覽器 Console 顯示驗證碼（帶顏色）
      if (data.data?.otp) {
        console.log(
          '%c🔐 ========== 重新發送 OTP ==========',
          'color: #10b981; font-size: 14px; font-weight: bold;'
        )
        console.log(`%c📧 ${email}`, 'color: #3b82f6; font-size: 12px;')
        console.log(
          `%c🔢 驗證碼: ${data.data.otp}`,
          'color: #ef4444; font-size: 16px; font-weight: bold;'
        )
        console.log('%c⏰ 有效期: 5 分鐘', 'color: #f59e0b; font-size: 12px;')
        console.log(
          '%c=====================================',
          'color: #10b981; font-size: 14px;'
        )
      }

      setCountdown(60)
      setCanResend(false)
    } catch (err) {
      console.error(err)
      setError(AUTH_MESSAGES.NETWORK_ERROR)
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
    }
  }

  return (
    <>
      <PageHeader variant="centered" />
      <PageMain className="flex justify-center py-5 md:py-10">
        <div className="flex h-fit max-w-[288px] flex-col items-center rounded-xl border border-border-default bg-surface-primary p-4 shadow-lg md:max-w-[448px] md:min-w-[448px] md:p-6">
          {!isOtpMode ? (
            <EmailForm
              email={email}
              setEmail={setEmail}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              error={error}
            />
          ) : (
            <OptForm
              email={email}
              error={error}
              isLoading={isLoading}
              countdown={countdown}
              canResend={canResend}
              failedAttempts={failedAttempts}
              maxAttempts={maxAttempts}
              handleOtpSubmit={handleOtpSubmit}
              handleResendOtp={handleResendOtp}
            />
          )}
        </div>
      </PageMain>
    </>
  )
}
