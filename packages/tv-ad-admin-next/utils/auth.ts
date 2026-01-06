/**
 * 認證工具函數
 * 使用 Firebase ID Token 進行驗證
 */

import { cookies } from 'next/headers'

import { verifyFirebaseToken } from '@/utils/firebase-admin'

export type UserPayload = {
  userId: string // Firebase UID
  memberId: string // CMS member id（必填）
  email: string
  hasIdentified?: boolean // 是否已完成身份驗證（有填寫 nationalId 和 residentialAddress）
}

/**
 * 從 Firebase ID Token 驗證並提取 UserPayload
 */
export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const decodedToken = await verifyFirebaseToken(token)
    if (!decodedToken) {
      return null
    }

    // 從 custom claims 提取資料
    const memberId = decodedToken.memberId as string | undefined
    const email = decodedToken.email as string | undefined
    const hasIdentified = decodedToken.hasIdentified as boolean | undefined

    if (!memberId || !email) {
      console.error('Firebase token 缺少必要欄位:', {
        memberId,
        email,
        uid: decodedToken.uid,
      })
      return null
    }

    return {
      userId: decodedToken.uid,
      memberId,
      email,
      hasIdentified,
    }
  } catch (error) {
    console.error('驗證 Firebase token 失敗:', error)
    return null
  }
}

/**
 * 取得當前登入的使用者
 */
export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null
  return verifyToken(token)
}

/**
 * 檢查是否已登入
 */
export async function isAuthenticated(): Promise<boolean> {
  return (await getCurrentUser()) !== null
}
