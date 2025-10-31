import { NextResponse } from 'next/server'

import { getOrdersByOrderNumberQuery } from '@/graphql/queries/orders'
import { type OrderRecordForOrderNumber } from '@/graphql/queries/orders'
import { getClient } from '@/utils/apollo-client'
import { formatTaiwanDate } from '@/utils/date'
import { createErrorLogger } from '@/utils/error-handler'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderNumber = searchParams.get('orderNumber')

  if (!orderNumber) {
    return NextResponse.json(
      { error: 'Order number is required' },
      { status: 400 }
    )
  }

  try {
    const client = getClient()
    const { data } = await client.query<{
      orders: OrderRecordForOrderNumber[]
    }>({
      query: getOrdersByOrderNumberQuery,
      variables: {
        orderNumber: orderNumber,
      },
    })

    const orders = data?.orders || []
    const formattedOrders = orders.map((order) => ({
      ...order,
      scheduleStartDateString: formatTaiwanDate(order.scheduleStartDate),
      scheduleEndDateString: formatTaiwanDate(order.scheduleEndDate),
    }))

    return NextResponse.json({ orders: formattedOrders })
  } catch (error) {
    createErrorLogger(`Failed to fetch orders by order number: ${orderNumber}`)(
      error
    )

    return NextResponse.json(
      { error: `Failed to fetch orders by order number: ${orderNumber}` },
      { status: 500 }
    )
  }
}
