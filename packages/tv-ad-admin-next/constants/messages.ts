/**
 * 統一錯誤訊息管理
 */

export const AUTH_MESSAGES = {
  // 成功訊息
  OTP_SENT: '驗證碼已發送',
  OTP_SENT_DEV: '驗證碼已發送',
  LOGIN_SUCCESS: '登入成功',
  LOGOUT_SUCCESS: '登出成功',

  // 驗證錯誤
  EMAIL_REQUIRED: '請輸入電子信箱',
  EMAIL_INVALID: '請輸入有效的電子信箱格式',
  OTP_REQUIRED: '請輸入驗證碼',
  OTP_INVALID: '驗證碼必須為 6 位數字',

  // OTP 錯誤
  OTP_NOT_FOUND: '驗證碼不存在或已過期',
  OTP_EXPIRED: '驗證碼已過期',
  OTP_INCORRECT: '驗證碼錯誤，請重新輸入',
  OTP_TOO_MANY_ATTEMPTS: '驗證失敗次數過多，請重新發送驗證碼',
  OTP_ATTEMPTS_EXCEEDED: '驗證嘗試次數已達上限',

  // 會員驗證錯誤
  MEMBER_NOT_FOUND_EMAIL: '請輸入您註冊應援科技使用的電子信箱',
  MEMBER_INACTIVE: '此帳號未啟用，請聯絡客服',

  // 系統錯誤
  SEND_OTP_FAILED: '發送驗證碼失敗，請稍後再試',
  VERIFY_OTP_FAILED: '驗證失敗，請稍後再試',
  RESEND_OTP_FAILED: '重新發送失敗，請稍後再試',
  SERVER_ERROR: '系統錯誤，請稍後再試',
  NETWORK_ERROR: '網路連線失敗，請檢查您的網路',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: '操作過於頻繁，請稍後再試',
  TOO_MANY_REQUESTS: '請求次數過多，請 {seconds} 秒後再試',

  // 參數錯誤
  INVALID_REQUEST: '請求參數錯誤',
  MISSING_IDENTIFIER: '請提供電子信箱',

  // Token 錯誤
  TOKEN_INVALID: 'Token 無效或已過期',
  TOKEN_EXPIRED: '登入已過期，請重新登入',
  UNAUTHORIZED: '未登入',
} as const

export const LOADING_MESSAGES = {
  CHECKING_MEMBER: '正在檢查會員資料',
  SENDING_OTP: '發送驗證碼中',
} as const

/**
 * 格式化帶參數的訊息
 */
export function formatMessage(
  template: string,
  params: Record<string, string | number>
): string {
  let result = template
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`{${key}}`, String(value))
  })
  return result
}
