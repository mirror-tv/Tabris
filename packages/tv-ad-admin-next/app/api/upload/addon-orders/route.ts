import { NextRequest, NextResponse } from 'next/server'

import { getAddonOrdersQuery, AddonOrderQuery } from '@/graphql/queries/addon-orders'
import { ApiResponse } from '@/types'
import { getClient } from '@/utils/apollo-client'
import { getCurrentUser } from '@/utils/auth'
import { createErrorLogger } from '@/utils/error-handler'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser?.memberId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Unauthorized or missing memberId.' },
        { status: 401 }
      )
    }

    const searchParams = req.nextUrl.searchParams
    const isUrgent = searchParams.get('isUrgent') === 'true'
    const originalOrderId = searchParams.get('originalOrderId')

    if (!originalOrderId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Missing originalOrderId parameter.' },
        { status: 400 }
      )
    }

    const client = getClient()

    const { data: originalOrderData, errors: originalOrderErrors } =
      await client.query({
        query: getAddonOrdersQuery,
        variables: {
          where: {
            id: { equals: originalOrderId },
            member: { id: { equals: currentUser.memberId } },
          },
        },
        fetchPolicy: 'no-cache',
      })

    if (originalOrderErrors?.length) {
      const message = originalOrderErrors.map((e) => e.message).join(', ')
      createErrorLogger('Failed to fetch original order')(new Error(message))
      return NextResponse.json<ApiResponse>(
        { success: false, message },
        { status: 500 }
      )
    }

    const originalOrder = originalOrderData?.orders?.[0]
    if (!originalOrder) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Original order not found.' },
        { status: 404 }
      )
    }

    type OrderWhereConditions = {
      member: { id: { equals: string } }
      needsModification: { equals: boolean }
      isUrgent: { equals: boolean }
      parentOrder: null
      OR?: Array<{ price: { equals: number } }>
    }

    const whereConditions: OrderWhereConditions = {
      member: { id: { equals: currentUser.memberId } },
      needsModification: { equals: true },
      isUrgent: { equals: isUrgent },
      parentOrder: null,
    }

    if (originalOrder.isReviewed === true) {
      whereConditions.OR = [
        { price: { equals: 1600 } },
        { price: { equals: 600 } },
      ]
    }

    const { data, errors } = await client.query<{
      orders: AddonOrderQuery[]
    }>({
      query: getAddonOrdersQuery,
      variables: {
        where: whereConditions,
        orderBy: [{ createdAt: 'desc' }],
      },
      fetchPolicy: 'no-cache',
    })

    if (errors?.length) {
      const message = errors.map((e) => e.message).join(', ')
      createErrorLogger('Failed to fetch addon orders')(new Error(message))
      return NextResponse.json<ApiResponse>(
        { success: false, message },
        { status: 500 }
      )
    }

    if (!data.orders || data.orders.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'No matching addon orders found.',
          data: [],
        },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<AddonOrderQuery[]>>({
      success: true,
      message: 'Addon orders fetched successfully.',
      data: data.orders,
    })
  } catch (error) {
    createErrorLogger('Failed to fetch addon orders')(error)

    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
