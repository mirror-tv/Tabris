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
