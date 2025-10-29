import { NextResponse } from 'next/server'

import { getOrdersQuery } from '@/graphql/queries/orders'
import { type OrderRecordForList } from '@/types/order'
import { getClient } from '@/utils/apollo-client'
import { createErrorLogger } from '@/utils/error-handler'

export async function GET() {
  try {
    const client = getClient()
    const { data } = await client.query<{ orders: OrderRecordForList[] }>({
      query: getOrdersQuery,
      variables: {
        where: {},
        orderBy: [{ updatedAt: 'desc' }],
      },
    })

    const orders = data?.orders || []

    return NextResponse.json({ orders })
  } catch (error) {
    createErrorLogger('Failed to fetch orders list')(error)

    return NextResponse.json(
      { error: 'Failed to fetch orders list' },
      { status: 500 }
    )
  }
}
