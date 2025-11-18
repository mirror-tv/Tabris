/**
 * Next.js Middleware
 * 保護所有 route 和 API，只有登入相關的 route 可以公開訪問
 */

import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

import { verifyToken } from '@/utils/auth'
import { createErrorLogger } from '@/utils/error-handler'

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
    createErrorLogger('Failed to fetch user identity')(error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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
          createErrorLogger('Middleware: Failed to check member identity')(
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
      // 無法獲取用戶資訊，視為未完成身份驗證
      // 如果不在身份驗證頁，則 redirect 到身份驗證頁
      if (pathname !== '/identity-info') {
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
    }
  } catch (error) {
    createErrorLogger('Middleware: Failed to check member identity')(error)
    // 發生錯誤時，為了安全起見，如果不在身份驗證頁，則 redirect 到身份驗證頁
    if (pathname !== '/identity-info') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, message: '身份驗證檢查失敗，請先完成身份驗證' },
          { status: 403 }
        )
      }
      const identityUrl = new URL('/identity-info', request.url)
      identityUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(identityUrl)
    }
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
