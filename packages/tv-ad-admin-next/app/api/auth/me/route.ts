/**
 * GET /api/auth/me
 * 取得目前登入使用者資訊
 */

import { NextRequest, NextResponse } from 'next/server'

import { ENV } from '@/constants/environment-variables'
import { verifyToken, type UserPayload } from '@/utils/auth'
import { createErrorLogger } from '@/utils/error-handler'
import { getMemberById } from '@/utils/member'

export const dynamic = 'force-dynamic'

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

    // 開發環境：直接返回固定的 memberId 和已通過身份驗證的狀態
    if (ENV === 'dev') {
      const userWithIdentified: UserPayload = {
        ...user,
        memberId: '12',
        hasIdentified: true, // 已通過身份驗證
      }

      return NextResponse.json({
        success: true,
        user: userWithIdentified,
      })
    }

    // 查詢 member 資料以判斷是否已完成身份驗證
    const member = await getMemberById(user.memberId)
    const hasIdentified = !!member?.nationalId && !!member?.residentialAddress

    const userWithIdentified: UserPayload = {
      ...user,
      hasIdentified,
    }

    return NextResponse.json({
      success: true,
      user: userWithIdentified,
    })
  } catch (error) {
    createErrorLogger('取得使用者資訊錯誤')(error)
    return NextResponse.json(
      { success: false, message: '伺服器錯誤' },
      { status: 500 }
    )
  }
}
