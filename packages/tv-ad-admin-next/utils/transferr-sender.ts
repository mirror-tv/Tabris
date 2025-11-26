import { sendEmail, EmailPayload } from './mail-sender'

type TransferEmailTemplate = 'user' | 'sales'

type TransferEmailParams = {
  originalOrderNumber: string
  newOrderNumber: string
  newOrderName: string
  memberName: string
}

async function sendTransferEmailWithTemplate(
  receiver: string[],
  params: TransferEmailParams,
  template: TransferEmailTemplate
) {
  const { originalOrderNumber, newOrderNumber, newOrderName, memberName } =
    params

  let subject: string
  let body: string

  if (template === 'user') {
    subject = `【鏡新聞個人廣告系統】訂單${originalOrderNumber}已轉移至新訂單${newOrderNumber}`
    body = `
<h2>訂單${originalOrderNumber}已轉移至新訂單${newOrderNumber}</h2>

親愛的 ${memberName}，您好：
您的訂單修改需求系統已收到，新訂單編號：${newOrderNumber}。


- 訂單編號：${newOrderNumber}
- 廣告名稱：${newOrderName}

此為系統自動通知信件，請勿回覆此郵件，如需要聯繫客服，請寫信至 mnews_sales@mnews.tw

鏡電視廣告團隊
    `
  } else {
    subject = `訂單${originalOrderNumber}已轉移至新訂單${newOrderNumber}`
    body = `
<h2>用戶已完成訂單關聯，並重新上傳需修改素材</h2>

您好，
用戶已完成需修改素材上傳，請盡快至CMS確認素材。


- 訂單編號：${newOrderNumber}
- 廣告名稱：${newOrderName}
- 會員：${memberName}

此為系統自動通知信件，請勿回覆此郵件。

鏡電視廣告系統
    `
  }

  await sendEmail(
    { receiver, subject, body } as EmailPayload,
    template === 'user' ? 'transfer-user' : 'transfer-sales'
  )
}

export async function sendTransferEmailToUser(
  receiver: string[],
  originalOrderNumber: string,
  newOrderNumber: string,
  newOrderName: string,
  memberName: string
) {
  await sendTransferEmailWithTemplate(
    receiver,
    { originalOrderNumber, newOrderNumber, newOrderName, memberName },
    'user'
  )
}

export async function sendTransferEmailToSales(
  originalOrderNumber: string,
  newOrderNumber: string,
  newOrderName: string,
  memberName: string
) {
  const salesTeamEmail = process.env.SALES_TEAM_EMAIL
  if (!salesTeamEmail) {
    return
  }

  const salesEmails = salesTeamEmail
    .split(',')
    .map((email) => email.trim())
    .filter((email) => email.length > 0)

  if (salesEmails.length === 0) {
    return
  }

  await sendTransferEmailWithTemplate(
    salesEmails,
    { originalOrderNumber, newOrderNumber, newOrderName, memberName },
    'sales'
  )
}