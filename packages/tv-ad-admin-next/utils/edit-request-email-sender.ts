import { GoogleAuth } from 'google-auth-library'

//TODO: 小米，請你看後續如何調整~ 

type EditRequestEmailPayload = {
  receiver: string[]
  subject: string
  body: string
}

async function sendEmail(payload: EditRequestEmailPayload, category: string) {
  const emailApiUrl = process.env.EMAIL_API_URL as string
  try {
    const auth = new GoogleAuth()
    const client = await auth.getIdTokenClient(emailApiUrl)

    await client.request({
      url: emailApiUrl,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: payload,
      timeout: 10000,
    })
  } catch (error) {
    console.error(`Error sending ${category} email:`, {
      error: error instanceof Error ? error.message : String(error),
      receiver: payload.receiver,
    })
  }
}

export async function sendOrderEditRequestEmail(
  receiverEmails: string[],
  orderNumber: string,
  reason: string,
  details: string
) {
  const subject = `鏡電視個人廣告系統 - 訂單修改請求 (${orderNumber})`

  const body = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="margin-top: 0;">訂單修改請求通知</h2>
  <p>以下訂單已收到使用者的修改請求：</p>
  <p><strong>訂單編號：</strong> ${orderNumber}</p>
  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
  <p><strong>修改原因：</strong></p>
  <p style="white-space: pre-wrap;">${reason}</p>
  <p><strong>修改詳情：</strong></p>
  <p style="white-space: pre-wrap;">${details}</p>
  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
  <p style="font-size: 12px; color: #999;">
    此為系統自動發送通知信，請勿直接回覆。
  </p>
</body>
</html>
  `.trim()

  await sendEmail(
    { receiver: receiverEmails, subject, body },
    'order-edit-request'
  )
}
