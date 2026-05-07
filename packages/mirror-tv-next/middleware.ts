import { NextResponse, type NextRequest } from 'next/server'
import { IS_PREVIEW_MODE, SITE_BASE_PATH } from './constants/environment'

export function middleware(request: NextRequest) {
  if (IS_PREVIEW_MODE && request.nextUrl.pathname.startsWith('/images-next')) {
    return NextResponse.rewrite(
      new URL(`${SITE_BASE_PATH}${request.nextUrl.pathname}`, request.url)
    )
  }
  return NextResponse.next()
}
