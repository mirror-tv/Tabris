import { sendEmail, EmailPayload } from './mail-sender'

export async function sendTransferEmail(
    receiver: string[],
    originalOrderNumber: string,
    newOrderNumber: string,
    newOrderName: string,
    memberName: string,
) {
    const subject = `【鏡新聞個人廣告系統】訂單 ${originalOrderNumber} 已轉移至新訂單 ${newOrderNumber}`
    const body = `
<h2>訂單 ${originalOrderNumber} 已轉移至新訂單 ${newOrderNumber}</h2>

親愛的 ${memberName}，您好：
您的訂單修改需求系統已收到，新訂單編號：${newOrderNumber}。


- 訂單編號：${newOrderNumber}
- 廣告名稱：${newOrderName}

此為系統自動通知信件，請勿回覆此郵件，如需要聯繫客服，請寫信至 mnews_sales@mnews.tw

鏡電視廣告團隊
    `
    await sendEmail({ receiver, subject, body } as EmailPayload, 'transfer')
}