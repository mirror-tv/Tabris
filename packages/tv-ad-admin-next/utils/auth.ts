/**
 * 認證工具函數（可在 Edge Runtime 使用）
 * 使用 jose 庫以支援 Edge Runtime
 */

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

import { JWT_SECRET, ENV } from '@/constants/environment-variables'

const getJwtSecret = () => {
  const secret = JWT_SECRET
  const isProduction = ENV === 'prod'

  if (
    isProduction &&
    (!secret || secret === 'dev-secret-change-in-production')
  ) {
    throw new Error(
      'JWT_SECRET 必須在生產環境中設定，不能使用預設值。請檢查環境變數設定。'
    )
  }

  return new TextEncoder().encode(secret || 'dev-secret-change-in-production')
}

export type UserPayload = {
  userId: string
  memberId: string // CMS member id（必填）
  email: string
  hasIdentified?: boolean // 是否已完成身份驗證（有填寫 nationalId 和 residentialAddress）
}

export async function generateToken(payload: UserPayload): Promise<string> {
  const JWT_SECRET = getJwtSecret()
  return await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const JWT_SECRET = getJwtSecret()
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as UserPayload
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getCurrentUser()) !== null
}
