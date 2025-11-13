import { NextResponse } from 'next/server'

import { ORDER_STATE } from '@/constants'
import {
  getOrdersForUpload,
  OrderRecordForUploadQuery,
} from '@/graphql/queries/orders'
import { ApiResponse } from '@/types'
import { getClient } from '@/utils/apollo-client'
import { getCurrentUser } from '@/utils/auth'
import { createErrorLogger } from '@/utils/error-handler'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser?.memberId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Unauthorized or missing memberId.' },
        { status: 401 }
      )
    }

    const client = getClient()
    const { data, errors } = await client.query<{
      orders: OrderRecordForUploadQuery[]
    }>({
      query: getOrdersForUpload,
      variables: {
        where: {
          member: { id: { equals: currentUser.memberId } },
          needsModification: { equals: false },
          OR: [
            { state: { equals: ORDER_STATE.PENDING_UPLOAD } },
            { state: { equals: ORDER_STATE.PENDING_QUOTE_CONFIRMATION } },
          ],
        },
        orderBy: [{ state: 'desc' }],
      },
      errorPolicy: 'all',
    })

    // Handle any GraphQL errors
    if (errors?.length) {
      const message = errors.map((e) => e.message).join(', ')
      createErrorLogger('GraphQL errors while fetching upload/reupload orders')(
        new Error(message)
      )
      return NextResponse.json<ApiResponse>(
        { success: false, message },
        { status: 500 }
      )
    }

    // Handle case where no orders are found
    if (!data.orders || data.orders.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: 'No uploaded or re-uploaded orders found for this member.',
          data: [],
        },
        { status: 200 }
      )
    }

    return NextResponse.json<ApiResponse<OrderRecordForUploadQuery[]>>({
      success: true,
      message: 'Uploaded/re-uploaded orders fetched successfully.',
      data: data.orders,
    })
  } catch (error) {
    createErrorLogger('Failed to fetch uploaded or re-uploaded orders')(error)

    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
