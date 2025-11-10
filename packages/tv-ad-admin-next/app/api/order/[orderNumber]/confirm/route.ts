import { NextRequest, NextResponse } from 'next/server'

import { getNextState, type OrderState } from '@/constants'
import { updateOrderStateMutation } from '@/graphql/mutations/orders'
import { getOrdersByOrderNumberQuery } from '@/graphql/queries/orders'
import { getClient } from '@/utils/apollo-client'
import { getCurrentUser } from '@/utils/auth'
import { createErrorLogger } from '@/utils/error-handler'

export async function POST(
  request: NextRequest,
  { params }: { params: { orderNumber?: string } }
) {
  const { orderNumber } = params ?? {}
  const user = await getCurrentUser()
  if (!user || !user.userId || !user.memberId) {
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

    // 先獲取當前訂單狀態
    const { data: orderData } = await client.query({
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

    const currentOrder = orderData?.orders?.[0]
    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // 根據 flow 獲取下一個狀態
    const nextState = getNextState(currentOrder.state as OrderState)
    if (!nextState) {
      return NextResponse.json(
        { error: 'Cannot determine next state for current order state' },
        { status: 400 }
      )
    }

    const { data, errors } = await client.mutate({
      mutation: updateOrderStateMutation,
      variables: {
        where: {
          orderNumber: orderNumber,
        },
        data: {
          state: nextState,
          member: {
            id: {
              equals: user.memberId,
            },
          },
        },
      },
      errorPolicy: 'all',
    })

    if (errors && errors.length > 0) {
      const errorMessage = errors
        .map((e: { message: string }) => e.message)
        .join(', ')
      createErrorLogger(`Failed to confirm order: ${orderNumber}`)(
        new Error(`GraphQL errors: ${errorMessage}`)
      )

      return NextResponse.json(
        { error: `Failed to confirm order: ${errorMessage}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      order: data?.updateOrder,
    })
  } catch (error) {
    createErrorLogger(`Failed to confirm order: ${orderNumber}`)(error)

    return NextResponse.json(
      { error: `Failed to confirm order: ${orderNumber}` },
      { status: 500 }
    )
  }
}
