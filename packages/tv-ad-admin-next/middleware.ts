/**
 * Next.js Middleware
 * 保護所有 route 和 API，只有登入相關的 route 可以公開訪問
 */

import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

import { verifyToken } from '@/utils/auth'

// 公開 route（不需要登入即可訪問）
const publicRoutes = ['/login']
const publicApiRoutes = ['/api/auth/send-otp', '/api/auth/verify-otp']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicRoute = publicRoutes.includes(pathname)
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isPublicRoute || isPublicApiRoute) {
    const token = request.cookies.get('auth_token')?.value
    if (token && isPublicRoute) {
      const payload = await verifyToken(token)
      if (payload && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
    return NextResponse.next()
  }

  const token = request.cookies.get('auth_token')?.value

  if (!token) {
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
