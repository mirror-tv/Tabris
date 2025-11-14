import { NextRequest, NextResponse } from 'next/server'

import { getNextState, ORDER_STATE } from '@/constants/state/orderState'
import { updateOrderEditRequestMutation } from '@/graphql/mutations/orders'
import { getClient } from '@/utils/apollo-client'
import { getCurrentUser } from '@/utils/auth'
import { createErrorLogger } from '@/utils/error-handler'

export async function POST(request: NextRequest) {
  const client = getClient()

  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || !currentUser.userId || !currentUser.memberId) {
      return NextResponse.json(
        { error: 'Unauthorized or missing memberId.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { state: currentState, orderNumber } = body

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      )
    }

    if (!currentState) {
      return NextResponse.json(
        { error: 'Current state is required' },
        { status: 400 }
      )
    }

    if (currentState !== ORDER_STATE.PENDING_CONFIRMATION) {
      return NextResponse.json(
        { error: 'Invalid state for edit request' },
        { status: 400 }
      )
    }

    const nextState = getNextState(currentState)
    if (!nextState) {
      return NextResponse.json(
        { error: 'No next state for current state' },
        { status: 400 }
      )
    }

    const { data, errors } = await client.mutate({
      mutation: updateOrderEditRequestMutation,
      variables: {
        where: {
          orderNumber,
        },
        data: { state: nextState },
      },
      errorPolicy: 'all',
    })

    if (errors?.length) {
      const errorMsg = errors.map((e) => e.message).join(', ')
      createErrorLogger(`Failed to submit edit request: ${orderNumber}`)(
        new Error(`GraphQL errors: ${errorMsg}`)
      )
      return NextResponse.json(
        { error: `Failed to submit edit request: ${errorMsg}` },
        { status: 500 }
      )
    }

    if (!data?.updateOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'edit-request order fetched successfully.',
      data: data.updateOrder,
    })
  } catch (err) {
    createErrorLogger('Unexpected POST error in edit-request route')(err)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
