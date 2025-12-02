import { parseISO } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'

import { getNextState, ORDER_STATE } from '@/constants/state/orderState'
import { updateOrderScheduleMutation } from '@/graphql/mutations/orders'
import { getOrderForEditQuery } from '@/graphql/queries/orders'
import { getClient } from '@/utils/apollo-client'
import { getCurrentUser } from '@/utils/auth'
import { formatTaiwanDate } from '@/utils/date'
import { createErrorLogger } from '@/utils/error-handler'

export async function GET(
  _req: NextRequest,
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
            equals: ORDER_STATE.PENDING_BROADCAST_DATE,
          },
        },
      },
      errorPolicy: 'all',
    })

    if (errors && errors.length > 0) {
      const errorMessage = errors
        .map((e: { message: string }) => e.message)
        .join(', ')
      createErrorLogger(`Failed to get order schedule: ${orderNumber}`)(
        new Error(`GraphQL errors: ${errorMessage}`)
      )

      return NextResponse.json(
        { error: `Failed to get order schedule: ${errorMessage}` },
        { status: 500 }
      )
    }

    const order = data?.orders?.[0]

    // 如果查詢不到訂單，表示訂單不存在或狀態不符合
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // 格式化日期字符串，與其他 API 保持一致
    const formattedOrder = {
      ...order,
      scheduleStartDateString: formatTaiwanDate(order.scheduleStartDate),
      scheduleEndDateString: formatTaiwanDate(order.scheduleEndDate),
    }

    return NextResponse.json({
      success: true,
      order: formattedOrder,
    })
  } catch (error) {
    createErrorLogger(`Failed to get order schedule: ${orderNumber}`)(error)

    return NextResponse.json(
      { error: `Failed to get order schedule: ${orderNumber}` },
      { status: 500 }
    )
  }
}

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
    const body = await request.json()
    const { scheduleStartDate, scheduleEndDate } = body

    if (!scheduleStartDate || !scheduleEndDate) {
      return NextResponse.json(
        { error: 'Schedule start date and end date are required' },
        { status: 400 }
      )
    }

    const client = getClient()

    // 先獲取當前訂單狀態（已在 where 條件中確認是 PENDING_BROADCAST_DATE）
    // 根據 flow 獲取下一個狀態
    const nextState = getNextState(ORDER_STATE.PENDING_BROADCAST_DATE)
    if (!nextState) {
      return NextResponse.json(
        { error: 'Cannot determine next state for current order state' },
        { status: 400 }
      )
    }

    const { data, errors } = await client.mutate({
      mutation: updateOrderScheduleMutation,
      variables: {
        where: {
          orderNumber,
        },
        data: {
          scheduleStartDate: parseISO(scheduleStartDate),
          scheduleEndDate: parseISO(scheduleEndDate),
          state: nextState,
        },
      },
      errorPolicy: 'all',
    })

    if (errors && errors.length > 0) {
      const errorMessage = errors
        .map((e: { message: string }) => e.message)
        .join(', ')
      createErrorLogger(`Failed to update order schedule: ${orderNumber}`)(
        new Error(`GraphQL errors: ${errorMessage}`)
      )

      return NextResponse.json(
        { error: `Failed to update order schedule: ${errorMessage}` },
        { status: 500 }
      )
    }

    // 如果沒有更新到訂單，表示訂單不存在或狀態不符合
    if (!data?.updateOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      order: data.updateOrder,
    })
  } catch (error) {
    createErrorLogger(`Failed to update order schedule: ${orderNumber}`)(error)

    return NextResponse.json(
      { error: `Failed to update order schedule: ${orderNumber}` },
      { status: 500 }
    )
  }
}
