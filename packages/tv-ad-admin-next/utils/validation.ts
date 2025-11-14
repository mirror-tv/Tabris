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

export function validateTaiwanNationalId(id: string): boolean {
  if (!id || typeof id !== 'string') return false

  const idPattern = /^[A-Z][12]\d{8}$/
  if (!idPattern.test(id)) return false

  const letterValues: Record<string, number> = {
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    G: 16,
    H: 17,
    I: 34,
    J: 18,
    K: 19,
    L: 20,
    M: 21,
    N: 22,
    O: 35,
    P: 23,
    Q: 24,
    R: 25,
    S: 26,
    T: 27,
    U: 28,
    V: 29,
    W: 32,
    X: 30,
    Y: 31,
    Z: 33,
  }

  const firstLetter = id.charAt(0)
  const letterValue = letterValues[firstLetter]
  if (!letterValue) return false

  const digits = id.slice(1).split('').map(Number)
  const weights = [9, 8, 7, 6, 5, 4, 3, 2, 1, 1]

  let sum = Math.floor(letterValue / 10) + (letterValue % 10) * 9
  for (let i = 0; i < digits.length; i++) {
    sum += digits[i] * weights[i]
  }

  return sum % 10 === 0
}
