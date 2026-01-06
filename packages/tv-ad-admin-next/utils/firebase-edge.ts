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
    // 🔒 安全性：先解析並驗證 token 結構，確保 token 格式正確
    const tokenParts = idToken.split('.')
    if (tokenParts.length !== 3) {
      console.error('Firebase token 格式無效')
      return null
    }

    // 🔒 安全性：先從 token 中提取 payload 以獲取 UID（用於後續驗證）
    const initialPayload = parseJWTPayload(idToken)
    if (!initialPayload) {
      console.error('無法解析 Firebase token payload')
      return null
    }

    const tokenUid = initialPayload.uid as string | undefined
    if (!tokenUid) {
      console.error('Firebase token 缺少 uid')
      return null
    }

    // 🔒 安全性：使用 Firebase REST API 驗證 token
    // 如果 token 的 payload 被修改，簽名會失效，API 會返回錯誤
    // 只有通過 Firebase 驗證的 token（簽名匹配）才會返回用戶資料
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
      // Token 無效、偽造或簽名不匹配，Firebase API 已拒絕
      console.error('Firebase API 驗證失敗:', response.status, response.statusText)
      return null
    }

    const data = await response.json()

    if (!data.users || data.users.length === 0) {
      return null
    }

    const user = data.users[0]

    // 🔒 安全性：驗證 API 返回的 UID 與 token 中的 UID 一致
    // 這確保我們使用的是通過 Firebase 驗證的 token
    if (user.localId !== tokenUid) {
      console.error('Token UID 與 API 返回的 UID 不一致，可能被篡改:', {
        tokenUid,
        apiUid: user.localId,
      })
      return null
    }

    // 🔒 安全性：重新從驗證過的 token 中提取 payload
    // 雖然 Firebase API 已經驗證了簽名，但我們需要確保使用正確的 payload
    // 如果 token 被修改，API 會拒絕，所以這裡的 payload 應該是安全的
    const payload = parseJWTPayload(idToken)

    if (!payload) {
      return null
    }

    // 🔒 安全性：再次驗證 payload 中的 UID 與 API 返回的一致
    if (payload.uid !== user.localId) {
      console.error('Payload UID 與 API 返回的 UID 不一致')
      return null
    }

    const memberId = payload.memberId as string | undefined
    const email = payload.email as string | undefined
    const hasIdentified = payload.hasIdentified as boolean | undefined

    // 🔒 安全性：優先使用 API 返回的 email（更可靠），否則使用 payload 中的 email
    const userEmail = user.email || email

    if (!memberId || !userEmail) {
      console.error('Firebase token 缺少必要欄位:', {
        memberId,
        email: userEmail,
        uid: user.localId,
      })
      return null
    }

    // 🔒 安全性：最終驗證 - 確保 memberId 是字符串類型
    if (typeof memberId !== 'string') {
      console.error('memberId 類型無效:', typeof memberId)
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
