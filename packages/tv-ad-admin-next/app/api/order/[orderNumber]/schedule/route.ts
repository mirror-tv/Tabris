import { parseISO } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'

import { updateOrderScheduleMutation } from '@/graphql/mutations/orders'
import { getClient } from '@/utils/apollo-client'
import { getCurrentUser } from '@/utils/auth'
import { createErrorLogger } from '@/utils/error-handler'

export async function POST(
  request: NextRequest,
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
    const body = await request.json()
    const { scheduleStartDate, scheduleEndDate } = body

    if (!scheduleStartDate || !scheduleEndDate) {
      return NextResponse.json(
        { error: 'Schedule start date and end date are required' },
        { status: 400 }
      )
    }

    const client = getClient()
    const { data, errors } = await client.mutate({
      mutation: updateOrderScheduleMutation,
      variables: {
        where: {
          orderNumber: orderNumber,
          member: {
            id: {
              equals: user.memberId,
            },
          },
        },
        data: {
          scheduleStartDate: parseISO(scheduleStartDate),
          scheduleEndDate: parseISO(scheduleEndDate),
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

    return NextResponse.json({
      success: true,
      order: data?.updateOrder,
    })
  } catch (error) {
    createErrorLogger(`Failed to update order schedule: ${orderNumber}`)(error)

    return NextResponse.json(
      { error: `Failed to update order schedule: ${orderNumber}` },
      { status: 500 }
    )
  }
}
