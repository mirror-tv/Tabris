/**
 * Next.js Middleware
 * 保護所有 route 和 API，只有登入相關的 route 可以公開訪問
 */

import { SignJWT } from 'jose'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

import { ENV, JWT_SECRET } from '@/constants/environment-variables'
import { verifyToken, type UserPayload } from '@/utils/auth'
import { createEdgeErrorLogger } from '@/utils/edge-error-handler'

// Edge Runtime 兼容的 base64 編碼
function base64Encode(str: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// 獲取 JWT Secret（與 utils/auth.ts 保持一致）
function getJwtSecret() {
  const secret = JWT_SECRET
  const isProduction = ENV === 'prod'

  if (
    isProduction &&
    (!secret || secret === 'dev-secret-change-in-production')
  ) {
    throw new Error(
      'JWT_SECRET 必須在生產環境中設定，不能使用預設值。請檢查環境變數設定。'
    )
  }

  return new TextEncoder().encode(secret || 'dev-secret-change-in-production')
}

// 開發環境：生成開發用 token
async function generateDevToken(): Promise<string> {
  const JWT_SECRET = getJwtSecret()

  const payload: UserPayload = {
    userId: base64Encode('dev@example.com'),
    memberId: '12',
    email: 'dev@example.com',
    hasIdentified: true,
  }

  return await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

// 公開 route（不需要登入即可訪問）
const publicRoutes = ['/login']
const publicApiRoutes = [
  '/api/auth/send-otp',
  '/api/auth/verify-otp',
  '/api/auth/me', // 允許 middleware 內部調用
  '/api/member/identity-info',
  '/api/auth/logout',
]

// 通過內部 API 獲取用戶資訊（包含 hasIdentified）
// 注意：在 Edge Runtime 中無法直接使用 GraphQL，因此使用內部 API 調用
const getUserWithIdentity = async (
  baseUrl: string,
  cookie: string
): Promise<{ hasIdentified?: boolean } | null> => {
  try {
    const response = await fetch(`${baseUrl}/api/auth/me`, {
      method: 'GET',
      headers: {
        cookie,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    if (data.success && data.user) {
      return { hasIdentified: data.user.hasIdentified }
    }
    return null
  } catch (error) {
    createEdgeErrorLogger('Failed to fetch user identity')(error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 開發/本地環境：完全繞過登入檢查，自動設置 token
  if (ENV === 'dev' || ENV === 'local') {
    const token = request.cookies.get('auth_token')?.value
    let needsNewToken = false

    // 驗證 token 是否有效
    if (token) {
      const payload = await verifyToken(token)
      // 如果 token 無效或 memberId 不是 '12'，需要重新生成
      if (!payload || payload.memberId !== '12') {
        needsNewToken = true
      }
    } else {
      needsNewToken = true
    }

    // 如果沒有 token 或 token 無效，自動生成並設置
    if (needsNewToken) {
      const devToken = await generateDevToken()
      const response = NextResponse.next()
      response.cookies.set({
        name: 'auth_token',
        value: devToken,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 天
        path: '/',
      })

      // 如果訪問登入頁，redirect 到首頁
      if (pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url))
      }

      return response
    }

    // 如果有 token 但訪問登入頁，redirect 到首頁
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // 其他情況直接通過
    return NextResponse.next()
  }

  const isPublicRoute = publicRoutes.includes(pathname)
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isPublicRoute || isPublicApiRoute) {
    const token = request.cookies.get('auth_token')?.value
    if (token && isPublicRoute && pathname === '/login') {
      const payload = await verifyToken(token)
      if (payload && payload.memberId) {
        // 檢查身份驗證狀態
        try {
          const baseUrl = request.nextUrl.origin
          const cookie = request.headers.get('cookie') || ''
          const userInfo = await getUserWithIdentity(baseUrl, cookie)

          if (userInfo) {
            const hasIdentified = userInfo.hasIdentified === true

            // 如果已完成身份驗證，redirect 到首頁
            if (hasIdentified) {
              return NextResponse.redirect(new URL('/', request.url))
            }
            // 如果未完成身份驗證，清除 token 允許重新登入
            // （關閉瀏覽器重開後可以重新登入，不需要正式登出）
            const response = NextResponse.next()
            response.cookies.delete('auth_token')
            return response
          }
        } catch (error) {
          createEdgeErrorLogger('Middleware: Failed to check member identity')(
            error
          )
        }
      }
    }
    return NextResponse.next()
  }

  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    // /identity-info 需要 token，沒有 token 要 redirect 到登入頁
    if (pathname === '/identity-info') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: '未登入' },
        { status: 401 }
      )
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const payload = await verifyToken(token)

  if (!payload) {
    if (pathname.startsWith('/api/')) {
      const response = NextResponse.json(
        { success: false, message: 'Token 無效或已過期' },
        { status: 401 }
      )
      response.cookies.delete('auth_token')
      return response
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    loginUrl.searchParams.set('expired', 'true')

    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('auth_token')
    return response
  }

  if (!payload.memberId) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: '缺少會員資訊' },
        { status: 401 }
      )
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 檢查用戶身份驗證狀態
  // 所有需要認證的路由都必須先完成身份驗證（除了 /identity-info）
  try {
    const baseUrl = request.nextUrl.origin
    const cookie = request.headers.get('cookie') || ''
    const userInfo = await getUserWithIdentity(baseUrl, cookie)

    if (userInfo) {
      const hasIdentified = userInfo.hasIdentified === true

      // 如果已完成身份驗證，訪問 /identity-info 時 redirect 到首頁
      if (hasIdentified && pathname === '/identity-info') {
        return NextResponse.redirect(new URL('/', request.url))
      }

      // 如果未完成身份驗證，所有非 /identity-info 的路由都必須 redirect 到身份驗證頁
      if (!hasIdentified && pathname !== '/identity-info') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { success: false, message: '請先完成身份驗證' },
            { status: 403 }
          )
        }
        const identityUrl = new URL('/identity-info', request.url)
        identityUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(identityUrl)
      }
    } else {
      // 無法獲取用戶資訊，視為未登入或 token 無效
      // 必須 redirect 到登入頁
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, message: '請先登入' },
          { status: 401 }
        )
      }
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('auth_token')
      return response
    }
  } catch (error) {
    createEdgeErrorLogger('Middleware: Failed to check member identity')(error)
    // 發生錯誤時，為了安全起見，redirect 到登入頁
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: '身份驗證檢查失敗，請先登入' },
        { status: 401 }
      )
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('auth_token')
    return response
  }

  if (payload && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
