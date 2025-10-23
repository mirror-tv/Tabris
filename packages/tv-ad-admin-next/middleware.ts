/**
 * Next.js Middleware
 * 保護需要登入的路由
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/utils/auth'

// 需要登入才能訪問的路由
const protectedRoutes = ['/list', '/order', '/dashboard', '/upload', '/preview']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 檢查是否是受保護的路由
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // 從 cookie 取得 token
  const token = request.cookies.get('auth_token')?.value

  // 如果是受保護的路由但沒有 token，重定向到登入頁
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 驗證 token
  if (token) {
    const payload = await verifyToken(token)

    // Token 無效或過期
    if (!payload && isProtectedRoute) {
      const loginUrl = new URL('/', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('expired', 'true')

      // 清除 cookie
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('auth_token')
      return response
    }

    // 如果已登入且訪問登入頁，重定向到 dashboard
    if (payload && pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|assets).*)',
  ],
}
