import { NextRequest, NextResponse } from 'next/server'

import { deletePhotoMutation } from '@/graphql/delete/photo'
import {
  OrderRecordForUploadMutation,
  updateOrderForUploadSubmit,
} from '@/graphql/mutations/order'
import { uploadImageMutation } from '@/graphql/mutations/photo'
import { getOrderImageQuery } from '@/graphql/queries/photo'
import { ApiResponse } from '@/types'
import { getClient } from '@/utils/apollo-client'
import { createErrorLogger } from '@/utils/error-handler'

export async function POST(req: NextRequest) {
  const client = getClient()
  const contentType = req.headers.get('content-type') || ''

  try {
    // Case 1: multipart/form-data (image + fields)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()

      const orderNumber = formData.get('orderNumber') as string
      const state = formData.get(
        'state'
      ) as OrderRecordForUploadMutation['state']
      const name = formData.get('name') as string | null
      const paragraphOne = formData.get('paragraphOne') as string | null
      const paragraphTwo = formData.get('paragraphTwo') as string | null
      const scheduleStartDate = formData.get('scheduleStartDate') as
        | string
        | null
      const scheduleEndDate = formData.get('scheduleEndDate') as string | null
      const file = formData.get('file') as File | null

      if (!orderNumber) {
        return NextResponse.json<ApiResponse>(
          { success: false, message: 'Missing orderNumber' },
          { status: 400 }
        )
      }

      let imageId: string | undefined
      let oldImageId: string | undefined

      // --- Step 0. Query existing image (for later cleanup if replaced) ---
      if (file) {
        const { data: existing } = await client.query({
          query: getOrderImageQuery,
          variables: { orderNumber },
          fetchPolicy: 'no-cache',
        })

        oldImageId = existing?.orders?.[0]?.image?.id

        // --- Step 1. Upload new image (create Photo record in Keystone) ---
        const cleanName = file.name.replace(/\.[^/.]+$/, '')
        const { data: uploadData, errors: uploadErrors } = await client.mutate({
          mutation: uploadImageMutation,
          variables: { name: cleanName, upload: file },
          context: {
            // Add CSRF-safe header when calling Keystone GraphQL endpoint.
            // This header is only needed for server-side Apollo Client requests,
            headers: {
              'x-apollo-operation-name': 'uploadImage',
            },
          },
          errorPolicy: 'all',
        })

        if (uploadErrors?.length) {
          const errorMsg = uploadErrors.map((e) => e.message).join(', ')
          createErrorLogger('Image upload failed')(new Error(errorMsg))
          return NextResponse.json<ApiResponse>(
            { success: false, message: errorMsg },
            { status: 500 }
          )
        }

        imageId = uploadData?.createPhoto?.id
      }

      // --- Step 2. Update order with new image (automatically unlinks old one) ---
      const updateData: Omit<
        OrderRecordForUploadMutation,
        'orderNumber' | 'image'
      > & {
        image?: { connect: { id: string } }
      } = {
        state,
        ...(name && { name }),
        ...(paragraphOne && { paragraphOne }),
        ...(paragraphTwo && { paragraphTwo }),
        ...(scheduleStartDate && { scheduleStartDate }),
        ...(scheduleEndDate && { scheduleEndDate }),
        ...(imageId && { image: { connect: { id: imageId } } }),
      }

      const { data: result, errors: updateErrors } = await client.mutate({
        mutation: updateOrderForUploadSubmit,
        variables: {
          where: { orderNumber },
          data: updateData,
        },
        errorPolicy: 'all',
      })

      if (updateErrors?.length) {
        // If order update failed, try compensating: delete newly uploaded image.
        if (imageId) {
          try {
            await client.mutate({
              mutation: deletePhotoMutation,
              variables: { where: { id: imageId } },
              context: {
                headers: { 'x-apollo-operation-name': 'deleteFailedNewPhoto' },
              },
            })
            createErrorLogger(
              `Compensated: deleted unlinked new photo ${imageId}`
            )(new Error('Order update failed'))
          } catch (cleanupError) {
            createErrorLogger(`Compensation failed for new photo ${imageId}`)(
              cleanupError
            )
          }
        }

        const errorMsg = updateErrors.map((e) => e.message).join(', ')
        createErrorLogger(`Order update failed: ${orderNumber}`)(
          new Error(errorMsg)
        )
        return NextResponse.json<ApiResponse>(
          { success: false, message: errorMsg },
          { status: 500 }
        )
      }

      // --- Step 3. Delete old image after successful update ---
      if (oldImageId) {
        try {
          await client.mutate({
            mutation: deletePhotoMutation,
            variables: { where: { id: oldImageId } },
            context: {
              headers: { 'x-apollo-operation-name': 'deleteOldPhoto' },
            },
          })
        } catch (cleanupError) {
          createErrorLogger(`Failed to delete old photo ${oldImageId}`)(
            cleanupError
          )
        }
      }

      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Order and image processed successfully',
        data: result?.updateOrder,
      })
    }

    // Case 2: fallback for JSON-only requests
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
