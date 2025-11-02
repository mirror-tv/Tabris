/**
 * 認證工具函數（可在 Edge Runtime 使用）
 * 使用 jose 庫以支援 Edge Runtime
 */

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production'
)

export type UserPayload = {
  userId: string
  email?: string
  phone?: string
}

export async function generateToken(payload: UserPayload): Promise<string> {
  return await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
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
