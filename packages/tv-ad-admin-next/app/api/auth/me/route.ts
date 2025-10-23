/**
 * GET /api/auth/me
 * 取得目前登入使用者資訊
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/utils/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: '未登入' },
        { status: 401 }
      )
    }

    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Token 無效或已過期' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('取得使用者資訊錯誤:', error)
    return NextResponse.json(
      { success: false, message: '伺服器錯誤' },
      { status: 500 }
    )
  }
}
