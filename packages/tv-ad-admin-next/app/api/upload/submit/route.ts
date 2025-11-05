import { NextRequest, NextResponse } from 'next/server'

import { updateOrderForUploadSubmit } from '@/graphql/mutations/order'
import { ApiResponse } from '@/types'
import { getClient } from '@/utils/apollo-client'
import { createErrorLogger } from '@/utils/error-handler'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderNumber, ...updateData } = body

    if (!orderNumber) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Missing order orderNumber' },
        { status: 400 }
      )
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'No update fields provided' },
        { status: 400 }
      )
    }

    const client = getClient()
    const { data: result, errors } = await client.mutate({
      mutation: updateOrderForUploadSubmit,
      variables: {
        where: { orderNumber },
        data: updateData,
      },
      errorPolicy: 'all',
    })

    if (errors?.length) {
      const errorMessage = errors.map((e) => e.message).join(', ')
      createErrorLogger(`Failed to update order upload: ${orderNumber}`)(
        new Error(errorMessage)
      )
      return NextResponse.json<ApiResponse>(
        { success: false, message: errorMessage },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Order updated successfully',
      data: result?.updateOrder,
    })
  } catch (error) {
    createErrorLogger('Failed to update order on upload')(error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Update failed' },
      { status: 500 }
    )
  }
}
