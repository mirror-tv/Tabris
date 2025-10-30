/**
 * POST /api/auth/verify-otp
 * 驗證 OTP 並生成 JWT token
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/utils/otp-storage'
import { generateToken } from '@/utils/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, phone, otp, type } = await request.json()

    if (!otp) {
      return NextResponse.json(
        { success: false, message: '請輸入驗證碼' },
        { status: 400 }
      )
    }

    const identifier = type === 'email' ? email : phone

    if (!identifier) {
      return NextResponse.json(
        { success: false, message: '請提供 Email 或手機號碼' },
        { status: 400 }
      )
    }

    // 驗證 OTP
    const result = verifyOTP(identifier, otp)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      )
    }

    // 生成使用者 ID
    const userId = Buffer.from(identifier).toString('base64')

    // 生成 JWT token
    const token = await generateToken({
      userId,
      email: type === 'email' ? email : undefined,
      phone: type === 'phone' ? phone : undefined,
    })

    const response = NextResponse.json({
      success: true,
      message: '登入成功',
      user: {
        userId,
        email: type === 'email' ? email : undefined,
        phone: type === 'phone' ? phone : undefined,
      },
    })

    // 使用 Next.js 推薦的方式設定 cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 天
      path: '/',
    })

    return response
  } catch (error) {
    console.error('驗證 OTP 錯誤:', error)
    return NextResponse.json(
      { success: false, message: '伺服器錯誤' },
      { status: 500 }
    )
  }
}
