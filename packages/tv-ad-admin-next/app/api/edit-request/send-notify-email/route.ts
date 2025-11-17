import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUser } from '@/utils/auth'
import {
  sendOrderEditRequestEmailToSales,
  sendOrderEditRequestEmailToUser,
} from '@/utils/edit-request-email-sender'

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

    await sendOrderEditRequestEmailToUser(
      currentUser.email,
      orderNumber,
      reason,
      details
    )

    const salesTeamEmail = process.env.SALES_TEAM_EMAIL
    if (salesTeamEmail) {
      const salesEmails = salesTeamEmail
        .split(',')
        .map((email) => email.trim())
        .filter((email) => email.length > 0)

      if (salesEmails.length > 0) {
        await sendOrderEditRequestEmailToSales(
          salesEmails,
          orderNumber,
          reason,
          details,
          currentUser.email
        )
      }
    }

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
