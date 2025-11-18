/**
 * POST /api/auth/send-otp
 * 發送 OTP 驗證碼到信箱
 */

import { NextRequest, NextResponse } from 'next/server'

import type { SendOtpResponse } from '@/types/api'

import { AUTH_MESSAGES, formatMessage } from '@/constants/messages'
import { createErrorLogger } from '@/utils/error-handler'
import { checkMemberByEmail } from '@/utils/member'
import { sendEmailOTP } from '@/utils/otp-sender'
import { generateOTP, storeOTP } from '@/utils/otp-storage'
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_CONFIGS,
} from '@/utils/rate-limit'
import { validateEmail } from '@/utils/validation'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: AUTH_MESSAGES.MISSING_IDENTIFIER,
        },
        { status: 400 }
      )
    }

    // 驗證格式
    const validation = validateEmail(email)
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      )
    }

    // Rate Limiting - 檢查 IP
    const clientIp = getClientIp(request)
    const ipRateLimit = checkRateLimit(
      `ip:${clientIp}`,
      RATE_LIMIT_CONFIGS.GLOBAL_IP
    )

    if (!ipRateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: formatMessage(AUTH_MESSAGES.TOO_MANY_REQUESTS, {
            seconds: ipRateLimit.retryAfter || 60,
          }),
        },
        { status: 429 }
      )
    }

    // Rate Limiting - 檢查 identifier
    const identifierRateLimit = checkRateLimit(
      `send-otp:${email}`,
      RATE_LIMIT_CONFIGS.SEND_OTP
    )

    if (!identifierRateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: formatMessage(AUTH_MESSAGES.TOO_MANY_REQUESTS, {
            seconds: identifierRateLimit.retryAfter || 60,
          }),
        },
        { status: 429 }
      )
    }

    // 檢查使用者是否在 CMS member 中存在
    const memberCheck = await checkMemberByEmail(email)

    if (!memberCheck.exists) {
      return NextResponse.json(
        {
          success: false,
          message: memberCheck.message || AUTH_MESSAGES.MEMBER_NOT_FOUND_EMAIL,
        },
        { status: 404 }
      )
    }

    // 生成並存儲 OTP
    const otp = generateOTP()
    await storeOTP(email, otp)

    const emailResult = await sendEmailOTP(email, otp)

    // 開發環境：返回 OTP 到前端（方便在瀏覽器 Console 查看）
    const isDev =
      process.env.NODE_ENV === 'development' ||
      process.env.GCS_BUCKET === 'tv-advertising-dev'

    const response: SendOtpResponse = {
      success: emailResult.success,
      message: emailResult.success
        ? AUTH_MESSAGES.OTP_SENT
        : emailResult.message,
      data: {
        expiresIn: 300,
        ...(isDev && { otp }), // 開發環境才返回 OTP
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    createErrorLogger('發送 OTP 錯誤')(error)
    return NextResponse.json(
      { success: false, message: AUTH_MESSAGES.SERVER_ERROR },
      { status: 500 }
    )
  }
}
