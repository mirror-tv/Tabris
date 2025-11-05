import { NextResponse } from 'next/server'

import { ORDER_STATE } from '@/constants'
import {
  getOrdersForUpload,
  OrderRecordForUploadQuery,
} from '@/graphql/queries/orders'
import { getClient } from '@/utils/apollo-client'
import { getCurrentUser } from '@/utils/auth'
import { createErrorLogger } from '@/utils/error-handler'

export async function GET() {

  try {
    const currentUser = await getCurrentUser()

    if (!currentUser?.memberId) {
      return NextResponse.json(
        { error: 'Unauthorized or missing memberId.' },
        { status: 401 }
      )
    }

    const client = getClient()
    const { data } = await client.query<{
      orders: OrderRecordForUploadQuery[]
    }>({
      query: getOrdersForUpload,
      variables: {
        where: {
          member: { id: { equals: currentUser.memberId } },
          OR: [
            { state: { equals: ORDER_STATE.PENDING_UPLOAD } },
            { state: { equals: ORDER_STATE.PENDING_QUOTE_CONFIRMATION } },
          ],
        },
        orderBy: [{ state: 'desc' }],
      },
    })

    // Optional: handle case where no orders are found
    if (!data.orders || data.orders.length === 0) {
      return NextResponse.json(
        { error: 'No orders found for this member.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ orders: data.orders })
  } catch (error) {
    createErrorLogger('Failed to fetch upload orders')(
      error
    )

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
