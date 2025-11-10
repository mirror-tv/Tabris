/**
 * OTP 存儲服務
 * 使用 Redis 存儲
 */

import { getRedisClient } from './redis-client'

import { OTP_MAX_ATTEMPTS } from '@/constants'


type OTPData = {
  code: string
  expires: number
  attempts: number
}

const OTP_KEY_PREFIX = 'otp:'
const OTP_EXPIRY_SECONDS = 5 * 60

function getOTPKey(identifier: string): string {
  return `${OTP_KEY_PREFIX}${identifier}`
}

async function readOTPFromRedis(identifier: string): Promise<OTPData | null> {
  try {
    const redis = getRedisClient()
    const key = getOTPKey(identifier)
    const data = await redis.get(key)

    if (!data) {
      return null
    }

    const otpData: OTPData = JSON.parse(data)

    // 檢查是否過期
    if (Date.now() > otpData.expires) {
      await redis.del(key)
      return null
    }

    return otpData
  } catch (error) {
    console.error('[OTP] Redis 讀取錯誤:', error)
    return null
  }
}

/**
 * 寫入 OTP 到 Redis
 */
async function writeOTPToRedis(
  identifier: string,
  data: OTPData
): Promise<void> {
  try {
    const redis = getRedisClient()
    const key = getOTPKey(identifier)

    await redis.setex(key, OTP_EXPIRY_SECONDS, JSON.stringify(data))
  } catch (error) {
    console.error('[OTP] Redis 寫入錯誤:', error)
    throw error
  }
}

/**
 * 刪除 Redis 中的 OTP
 */
async function deleteOTPFromRedis(identifier: string): Promise<void> {
  try {
    const redis = getRedisClient()
    const key = getOTPKey(identifier)
    await redis.del(key)
  } catch (error) {
    console.error('[OTP] Redis 刪除錯誤:', error)
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function storeOTP(
  identifier: string,
  code: string
): Promise<void> {
  const expires = Date.now() + OTP_EXPIRY_SECONDS * 1000
  const data: OTPData = { code, expires, attempts: 0 }

  await writeOTPToRedis(identifier, data)

  // 開發環境：顯示存儲資訊
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[OTP] ✅ 已存儲到 Redis - Identifier: ${identifier}, Code: ${code}`
    )
    console.log(`[OTP] 過期時間: ${new Date(expires).toLocaleString()}`)
  }
}


export async function verifyOTP(
  identifier: string,
  code: string
): Promise<{
  success: boolean
  message: string
}> {
  // 開發環境：顯示驗證資訊
  if (process.env.NODE_ENV === 'development') {
    console.log(`[OTP] 🔍 嘗試驗證 - Identifier: ${identifier}, Code: ${code}`)
  }

  const stored = await readOTPFromRedis(identifier)

  if (!stored) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[OTP] ❌ 找不到 OTP - Identifier: ${identifier}`)
    }
    return { success: false, message: '驗證碼不存在或已過期' }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[OTP] ✅ 找到 OTP - Code: ${stored.code}, 嘗試次數: ${stored.attempts}`
    )
  }

  if (Date.now() > stored.expires) {
    await deleteOTPFromRedis(identifier)
    return { success: false, message: '驗證碼已過期' }
  }

  if (stored.attempts >= OTP_MAX_ATTEMPTS) {
    await deleteOTPFromRedis(identifier)
    return { success: false, message: '嘗試次數過多' }
  }

  if (stored.code !== code) {
    stored.attempts++
    await writeOTPToRedis(identifier, stored) // 更新嘗試次數
    return {
      success: false,
      message: `驗證碼錯誤，還剩 ${OTP_MAX_ATTEMPTS - stored.attempts} 次機會`,
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[OTP] ✅ 驗證成功！`)
  }

  await deleteOTPFromRedis(identifier)
  return { success: true, message: '驗證成功' }
}
