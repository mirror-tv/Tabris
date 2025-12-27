/**
 * Firebase Client SDK 初始化
 * 用於客戶端處理認證和 token refresh
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  signInWithCustomToken,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth'

let firebaseApp: FirebaseApp | null = null

export function getFirebaseApp(): FirebaseApp {
  // 只在客戶端執行
  if (typeof window === 'undefined') {
    throw new Error('Firebase Client SDK 只能在客戶端使用')
  }

  if (firebaseApp) {
    return firebaseApp
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

  if (!apiKey || !authDomain || !projectId) {
    throw new Error(
      'Firebase Client SDK 環境變數未設定。請設定 NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    )
  }

  // 檢查是否已經初始化
  const existingApp = getApps().find((app) => app.name === '[DEFAULT]')

  if (existingApp) {
    firebaseApp = existingApp
    return firebaseApp
  }

  // 初始化 Firebase Client
  firebaseApp = initializeApp({
    apiKey,
    authDomain,
    projectId,
  })

  return firebaseApp
}

export function getFirebaseAuth(): Auth {
  const app = getFirebaseApp()
  return getAuth(app)
}

/**
 * 使用 Custom Token 登入
 */
export async function signInWithCustomTokenClient(
  customToken: string
): Promise<User> {
  const auth = getFirebaseAuth()
  const userCredential = await signInWithCustomToken(auth, customToken)
  return userCredential.user
}

/**
 * 登出 Firebase
 */
export async function signOutFirebase(): Promise<void> {
  const auth = getFirebaseAuth()
  await signOut(auth)
}

/**
 * 取得當前的 ID Token
 */
export async function getCurrentIdToken(): Promise<string | null> {
  const auth = getFirebaseAuth()
  const user = auth.currentUser

  if (!user) {
    return null
  }

  try {
    return await user.getIdToken()
  } catch (error) {
    console.error('取得 ID Token 失敗:', error)
    return null
  }
}
