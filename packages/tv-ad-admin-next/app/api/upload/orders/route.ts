import { NextResponse } from 'next/server'

import { ORDER_STATE } from '@/constants'
import {
  getOrdersForUpload,
  OrderRecordForUpload,
} from '@/graphql/queries/orders'
import { getClient } from '@/utils/apollo-client'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const memberId = url.searchParams.get('memberId')

  if (!memberId) {
    return NextResponse.json(
      { error: 'Missing memberId. Please provide a valid member identifier.' },
      { status: 400 }
    )
  }

  try {
    const client = getClient()
    const { data } = await client.query<{ orders: OrderRecordForUpload[] }>({
      query: getOrdersForUpload,
      variables: {
        where: {
          member: { id: { equals: memberId } },
          OR: [
            { state: { equals: ORDER_STATE.PENDING_UPLOAD } },
            { state: { equals: ORDER_STATE.PENDING_QUOTE_CONFIRMATION } },
          ],
        },
        orderBy: [{ updatedAt: 'desc' }],
      },
    })

    // Optional: handle case where no orders are found
    if (!data.orders || data.orders.length === 0) {
      return NextResponse.json(
        { error: 'No orders found for the given member.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ orders: data.orders })
  } catch (error) {
    console.error('Failed to fetch upload orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upload orders.' },
      { status: 500 }
    )
  }
}
