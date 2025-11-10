import { NextRequest, NextResponse } from 'next/server'

import { ALLOWED_IMAGE_FILE_TYPES, MAX_IMAGE_FILE_SIZE } from '@/constants'
import { deletePhotoMutation } from '@/graphql/delete/photo'
import {
  OrderRecordForUploadMutation,
  updateOrderForUploadSubmit,
} from '@/graphql/mutations/order'
import { uploadImageMutation } from '@/graphql/mutations/photo'
import { getOrderImageQuery } from '@/graphql/queries/photo'
import { ApiResponse } from '@/types'
import { getClient } from '@/utils/apollo-client'
import { getCurrentUser } from '@/utils/auth'
import { createErrorLogger } from '@/utils/error-handler'

export async function POST(req: NextRequest) {
  const client = getClient()
  const contentType = req.headers.get('content-type') || ''

  try {
    const currentUser = await getCurrentUser()

    // Step 0: Authenticate and verify member identity
    if (!currentUser?.memberId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Unauthorized or missing memberId.' },
        { status: 401 }
      )
    }

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

      // --- Step 1-1. Verify the order belongs to current user ---
      const { data: existingOrder, errors: ownershipErrors } =
        await client.query({
          query: getOrderImageQuery,
          variables: {
            orderNumber,
            memberId: currentUser.memberId,
          },
          fetchPolicy: 'no-cache',
        })

      if (ownershipErrors?.length) {
        const message = ownershipErrors.map((e) => e.message).join(', ')
        createErrorLogger('Ownership validation failed')(new Error(message))
        return NextResponse.json<ApiResponse>(
          { success: false, message },
          { status: 500 }
        )
      }

      const order = existingOrder?.orders?.[0]
      if (!order || order.member?.id !== currentUser.memberId) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: 'Unauthorized: Order does not belong to this member.',
          },
          { status: 403 }
        )
      }

      // --- Step 1-2. Query existing image (for later cleanup if replaced) ---
      if (file) {
        // --- Validate image file type and size on the server before upload ---
        if (!ALLOWED_IMAGE_FILE_TYPES.includes(file.type)) {
          return NextResponse.json<ApiResponse>(
            {
              success: false,
              message:
                'Invalid file type. Only JPG and PNG formats are allowed.',
            },
            { status: 400 }
          )
        }

        if (file.size > MAX_IMAGE_FILE_SIZE) {
          return NextResponse.json<ApiResponse>(
            {
              success: false,
              message: 'File size exceeds 5MB limit.',
            },
            { status: 400 }
          )
        }

        oldImageId = order?.image?.id

        // --- Step 1-3. Upload new image (create Photo record in Keystone) ---
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

      // --- Step 1-4. Update order with new image ---
      // This links the new image to the order and unlinks the old one automatically.
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

      // --- Step 1-5. Handle update failure with compensation (delete new image) ---
      if (updateErrors?.length) {
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

      // --- Step 1-6. Delete old image after successful update ---
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

    // --- Step 2-1. Validate required input fields (basic sanity check) ---
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
    // --- Step 2-2. Verify ownership before updating ---
    const { data: existingOrder } = await client.query({
      query: getOrderImageQuery,
      variables: { orderNumber, memberId: currentUser.memberId },
      fetchPolicy: 'no-cache',
    })

    if (!existingOrder?.orders?.length) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Unauthorized: order not found or access denied.',
        },
        { status: 403 }
      )
    }

    // --- Step 2-3. Perform the order update mutation ---
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

    // --- Step 2-4. Return success response ---
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
