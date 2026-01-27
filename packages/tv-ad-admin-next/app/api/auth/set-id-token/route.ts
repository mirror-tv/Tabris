/**
 * POST /api/auth/set-id-token
 * 設置 Firebase ID Token 到 Cookie
 */

import { NextRequest, NextResponse } from 'next/server'

import { verifyFirebaseToken } from '@/utils/firebase-admin'
import { createErrorLogger } from '@/utils/error-handler'

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json(
        { success: false, message: '請提供 ID Token' },
        { status: 400 }
      )
    }

    // 驗證 ID Token
    const decodedToken = await verifyFirebaseToken(idToken)

    if (!decodedToken) {
      return NextResponse.json(
        { success: false, message: 'ID Token 無效或已過期' },
        { status: 401 }
      )
    }

    // 從 custom claims 提取資料
    const memberId = decodedToken.memberId as string | undefined
    const email = decodedToken.email as string | undefined
    const hasIdentified = decodedToken.hasIdentified as boolean | undefined

    if (!memberId || !email) {
      return NextResponse.json(
        { success: false, message: 'Token 缺少必要欄位' },
        { status: 401 }
      )
    }

    // 檢查請求是否為 HTTPS（考慮 Google Cloud Run 的代理情況）
    const forwardedProto = request.headers.get('x-forwarded-proto')
    const isSecure = forwardedProto === 'https'

    const response = NextResponse.json({
      success: true,
      message: '登入成功',
      user: {
        userId: decodedToken.uid,
        memberId,
        email,
        hasIdentified,
      },
    })

    // 設置 ID Token 到 Cookie
    response.cookies.set({
      name: 'auth_token',
      value: idToken,
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 天
      path: '/',
    })

    // 同時設置響應頭，確保 cookie 被正確設置
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    createErrorLogger('設置 ID Token 錯誤')(error)
    return NextResponse.json(
      { success: false, message: '伺服器錯誤' },
      { status: 500 }
    )
  }
}
