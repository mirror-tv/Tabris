// Temporary middleware for K6 endpoint migration validation.
// 暫時性的 K6 endpoint migration 驗證 middleware。
// TODO: Remove this file after ENABLE_K6_NEW_ENDPOINTS verification is complete.
// TODO: 在 ENABLE_K6_NEW_ENDPOINTS 驗證完成後移除此檔案。
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Import the runtime feature toggle value.
// 匯入 runtime feature toggle 的值。
import { ENABLE_K6_NEW_ENDPOINTS } from './constants/config'
// Import the resolved runtime endpoints that need to be exposed for verification.
// 匯入需要暴露給驗證用途的最終 runtime endpoints。
import { API_ENDPOINT, JSON_BASE_URL } from './constants/endpoint-config'

// Only expose validation headers on document-like requests.
// 只在類似 document 的請求上暴露驗證 header。
const shouldAttachK6ValidationHeaders = (request: NextRequest) => {
  // Skip non-document methods to avoid affecting unrelated responses.
  // 跳過非 document 類型的方法，避免影響無關 response。
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    // Return false for methods that should not carry debug headers.
    // 對不該攜帶 debug header 的方法回傳 false。
    return false
  }

  // Skip Next.js prefetch and RSC payload requests because they are noisy for manual checks.
  // 跳過 Next.js prefetch 與 RSC payload 請求，因為它們會干擾人工檢查。
  if (
    // Ignore router prefetch requests.
    // 忽略 router prefetch 請求。
    request.headers.has('next-router-prefetch') ||
    // Ignore generic browser prefetch requests.
    // 忽略瀏覽器通用 prefetch 請求。
    request.headers.get('purpose') === 'prefetch' ||
    // Ignore React Server Component payload requests.
    // 忽略 React Server Component payload 請求。
    request.headers.get('rsc') === '1'
  ) {
    // Return false when the request is not the HTML response we want to inspect.
    // 當請求不是我們要檢查的 HTML response 時回傳 false。
    return false
  }

  // Allow HEAD requests because header-only checks are useful during validation.
  // 允許 HEAD 請求，因為 validation 期間做純 header 檢查也很有用。
  if (request.method === 'HEAD') {
    // Return true after the exclusion checks above.
    // 在前面的排除檢查之後回傳 true。
    return true
  }

  // Read the Accept header to identify HTML document requests.
  // 讀取 Accept header 以辨識 HTML document 請求。
  const accept = request.headers.get('accept') || ''
  // Only attach headers to requests that explicitly accept HTML.
  // 只對明確接受 HTML 的請求附加 header。
  return accept.includes('text/html')
}

// Inject temporary validation headers into the outgoing response.
// 將暫時性的 validation header 注入到 outgoing response。
export function middleware(request: NextRequest) {
  // Create the default passthrough response first.
  // 先建立預設的 passthrough response。
  const response = NextResponse.next()

  // Stop early when the current request is not suitable for header validation.
  // 當前請求不適合做 header 驗證時提早結束。
  if (!shouldAttachK6ValidationHeaders(request)) {
    // Return the untouched response.
    // 回傳未修改的 response。
    return response
  }

  // Expose the current feature toggle state.
  // 暴露目前的 feature toggle 狀態。
  response.headers.set('X-Enable-K6-Endpoints', String(ENABLE_K6_NEW_ENDPOINTS))
  // Expose the final resolved GraphQL API endpoint.
  // 暴露最終解析後的 GraphQL API endpoint。
  response.headers.set('X-Api-Endpoint', API_ENDPOINT)
  // Expose the final resolved JSON base URL.
  // 暴露最終解析後的 JSON base URL。
  response.headers.set('X-Json-Base-Url', JSON_BASE_URL)
  // Return the response with validation headers attached.
  // 回傳已附加 validation header 的 response。
  return response
}

// Restrict this temporary middleware to page-like routes only.
// 將這個暫時性 middleware 限制在頁面型路由。
export const config = {
  // Exclude API routes, Next internals, favicon, and file assets.
  // 排除 API routes、Next 內部路徑、favicon 與檔案資產。
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
