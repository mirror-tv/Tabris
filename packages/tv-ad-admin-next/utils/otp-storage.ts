/**
 * OTP 存儲服務（僅在 Node.js Runtime 使用，例如 API Routes）
 * 使用文件系統存儲，避免 Hot Reload 清空
 */

import fs from 'fs'
import path from 'path'

const OTP_CACHE_DIR = path.join(process.cwd(), '.cache', 'otp')

// 確保緩存目錄存在
if (!fs.existsSync(OTP_CACHE_DIR)) {
  fs.mkdirSync(OTP_CACHE_DIR, { recursive: true })
}

type OTPData = {
  code: string
  expires: number
  attempts: number
}

// 從文件讀取 OTP
function readOTPFromFile(identifier: string): OTPData | null {
  try {
    const filePath = path.join(
      OTP_CACHE_DIR,
      `${Buffer.from(identifier).toString('base64')}.json`
    )
    if (!fs.existsSync(filePath)) {
      return null
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    // 檢查是否過期
    if (Date.now() > data.expires) {
      fs.unlinkSync(filePath)
      return null
    }

    return data
  } catch (error) {
    console.error('[OTP] 讀取錯誤:', error)
    return null
  }
}

// 寫入 OTP 到文件
function writeOTPToFile(identifier: string, data: OTPData): void {
  try {
    const filePath = path.join(
      OTP_CACHE_DIR,
      `${Buffer.from(identifier).toString('base64')}.json`
    )
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('[OTP] 寫入錯誤:', error)
  }
}

// 刪除 OTP 文件
function deleteOTPFile(identifier: string): void {
  try {
    const filePath = path.join(
      OTP_CACHE_DIR,
      `${Buffer.from(identifier).toString('base64')}.json`
    )
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error('[OTP] 刪除錯誤:', error)
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function storeOTP(identifier: string, code: string): void {
  const expires = Date.now() + 5 * 60 * 1000 // 5分钟
  const data: OTPData = { code, expires, attempts: 0 }

  writeOTPToFile(identifier, data)

  // 開發環境：顯示存儲資訊
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[OTP] ✅ 已存儲到文件 - Identifier: ${identifier}, Code: ${code}`
    )
    console.log(`[OTP] 過期時間: ${new Date(expires).toLocaleString()}`)
  }

  // 自动清理（5分鐘後刪除文件）
  setTimeout(() => deleteOTPFile(identifier), 5 * 60 * 1000)
}

export function verifyOTP(
  identifier: string,
  code: string
): {
  success: boolean
  message: string
} {
  // 開發環境：顯示驗證資訊
  if (process.env.NODE_ENV === 'development') {
    console.log(`[OTP] 🔍 嘗試驗證 - Identifier: ${identifier}, Code: ${code}`)
  }

  const stored = readOTPFromFile(identifier)

  if (!stored) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[OTP] ❌ 找不到 OTP 文件 - Identifier: ${identifier}`)
    }
    return { success: false, message: '驗證碼不存在或已過期' }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[OTP] ✅ 找到 OTP 文件 - Code: ${stored.code}, 嘗試次數: ${stored.attempts}`
    )
  }

  if (Date.now() > stored.expires) {
    deleteOTPFile(identifier)
    return { success: false, message: '驗證碼已過期' }
  }

  if (stored.attempts >= 3) {
    deleteOTPFile(identifier)
    return { success: false, message: '嘗試次數過多' }
  }

  if (stored.code !== code) {
    stored.attempts++
    writeOTPToFile(identifier, stored) // 更新嘗試次數
    return {
      success: false,
      message: `驗證碼錯誤，還剩 ${5 - stored.attempts} 次機會`,
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[OTP] ✅ 驗證成功！`)
  }

  deleteOTPFile(identifier)
  return { success: true, message: '驗證成功' }
}
