'use client'

import { useState, useEffect } from 'react'

import type { SendOtpResponse } from '@/types/api'

import EmailForm from '@/components/login/email-form'
import IdentityInfo from '@/components/login/identity-info'
import OptForm from '@/components/login/opt-form'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import { OTP_MAX_ATTEMPTS } from '@/constants'
import { ENV } from '@/constants/environment-variables'
import { AUTH_MESSAGES, LOADING_MESSAGES } from '@/constants/messages'
import { useAuthStore } from '@/store'
import { validateEmail } from '@/utils/validation'

export default function LoginPage() {
  const { user, login, initialize } = useAuthStore()

  const [stage, setStage] = useState<'email' | 'otp' | 'identity-info'>('email')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [canResend, setCanResend] = useState(true)
  const [failedAttempts, setFailedAttempts] = useState(0)

  // 初始化認證狀態
  useEffect(() => {
    initialize()
  }, [initialize])

  // 如果已登入且已完成身份驗證，redirect 到首頁
  // 注意：這個 useEffect 主要處理從其他頁面進入登入頁的情況
  // 登入成功後的跳轉在 handleOtpSubmit 中處理
  useEffect(() => {
    if (!user) return
    console.log('user change', user)
    if (user.hasIdentified === true) {
      // 使用 window.location 確保完整重載，讓 cookie 能正確攜帶
      window.location.href = '/'
    } else if (user.hasIdentified === false) {
      setStage('identity-info')
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    setLoadingMessage(LOADING_MESSAGES.CHECKING_MEMBER)

    try {
      const validation = validateEmail(email)
      if (!validation.isValid) {
        setError(validation.error || AUTH_MESSAGES.EMAIL_INVALID)
        return
      }

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

      setLoadingMessage(LOADING_MESSAGES.SENDING_OTP)

      if ((ENV === 'dev' || ENV === 'local') && data.data?.otp) {
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

      setStage('otp')
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

  const handleOtpSubmit = async (value?: string) => {
    setError('')
    setIsLoading(true)

    try {
      const otpValue = value
      if (!otpValue?.trim()) {
        setError(AUTH_MESSAGES.OTP_REQUIRED)
        return
      }

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

        if (newFailedAttempts >= OTP_MAX_ATTEMPTS) {
          setError(AUTH_MESSAGES.OTP_TOO_MANY_ATTEMPTS)
        } else {
          setError(data.message || AUTH_MESSAGES.OTP_INCORRECT)
        }
        return
      }

      // 登入成功，更新 store
      if (data.user) {
        login(data.user)

        // 如果已完成身份驗證，確保 cookie 被保存後再跳轉
        if (data.user.hasIdentified === true) {
          // 方法 1: 等待瀏覽器保存 cookie
          await new Promise((resolve) => setTimeout(resolve, 300))

          // 方法 2: 驗證 cookie 是否可用（最多重試 3 次）
          let retries = 3
          let cookieVerified = false

          while (retries > 0 && !cookieVerified) {
            try {
              const verifyResponse = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include',
              })
              const verifyData = await verifyResponse.json()

              if (verifyData.success && verifyData.user) {
                cookieVerified = true
                // 更新 store 以確保狀態一致
                login(verifyData.user)
                break
              }
            } catch (err) {
              console.log('驗證 cookie 失敗，重試中...', retries)
            }

            retries--
            if (retries > 0) {
              await new Promise((resolve) => setTimeout(resolve, 200))
            }
          }

          // 方法 3: 使用 window.location 確保完整重載，讓 cookie 能正確攜帶
          window.location.href = '/'
          return
        }
      }
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

      setLoadingMessage(LOADING_MESSAGES.SENDING_OTP)

      // 開發環境：在瀏覽器 Console 顯示驗證碼（帶顏色）
      if ((ENV === 'dev' || ENV === 'local') && data.data?.otp) {
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
        {stage !== 'identity-info' && (
          <div className="flex h-fit max-w-[288px] flex-col items-center rounded-xl border border-border-default bg-surface-primary p-4 shadow-lg md:max-w-[448px] md:min-w-[448px] md:p-6">
            {stage === 'email' && (
              <EmailForm
                email={email}
                setEmail={setEmail}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                loadingMessage={loadingMessage}
                error={error}
              />
            )}
            {stage === 'otp' && (
              <OptForm
                email={email}
                error={error}
                isLoading={isLoading}
                countdown={countdown}
                canResend={canResend}
                failedAttempts={failedAttempts}
                maxAttempts={OTP_MAX_ATTEMPTS}
                handleOtpSubmit={handleOtpSubmit}
                handleResendOtp={handleResendOtp}
                setStage={setStage}
              />
            )}
          </div>
        )}
        <div> {stage === 'identity-info' && <IdentityInfo />}</div>
      </PageMain>
    </>
  )
}
