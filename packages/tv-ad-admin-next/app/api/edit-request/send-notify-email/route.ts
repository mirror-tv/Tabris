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
