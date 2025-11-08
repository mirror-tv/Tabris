import { NextRequest, NextResponse } from 'next/server'

import { ORDER_STATE } from '@/constants/state/orderState'
import { getOrderForEditQuery } from '@/graphql/queries/orders'
import { getClient } from '@/utils/apollo-client'
import { getCurrentUser } from '@/utils/auth'
import { createErrorLogger } from '@/utils/error-handler'

export async function GET(
  _req: NextRequest,
  { params }: { params: { orderNumber?: string } }
) {
  const { orderNumber } = params ?? {}
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
    const { data, errors } = await client.query({
      query: getOrderForEditQuery,
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
          state: {
            equals: ORDER_STATE.PENDING_CONFIRMATION,
          },
        },
      },
      errorPolicy: 'all',
    })

    if (errors && errors.length > 0) {
      const errorMessage = errors
        .map((e: { message: string }) => e.message)
        .join(', ')
      createErrorLogger(`Failed to get edit request data: ${orderNumber}`)(
        new Error(`GraphQL errors: ${errorMessage}`)
      )

      return NextResponse.json(
        { error: `Failed to get edit request data: ${errorMessage}` },
        { status: 500 }
      )
    }

    const order = data?.orders?.[0]

    // 如果查詢不到訂單，表示訂單不存在或狀態不符合
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 200 }
    )
  } catch (error) {
    createErrorLogger(`Failed to get edit request data: ${orderNumber}`)(error)

    return NextResponse.json(
      { error: `Failed to get edit request data: ${orderNumber}` },
      { status: 500 }
    )
  }
}
