import { NextRequest, NextResponse } from 'next/server'

import { ORDER_STATE } from '@/constants'
import { updateOrderStateMutation } from '@/graphql/mutations/orders'
import { getClient } from '@/utils/apollo-client'
import { createErrorLogger } from '@/utils/error-handler'

export async function POST(
  request: NextRequest,
  { params }: { params: { orderNumber?: string } }
) {
  const { orderNumber } = params ?? {}

  if (!orderNumber) {
    return NextResponse.json(
      { error: 'Order number is required' },
      { status: 400 }
    )
  }

  try {
    const client = getClient()
    const { data, errors } = await client.mutate({
      mutation: updateOrderStateMutation,
      variables: {
        where: {
          orderNumber: orderNumber,
        },
        data: {
          state: ORDER_STATE.PENDING_SCHEDULE,
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
