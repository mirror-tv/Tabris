/**
 * API Response 類型定義
 */

// 基礎 API Response
export type ApiResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
}

// 錯誤 Response
export type ApiError = {
  success: false
  message: string
  error?: string
  statusCode?: number
}

// 發送 OTP Response
export type SendOtpResponse = ApiResponse<{
  expiresIn: number // 過期時間（秒）
  otp?: string // 開發環境才有
}>

// 驗證 OTP Response
export type VerifyOtpResponse = ApiResponse<{
  user: {
    userId: string
    email?: string
    phone?: string
  }
  token?: string // 如果需要在 Response Body 中返回
}>

// 取得當前用戶 Response
export type GetMeResponse = ApiResponse<{
  user: {
    userId: string
    email?: string
    phone?: string
  }
}>

// 登出 Response
export type LogoutResponse = ApiResponse

// 會員檢查 Response
export type MemberCheckResponse = {
  exists: boolean
  message?: string
}

// Rate Limiting Response
export type RateLimitResponse = {
  success: false
  message: string
  retryAfter?: number // 秒數
  limit?: number
  remaining?: number
}

// 登入類型
export type LoginType = 'email' | 'phone'

// 登入請求
export type LoginRequest = {
  type: LoginType
  email?: string
  phone?: string
}

// OTP 驗證請求
export type VerifyOtpRequest = {
  type: LoginType
  email?: string
  phone?: string
  otp: string
}
