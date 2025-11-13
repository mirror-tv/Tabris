import { NextRequest, NextResponse } from 'next/server'

import { ORDER_STATE } from '@/constants'
import {
  createOrderFromAddonMutation,
  updateOrderRelationMutation,
} from '@/graphql/mutations/bind-addon-order'
import { getAddonOrdersQuery, AddonOrderQuery } from '@/graphql/queries/addon-orders'
import { ApiResponse } from '@/types'
import { getClient } from '@/utils/apollo-client'
import { getCurrentUser } from '@/utils/auth'
import { createErrorLogger } from '@/utils/error-handler'

export const dynamic = 'force-dynamic'

type BindAddonRequest = {
  originalOrderId: string
  addonOrderId: string
  modifications: {
    name?: string
    paragraphOne?: string
    paragraphTwo?: string
    scheduleStartDate?: string
    scheduleEndDate?: string
    isUrgent?: boolean
    imageId?: string
  }
}

/**
 * POST /api/upload/bind-addon
 *
 * 綁定加購訂單到原訂單的流程：
 * 1. 驗證原訂單和加購訂單的有效性
 * 2. 從加購訂單複製資料創建新訂單
 * 3. 套用修改到新訂單
 * 4. 將原訂單關聯到新訂單
 * 5. 將原訂單狀態改為 TRANSFERRED
 */
export async function POST(req: NextRequest) {
  const client = getClient()

  try {
    const currentUser = await getCurrentUser()

    if (!currentUser?.memberId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Unauthorized or missing memberId.' },
        { status: 401 }
      )
    }

    const body: BindAddonRequest = await req.json()
    const { originalOrderId, addonOrderId, modifications } = body

    if (!originalOrderId || !addonOrderId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Missing originalOrderId or addonOrderId.' },
        { status: 400 }
      )
    }

    const { data: ordersData, errors: ordersErrors } = await client.query({
      query: getAddonOrdersQuery,
      variables: {
        where: {
          id: { in: [originalOrderId, addonOrderId] },
          member: { id: { equals: currentUser.memberId } },
        },
      },
      fetchPolicy: 'no-cache',
    })

    if (ordersErrors?.length) {
      const message = ordersErrors.map((e) => e.message).join(', ')
      createErrorLogger('Failed to fetch orders for binding')(new Error(message))
      return NextResponse.json<ApiResponse>(
        { success: false, message },
        { status: 500 }
      )
    }

    const originalOrder = ordersData?.orders?.find(
      (o: AddonOrderQuery) => o.id === originalOrderId
    )
    const addonOrder = ordersData?.orders?.find(
      (o: AddonOrderQuery) => o.id === addonOrderId
    )

    if (!originalOrder || !addonOrder) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Original order or addon order not found.' },
        { status: 404 }
      )
    }

    // Step 3: 驗證加購訂單是否符合條件
    if (!addonOrder.needsModification) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Addon order does not have needsModification flag.',
        },
        { status: 400 }
      )
    }

    if (addonOrder.relatedOrderBy && addonOrder.relatedOrderBy.length > 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Addon order is already bound to another order.',
        },
        { status: 400 }
      )
    }

    type NewOrderData = {
      member: { connect: { id: string } }
      state: string
      price: number | null | undefined
      needsModification: boolean
      name: string | null | undefined
      paragraphOne: string | null | undefined
      paragraphTwo: string | null | undefined
      scheduleStartDate: string | null | undefined
      scheduleEndDate: string | null | undefined
      isUrgent: boolean | null | undefined
      image?: { connect: { id: string } }
    }

    const newOrderData: NewOrderData = {
      member: { connect: { id: currentUser.memberId } },
      state: ORDER_STATE.MATERIAL_UPLOADED,
      price: addonOrder.price,
      needsModification: false,
      name: modifications.name ?? addonOrder.name,
      paragraphOne: modifications.paragraphOne ?? addonOrder.paragraphOne,
      paragraphTwo: modifications.paragraphTwo ?? addonOrder.paragraphTwo,
      scheduleStartDate:
        modifications.scheduleStartDate ?? addonOrder.scheduleStartDate,
      scheduleEndDate:
        modifications.scheduleEndDate ?? addonOrder.scheduleEndDate,
      isUrgent: modifications.isUrgent ?? addonOrder.isUrgent,
    }

    if (modifications.imageId) {
      newOrderData.image = { connect: { id: modifications.imageId } }
    }

    const { data: createData, errors: createErrors } = await client.mutate({
      mutation: createOrderFromAddonMutation,
      variables: { data: newOrderData },
      errorPolicy: 'all',
    })

    if (createErrors?.length) {
      const message = createErrors.map((e) => e.message).join(', ')
      createErrorLogger('Failed to create new order from addon')(
        new Error(message)
      )
      return NextResponse.json<ApiResponse>(
        { success: false, message },
        { status: 500 }
      )
    }

    const newOrder = createData?.createOrder
    if (!newOrder || !newOrder.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Failed to create new order.' },
        { status: 500 }
      )
    }

    // Step 5: 將原訂單關聯到新訂單，並將原訂單狀態改為 TRANSFERRED
    const { errors: updateOriginalErrors } = await client.mutate({
      mutation: updateOrderRelationMutation,
      variables: {
        where: { id: originalOrderId },
        data: {
          state: ORDER_STATE.TRANSFERRED,
          relatedOrder: { connect: [{ id: newOrder.id }] },
        },
      },
      errorPolicy: 'all',
    })

    if (updateOriginalErrors?.length) {
      const message = updateOriginalErrors.map((e) => e.message).join(', ')
      createErrorLogger('Failed to update original order')(new Error(message))
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: `New order created but failed to update original order: ${message}`,
        },
        { status: 500 }
      )
    }

    const { errors: updateAddonErrors } = await client.mutate({
      mutation: updateOrderRelationMutation,
      variables: {
        where: { id: addonOrderId },
        data: {
          state: ORDER_STATE.TRANSFERRED,
        },
      },
      errorPolicy: 'all',
    })

    if (updateAddonErrors?.length) {
      createErrorLogger('Failed to update addon order status')(
        new Error(updateAddonErrors.map((e) => e.message).join(', '))
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Addon order bound successfully.',
      data: {
        newOrder,
        originalOrderId,
        addonOrderId,
      },
    })
  } catch (error) {
    createErrorLogger('Failed to bind addon order')(error)

    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
