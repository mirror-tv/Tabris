import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUser } from '@/utils/auth'
import { sendOrderEditRequestEmail } from '@/utils/edit-request-email-sender'

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { orderNumber, reason, details } = await req.json()

    if (!orderNumber || !reason || !details) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Decide recipients
    const recipients = [currentUser.email]

    //TODO: 小米
    // 1. 目前只有寄信給使用者，未寄信給業務。
    // 2. 應該要有根據寄信成功/失敗來顯示狀態或是避免下一個 API fetch CMS state 切換，目前寄信 API 的錯誤判別可能不夠完整
    await sendOrderEditRequestEmail(recipients, orderNumber, reason, details)

    return NextResponse.json({
      success: true,
      message: 'Edit request email sent',
    })
  } catch (err) {
    console.error('edit-request-email error:', err)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
