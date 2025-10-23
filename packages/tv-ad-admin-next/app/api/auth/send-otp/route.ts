/**
 * POST /api/auth/send-otp
 * 發送 OTP 驗證碼到信箱或手機
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, storeOTP } from '@/utils/otp-storage'
import { checkMemberByEmail, checkMemberByPhone } from '@/utils/member'
import { validateEmail, validatePhone } from '@/utils/validation'
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_CONFIGS,
} from '@/utils/rate-limit'
import { AUTH_MESSAGES, formatMessage } from '@/constants/messages'
import type { SendOtpResponse } from '@/types/api'

export async function POST(request: NextRequest) {
  try {
    const { email, phone, type } = await request.json()

    // 驗證參數
    if (!type || (type !== 'email' && type !== 'phone')) {
      return NextResponse.json(
        { success: false, message: AUTH_MESSAGES.INVALID_TYPE },
        { status: 400 }
      )
    }

    const identifier = type === 'email' ? email : phone

    if (!identifier) {
      return NextResponse.json(
        {
          success: false,
          message: AUTH_MESSAGES.MISSING_IDENTIFIER,
        },
        { status: 400 }
      )
    }

    // 驗證格式
    if (type === 'email') {
      const validation = validateEmail(email)
      if (!validation.isValid) {
        return NextResponse.json(
          { success: false, message: validation.error },
          { status: 400 }
        )
      }
    }

    if (type === 'phone') {
      const validation = validatePhone(phone)
      if (!validation.isValid) {
        return NextResponse.json(
          { success: false, message: validation.error },
          { status: 400 }
        )
      }
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
      `send-otp:${identifier}`,
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
    const memberCheck =
      type === 'email'
        ? await checkMemberByEmail(email)
        : await checkMemberByPhone(phone)

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
    storeOTP(identifier, otp)

    // 開發環境：返回 OTP 到前端（方便在瀏覽器 Console 查看）
    const isDev = process.env.NODE_ENV === 'development'

    const response: SendOtpResponse = {
      success: true,
      message: isDev ? AUTH_MESSAGES.OTP_SENT_DEV : AUTH_MESSAGES.OTP_SENT,
      data: {
        expiresIn: 300,
        ...(isDev && { otp }), // 開發環境才返回 OTP
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('發送 OTP 錯誤:', error)
    return NextResponse.json(
      { success: false, message: AUTH_MESSAGES.SERVER_ERROR },
      { status: 500 }
    )
  }
}
