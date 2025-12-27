/**
 * Firebase Admin SDK 初始化
 * 用於服務端驗證 Firebase ID Token 和生成 Custom Token
 */

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth'

let adminApp: App | null = null

export function getFirebaseAdmin(): App {
  if (adminApp) {
    return adminApp
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n'
  )
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error(
      'Firebase Admin SDK 環境變數未設定。請設定 FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PROJECT_ID'
    )
  }

  // 檢查是否已經初始化
  const existingApp = getApps().find(
    (app) => app.name === '[DEFAULT]' || app.name === 'firebase-admin'
  )

  if (existingApp) {
    adminApp = existingApp
    return adminApp
  }

  // 初始化 Firebase Admin
  adminApp = initializeApp(
    {
      credential: cert({
        privateKey,
        clientEmail,
        projectId,
      }),
    },
    'firebase-admin'
  )

  return adminApp
}

/**
 * 驗證 Firebase ID Token
 */
export async function verifyFirebaseToken(
  idToken: string
): Promise<DecodedIdToken | null> {
  try {
    const admin = getFirebaseAdmin()
    const auth = getAuth(admin)
    const decodedToken = await auth.verifyIdToken(idToken)
    return decodedToken
  } catch (error) {
    console.error('Firebase token 驗證失敗:', error)
    return null
  }
}

/**
 * 生成 Firebase Custom Token
 * 用於 OTP 驗證成功後，為用戶生成自訂 token
 */
export async function createCustomToken(
  uid: string,
  customClaims?: Record<string, unknown>
): Promise<string> {
  try {
    const admin = getFirebaseAdmin()
    const auth = getAuth(admin)
    const customToken = await auth.createCustomToken(uid, customClaims)
    return customToken
  } catch (error) {
    console.error('生成 Firebase Custom Token 失敗:', error)
    throw error
  }
}

/**
 * 取得 Firebase User
 * 根據 email 取得對應的 Firebase UID
 * 如果找不到用戶，會拋出錯誤
 */
export async function getFirebaseUser(email: string): Promise<string> {
  try {
    const admin = getFirebaseAdmin()
    const auth = getAuth(admin)

    // 根據 email 取得用戶
    const user = await auth.getUserByEmail(email)
    return user.uid
  } catch (error: any) {
    // 如果錯誤是找不到用戶，拋出更明確的錯誤訊息
    if (error?.code === 'auth/user-not-found') {
      throw new Error(`Firebase 帳號不存在: ${email}`)
    }
    console.error('取得 Firebase User 失敗:', error)
    throw error
  }
}
