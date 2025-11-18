/**
 * POST /api/auth/logout
 * 登出使用者
 */

import { NextResponse } from 'next/server'

import { createErrorLogger } from '@/utils/error-handler'

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: '登出成功',
    })

    // 使用 Next.js 推薦的方式刪除 cookie
    response.cookies.delete('auth_token')

    return response
  } catch (error) {
    createErrorLogger('登出錯誤')(error)
    return NextResponse.json(
      { success: false, message: '伺服器錯誤' },
      { status: 500 }
    )
  }
}
