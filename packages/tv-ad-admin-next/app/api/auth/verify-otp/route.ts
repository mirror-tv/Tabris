/**
 * POST /api/auth/verify-otp
 * 驗證 OTP 並生成 JWT token
 */

import { NextRequest, NextResponse } from 'next/server'

import { generateToken } from '@/utils/auth'
import { getMemberByEmail } from '@/utils/member'
import { verifyOTP } from '@/utils/otp-storage'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!otp) {
      return NextResponse.json(
        { success: false, message: '請輸入驗證碼' },
        { status: 400 }
      )
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: '請提供電子信箱' },
        { status: 400 }
      )
    }

    // 驗證 OTP
    const result = verifyOTP(email, otp)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      )
    }

    // 生成使用者 ID
    const userId = Buffer.from(email).toString('base64')

    // 取得 member id（登入時就取得，之後可以直接用 id 查詢）
    const member = await getMemberByEmail(email)

    if (!member?.id) {
      return NextResponse.json(
        { success: false, message: '無法取得會員資料，請重新登入' },
        { status: 404 }
      )
    }

    const userPayload = {
      userId,
      memberId: member.id,
      email,
    }

    // 生成 JWT token（必須包含 memberId）
    const token = await generateToken(userPayload)

    const response = NextResponse.json({
      success: true,
      message: '登入成功',
      user: userPayload,
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
