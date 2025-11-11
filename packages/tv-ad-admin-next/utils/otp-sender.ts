/**
 * Email OTP 發送工具
 * 發送 OTP 驗證碼
 */

import { GoogleAuth } from 'google-auth-library'

import { AUTH_MESSAGES } from '@/constants/messages'

type SendEmailOTPResult = {
  success: boolean
  message: string
}

type EmailPayload = {
  receiver: string[]
  subject: string
  body: string
}

async function sendEmail(
  emailPayload: EmailPayload,
  recipientType: string
) {
  const emailApiUrl = process.env.EMAIL_API_URL as string

  try {
    const auth = new GoogleAuth()
    const client = await auth.getIdTokenClient(emailApiUrl)

    await client.request({
      url: emailApiUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: emailPayload,
      timeout: 10000,
    })
  } catch (error) {
    console.error(`Error sending email to ${recipientType}:`, {
      error: error instanceof Error ? error.message : String(error),
      receiver: emailPayload.receiver,
    })
  }
}

/**
 * 發送 OTP 驗證碼到指定信箱
 * 使用呼叫內部 Email API
 */
export async function sendEmailOTP(
  email: string,
  otp: string
): Promise<SendEmailOTPResult> {
  try {
    const emailPayload: EmailPayload = {
      receiver: [email],
      subject: '鏡新聞個人廣告系統 - 驗證碼',
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; margin: 20px 0;">
    <h2 style="color: #1a1a1a; margin-top: 0;">鏡新聞個人廣告系統</h2>
    <p style="color: #666; margin-bottom: 20px;">您的驗證碼如下：</p>
    <div style="background-color: #ffffff; border: 2px solid #e0e0e0; border-radius: 6px; padding: 20px; text-align: center; margin: 20px 0;">
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1a1a1a; margin: 0;">${otp}</p>
    </div>
    <p style="color: #666; font-size: 14px; margin-top: 20px;">此驗證碼將在 5 分鐘後過期。</p>
    <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
      如果您沒有請求此驗證碼，請忽略此郵件。
    </p>
  </div>
</body>
</html>
      `.trim(),
    }

    await sendEmail(emailPayload, 'email')

    return {
      success: true,
      message: AUTH_MESSAGES.OTP_SENT
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Email OTP] 發送失敗:', {
      error: error instanceof Error ? error.message : String(error),
      receiver: email,
    })

    const errorMessage = error instanceof Error ? error.message : '郵件發送失敗'
    return {
      success: false,
      message: errorMessage,
    }
  }
}
