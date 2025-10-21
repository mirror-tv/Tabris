/**
 * 表單驗證工具
 */

export type ValidationResult = {
  isValid: boolean
  error?: string
}

/**
 * Email 驗證
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || !email.trim()) {
    return { isValid: false, error: '請輸入電子信箱' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: '請輸入有效的電子信箱格式' }
  }

  return { isValid: true }
}

/**
 * 手機號碼驗證（台灣格式：09XXXXXXXX）
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: '請輸入手機號碼' }
  }

  const cleanPhone = phone.replace(/\s/g, '')
  const phoneRegex = /^09\d{8}$/

  if (!phoneRegex.test(cleanPhone)) {
    return {
      isValid: false,
      error: '請輸入有效的手機號碼格式 (例：0922119187)',
    }
  }

  return { isValid: true }
}

/**
 * OTP 驗證碼驗證
 */
export function validateOTP(otp: string): ValidationResult {
  if (!otp || !otp.trim()) {
    return { isValid: false, error: '請輸入驗證碼' }
  }

  if (otp.length !== 6) {
    return { isValid: false, error: '驗證碼必須為 6 位數' }
  }

  if (!/^\d{6}$/.test(otp)) {
    return { isValid: false, error: '驗證碼只能包含數字' }
  }

  return { isValid: true }
}

/**
 * 清理手機號碼（移除空格、連字符等）
 */
export function cleanPhone(phone: string): string {
  return phone.replace(/[\s-]/g, '')
}

/**
 * 格式化手機號碼顯示（例：0922-119-187）
 */
export function formatPhoneDisplay(phone: string): string {
  const clean = cleanPhone(phone)
  if (clean.length === 10) {
    return `${clean.slice(0, 4)}-${clean.slice(4, 7)}-${clean.slice(7)}`
  }
  return clean
}
