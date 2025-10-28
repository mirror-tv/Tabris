import { NextResponse } from 'next/server'

import { getOrdersQuery } from '@/graphql/queries/orders'
import { type OrderRecordForDashboard } from '@/types/order'
import { getClient } from '@/utils/apollo-client'
import { createErrorLogger } from '@/utils/error-handler'

export async function GET() {
  try {
    const client = getClient()
    const { data } = await client.query<{ orders: OrderRecordForDashboard[] }>({
      query: getOrdersQuery,
      variables: {
        where: {},
        orderBy: [{ updatedAt: 'desc' }],
      },
    })

    const orders = data?.orders || []

    return NextResponse.json({ orders })
  } catch (error) {
    createErrorLogger('Failed to fetch dashboard stats')(error)

    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
