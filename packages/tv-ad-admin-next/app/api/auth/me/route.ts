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

    // 開發環境：如果沒有 token，返回 mock 用戶資料（僅用於 PM 驗收）
    if (!token && (ENV === 'local' || ENV === 'dev')) {
      const mockUser: UserPayload = {
        userId: Buffer.from('dev@example.com').toString('base64'),
        memberId: '12',
        email: 'dev@example.com',
        hasIdentified: true,
      }
      return NextResponse.json({
        success: true,
        user: mockUser,
      })
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: '未登入' },
        { status: 401 }
      )
    }

    const user = await verifyToken(token)

    if (!user) {
      // 開發環境：如果 token 無效，返回 mock 用戶資料
      if (ENV === 'local' || ENV === 'dev') {
        const mockUser: UserPayload = {
          userId: Buffer.from('dev@example.com').toString('base64'),
          memberId: '12',
          email: 'dev@example.com',
          hasIdentified: true,
        }
        return NextResponse.json({
          success: true,
          user: mockUser,
        })
      }
      return NextResponse.json(
        { success: false, message: 'Token 無效或已過期' },
        { status: 401 }
      )
    }

    // 開發環境：直接使用 token 中的資料，跳過 member 查詢（加快速度）
    if (ENV === 'local' || ENV === 'dev') {
      return NextResponse.json({
        success: true,
        user: {
          ...user,
          hasIdentified: user.hasIdentified ?? true, // 確保 hasIdentified 為 true
        },
      })
    }

    // 生產環境：查詢 member 資料以判斷是否已完成身份驗證
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
    // 開發環境：發生錯誤時也返回 mock 資料
    if (ENV === 'local' || ENV === 'dev') {
      const mockUser: UserPayload = {
        userId: Buffer.from('dev@example.com').toString('base64'),
        memberId: '12',
        email: 'dev@example.com',
        hasIdentified: true,
      }
      return NextResponse.json({
        success: true,
        user: mockUser,
      })
    }
    return NextResponse.json(
      { success: false, message: '伺服器錯誤' },
      { status: 500 }
    )
  }
}
