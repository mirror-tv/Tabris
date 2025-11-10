/**
 * Email OTP 發送工具
 * 使用 SendGrid 發送自定義 OTP 驗證碼到用戶信箱
 */

import sgMail from '@sendgrid/mail'

type SendEmailOTPResult = {
  success: boolean
  message: string
}

/**
 * 發送 OTP 驗證碼到指定信箱
 * 使用 SendGrid 發送自定義郵件
 */
export async function sendEmailOTP(
  email: string,
  otp: string
): Promise<SendEmailOTPResult> {
  try {
    const sendGridApiKey = process.env.SENDGRID_API_KEY
    const sendGridFromEmail =
      process.env.SENDGRID_FROM_EMAIL || 'noreply@mnews.tw'

    // 開發環境：如果未配置 SendGrid，只記錄日誌
    if (process.env.NODE_ENV === 'development' && !sendGridApiKey) {
      // eslint-disable-next-line no-console
      console.log(
        `%c[Email OTP] 開發環境：未配置 SendGrid，跳過實際發送`,
        'color: #f59e0b; font-weight: bold;'
      )
      // eslint-disable-next-line no-console
      console.log(
        `%c[Email OTP] 收件人: ${email}\n驗證碼: ${otp}`,
        'color: #3b82f6;'
      )
      return {
        success: true,
        message: '開發環境：未配置 SendGrid，已記錄日誌',
      }
    }

    // 生產環境：必須配置 SendGrid
    if (!sendGridApiKey) {
      // eslint-disable-next-line no-console
      console.error('[Email OTP] SendGrid API Key 未配置')
      return {
        success: false,
        message: 'SendGrid API Key 未配置，無法發送郵件',
      }
    }

    // 設置 SendGrid API Key
    sgMail.setApiKey(sendGridApiKey)

    // 郵件內容
    const msg = {
      to: email,
      from: sendGridFromEmail,
      subject: '鏡新聞個人廣告系統 - 驗證碼',
      html: `
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
      `,
      text: `鏡新聞個人廣告系統\n\n您的驗證碼：${otp}\n\n此驗證碼將在 5 分鐘後過期。\n\n如果您沒有請求此驗證碼，請忽略此郵件。`,
    }

    // 發送郵件
    await sgMail.send(msg)

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('[Email OTP] 發送成功:', {
        to: email,
        via: 'SendGrid',
      })
    }

    return {
      success: true,
      message: '郵件發送成功',
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Email OTP] 發送失敗:', error)
    const errorMessage = error instanceof Error ? error.message : '郵件發送失敗'
    return {
      success: false,
      message: errorMessage,
    }
  }
}
