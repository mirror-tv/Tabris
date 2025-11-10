/**
 * Rate Limiting 工具
 * 防止暴力破解和頻繁請求
 */

import fs from 'fs'
import path from 'path'

import { OTP_MAX_ATTEMPTS } from '@/constants'

const RATE_LIMIT_DIR = path.join(process.cwd(), '.cache', 'rate-limit')

// 確保緩存目錄存在
if (!fs.existsSync(RATE_LIMIT_DIR)) {
  fs.mkdirSync(RATE_LIMIT_DIR, { recursive: true })
}

type RateLimitRecord = {
  count: number
  resetTime: number
  blockedUntil?: number
}

type RateLimitConfig = {
  maxAttempts: number // 最大嘗試次數
  windowMs: number // 時間窗口（毫秒）
  blockDurationMs?: number // 封鎖時長（毫秒）
}

/**
 * 預設配置
 */
export const RATE_LIMIT_CONFIGS = {
  // 發送 OTP：每個 identifier 每分鐘最多 3 次
  SEND_OTP: {
    maxAttempts: OTP_MAX_ATTEMPTS,
    windowMs: 60 * 1000, // 1 分鐘
    blockDurationMs: 5 * 60 * 1000, // 封鎖 5 分鐘
  },
  // 驗證 OTP：每個 identifier 每小時最多 10 次
  VERIFY_OTP: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 小時
    blockDurationMs: 30 * 60 * 1000, // 封鎖 30 分鐘
  },
  // IP 全局限制：每 IP 每分鐘最多 20 次請求
  GLOBAL_IP: {
    maxAttempts: 20,
    windowMs: 60 * 1000, // 1 分鐘
    blockDurationMs: 5 * 60 * 1000, // 封鎖 5 分鐘
  },
} as const

/**
 * 從文件讀取 Rate Limit 記錄
 */
function readRateLimitRecord(key: string): RateLimitRecord | null {
  try {
    const filePath = path.join(
      RATE_LIMIT_DIR,
      `${Buffer.from(key).toString('base64')}.json`
    )
    if (!fs.existsSync(filePath)) {
      return null
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    return data
  } catch (error) {
    console.error('[RateLimit] 讀取錯誤:', error)
    return null
  }
}

/**
 * 寫入 Rate Limit 記錄到文件
 */
function writeRateLimitRecord(key: string, record: RateLimitRecord): void {
  try {
    const filePath = path.join(
      RATE_LIMIT_DIR,
      `${Buffer.from(key).toString('base64')}.json`
    )
    fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf-8')
  } catch (error) {
    console.error('[RateLimit] 寫入錯誤:', error)
  }
}

/**
 * 刪除 Rate Limit 記錄文件
 */
function deleteRateLimitRecord(key: string): void {
  try {
    const filePath = path.join(
      RATE_LIMIT_DIR,
      `${Buffer.from(key).toString('base64')}.json`
    )
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error('[RateLimit] 刪除錯誤:', error)
  }
}

/**
 * 檢查是否超過 Rate Limit
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
} {
  const now = Date.now()
  const record = readRateLimitRecord(key)

  // 檢查是否被封鎖
  if (record?.blockedUntil && now < record.blockedUntil) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000)
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.blockedUntil,
      retryAfter,
    }
  }

  // 如果沒有記錄或已過時間窗口，創建新記錄
  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + config.windowMs,
    }
    writeRateLimitRecord(key, newRecord)
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: newRecord.resetTime,
    }
  }

  // 檢查是否超過限制
  if (record.count >= config.maxAttempts) {
    // 超過限制，封鎖
    const blockedUntil = now + (config.blockDurationMs || config.windowMs)
    record.blockedUntil = blockedUntil
    writeRateLimitRecord(key, record)

    const retryAfter = Math.ceil((blockedUntil - now) / 1000)
    return {
      allowed: false,
      remaining: 0,
      resetTime: blockedUntil,
      retryAfter,
    }
  }

  // 增加計數
  record.count += 1
  writeRateLimitRecord(key, record)

  return {
    allowed: true,
    remaining: config.maxAttempts - record.count,
    resetTime: record.resetTime,
  }
}

/**
 * 重置 Rate Limit（用於成功操作後）
 */
export function resetRateLimit(key: string): void {
  deleteRateLimitRecord(key)
}

/**
 * 清理過期的 Rate Limit 記錄
 */
export function cleanupExpiredRateLimits(): void {
  try {
    const files = fs.readdirSync(RATE_LIMIT_DIR)
    const now = Date.now()

    files.forEach((file) => {
      const filePath = path.join(RATE_LIMIT_DIR, file)
      try {
        const data: RateLimitRecord = JSON.parse(
          fs.readFileSync(filePath, 'utf-8')
        )

        // 如果重置時間和封鎖時間都已過期，刪除文件
        const isExpired =
          now > data.resetTime &&
          (!data.blockedUntil || now > data.blockedUntil)

        if (isExpired) {
          fs.unlinkSync(filePath)
        }
      } catch {
        // 如果文件損壞，也刪除
        fs.unlinkSync(filePath)
      }
    })
  } catch (error) {
    console.error('[RateLimit] 清理錯誤:', error)
  }
}

// 定期清理（每 10 分鐘）
if (process.env.NODE_ENV !== 'test') {
  setInterval(cleanupExpiredRateLimits, 10 * 60 * 1000)
}

/**
 * 獲取客戶端 IP
 */
export function getClientIp(request: Request): string {
  // 從 headers 中獲取真實 IP（考慮代理）
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  // 開發環境回退值
  return 'dev-ip'
}
