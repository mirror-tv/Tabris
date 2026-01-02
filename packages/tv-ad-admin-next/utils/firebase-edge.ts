/**
 * Firebase Edge Runtime 驗證工具
 * 使用 Firebase REST API 驗證 ID Token（支援 Edge Runtime）
 */

import type { UserPayload } from '@/utils/auth'

const FIREBASE_PROJECT_ID = process.env.FIREBASE_ADMIN_PROJECT_ID
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

/**
 * 使用 Firebase REST API 驗證 ID Token
 * 這個方法可以在 Edge Runtime 中使用
 */
export async function verifyFirebaseTokenEdge(
  idToken: string
): Promise<UserPayload | null> {
  if (!FIREBASE_PROJECT_ID) {
    console.error('FIREBASE_ADMIN_PROJECT_ID 未設定')
    return null
  }

  if (!FIREBASE_API_KEY) {
    console.error('NEXT_PUBLIC_FIREBASE_API_KEY 未設定')
    return null
  }

  try {
    // 使用 Firebase REST API 驗證 token
    // 如果 token 是偽造的或無效，API 會返回錯誤（如 400 Bad Request）
    // 只有通過 Firebase 驗證的 token 才會返回用戶資料
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
        }),
      }
    )

    if (!response.ok) {
      // Token 無效或偽造，Firebase API 已拒絕
      return null
    }

    const data = await response.json()

    if (!data.users || data.users.length === 0) {
      return null
    }

    const user = data.users[0]

    // accounts:lookup API 已經驗證了 idToken 的有效性（包括簽名驗證）
    // 如果 token 是偽造的，API 會返回錯誤，不會到達這裡
    // 因此我們可以安全地從驗證過的 token 中提取 custom claims
    // 注意：custom claims 存儲在 token 中，API 響應可能不直接包含
    const payload = parseJWTPayload(idToken)

    if (!payload) {
      return null
    }

    const memberId = payload.memberId as string | undefined
    const email = payload.email as string | undefined
    const hasIdentified = payload.hasIdentified as boolean | undefined

    // 優先使用 API 返回的 email（如果有的話），否則使用 payload 中的 email
    const userEmail = user.email || email

    if (!memberId || !userEmail) {
      console.error('Firebase token 缺少必要欄位:', {
        memberId,
        email: userEmail,
        uid: user.localId,
      })
      return null
    }

    return {
      userId: user.localId,
      memberId,
      email: userEmail,
      hasIdentified,
    }
  } catch (error) {
    console.error('驗證 Firebase token 失敗 (Edge):', error)
    return null
  }
}

/**
 * 解析 JWT payload（不驗證簽名）
 * 僅用於 Edge Runtime 中提取 custom claims
 */
function parseJWTPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // Base64 URL decode (Edge Runtime 兼容)
    const payload = parts[1]
    // 將 base64url 轉換為 base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    // 補齊 padding
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    )

    // 使用 TextDecoder 解碼（Edge Runtime 兼容）
    const binaryString = atob(padded)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const decoded = new TextDecoder().decode(bytes)

    return JSON.parse(decoded) as Record<string, unknown>
  } catch (error) {
    console.error('解析 JWT payload 失敗:', error)
    return null
  }
}
