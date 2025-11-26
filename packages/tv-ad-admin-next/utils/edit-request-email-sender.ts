import { sendEmail, EmailPayload } from './mail-sender'

export async function sendOrderEditRequestEmailToUser(
  userEmail: string,
  orderNumber: string,
  reason: string,
  details: string
) {
  const subject = `鏡電視個人廣告系統 - 訂單修改請求已送出 (${orderNumber})`

  const body = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="margin-top: 0;">訂單修改請求已送出</h2>
  <p>您好，</p>
  <p>您的訂單修改請求已成功送出，業務人員將會儘快與您聯繫。</p>
  <p><strong>訂單編號：</strong> ${orderNumber}</p>
  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
  <p><strong>您提出的修改原因：</strong></p>
  <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${reason}</p>
  <p><strong>您提出的修改詳情：</strong></p>
  <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${details}</p>
  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
  <p><strong>後續流程：</strong></p>
  <ul style="color: #666;">
    <li>業務人員會根據修改複雜度重新評估報價</li>
    <li>修改確認後，需重新安排排播時間</li>
    <li>原始排播日期將會作廢</li>
  </ul>
  <p>如有任何問題，請隨時與我們聯繫。</p>
  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
  <p style="font-size: 12px; color: #999;">
    此為系統自動發送通知信，請勿直接回覆。
  </p>
</body>
</html>
  `.trim()

  await sendEmail(
    { receiver: [userEmail], subject, body } as EmailPayload,
    'order-edit-request-to-user'
  )
}

export async function sendOrderEditRequestEmailToSales(
  salesEmails: string[],
  orderNumber: string,
  reason: string,
  details: string,
  userEmail: string
) {
  const subject = `鏡電視個人廣告系統 - 訂單修改請求 ${orderNumber}`

  const body = `
    <h2>${subject}</h2>
      <p>您好，</p>
      <p>已收到 ${orderNumber} 的訂單修改請求，請儘速聯繫 ${userEmail} 處理。</p>
      <ul>
        <li><strong>修改原因：</strong>${reason}</li>
        <li><strong>修改詳情：</strong>${details}</li>
      </ul>
      <p>此為系統自動通知信件。</p>
      <br>
      <p>鏡電視廣告系統</p>
  `.trim()

  await sendEmail(
    { receiver: salesEmails, subject, body },
    'order-edit-request-to-sales'
  )
}
