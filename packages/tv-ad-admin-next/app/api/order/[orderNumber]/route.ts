import { NextResponse } from 'next/server'

import { getOrdersByOrderNumberQuery } from '@/graphql/queries/orders'
import { type OrderRecordForOrderNumber } from '@/graphql/queries/orders'
import { getClient } from '@/utils/apollo-client'
import { getCurrentUser } from '@/utils/auth'
import { formatTaiwanDate } from '@/utils/date'
import { createErrorLogger } from '@/utils/error-handler'

export async function GET(
  _req: Request,
  { params }: { params: { orderNumber: string } }
) {
  const { orderNumber } = params
  const user = await getCurrentUser()

  if (!user || !user.memberId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
        where: {
          orderNumber: {
            equals: orderNumber,
          },
          member: {
            id: {
              equals: user.memberId,
            },
          },
        },
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
