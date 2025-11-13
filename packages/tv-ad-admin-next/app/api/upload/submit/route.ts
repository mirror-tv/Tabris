import { NextRequest, NextResponse } from 'next/server'

import {
  ALLOWED_IMAGE_FILE_TYPES,
  getNextState,
  MAX_IMAGE_FILE_SIZE,
  OrderState,
} from '@/constants'
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

type UploadMergedBody = OrderRecordForUploadMutation & {
  memberId: string
  oldImageId?: string
  image?: { connect: { id: string } }
}

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

    let mergedBody: UploadMergedBody | null = null

    // Case 1: multipart/form-data (image + fields)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()

      const orderNumber = formData.get('orderNumber') as string
      const currentState = formData.get(
        'state'
      ) as OrderRecordForUploadMutation['state']
      const name = formData.get('name') as string | null
      const paragraphOne = formData.get('paragraphOne') as string | null
      const paragraphTwo = formData.get('paragraphTwo') as string | null
      const scheduleStartDate = formData.get('scheduleStartDate') as
        | string
        | null
      const scheduleEndDate = formData.get('scheduleEndDate') as string | null
      const isUrgent = formData.get('isUrgent') as string | null
      const file = formData.get('file') as File | null

      // --- Step 1-1. Validate order number presence ---
      if (!orderNumber) {
        return NextResponse.json<ApiResponse>(
          { success: false, message: 'Missing orderNumber' },
          { status: 400 }
        )
      }

      let imageId: string | undefined
      let oldImageId: string | undefined

      // --- Step 1-2. Verify the order belongs to current user ---
      const { data: existingOrder, errors: queryErrors } = await client.query({
        query: getOrderImageQuery,
        variables: {
          orderNumber,
          memberId: currentUser.memberId,
        },
        fetchPolicy: 'no-cache',
      })

      if (queryErrors?.length) {
        const message = queryErrors.map((e) => e.message).join(', ')
        createErrorLogger('Failed to verify order ownership.')(new Error(message))
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

      // --- Step 1-3. Verify order state consistency before image upload ---
      if (order.state !== currentState) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: `Invalid or outdated state. Expected ${order.state}, but received ${currentState}.`,
          },
          { status: 409 }
        )
      }

      // --- Step 1-4. Validate and upload image if present ---
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

        // --- Step 1-5. Upload new image (create Photo record in Keystone) ---
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

        // ensure photo ID is returned
        if (!uploadData?.createPhoto?.id) {
          return NextResponse.json<ApiResponse>(
            {
              success: false,
              message: 'Image upload failed: no photo ID returned.',
            },
            { status: 500 }
          )
        }

        imageId = uploadData?.createPhoto?.id
      }

      //  --- Step 1-6. prepare mergedBody for shared Case 2 logic ---
      mergedBody = {
        orderNumber,
        state: currentState,
        memberId: currentUser.memberId,
        ...(name && { name }),
        ...(paragraphOne && { paragraphOne }),
        ...(paragraphTwo && { paragraphTwo }),
        ...(scheduleStartDate && { scheduleStartDate }),
        ...(scheduleEndDate && { scheduleEndDate }),
        ...(isUrgent && { isUrgent: isUrgent === 'true' }),
        ...(imageId && { image: { connect: { id: imageId } } }),
      }

      if (oldImageId) mergedBody.oldImageId = oldImageId
    }

    // Case 2: JSON-only request (no image upload)
    const body = mergedBody ?? (await req.json())
    const {
      memberId,
      orderNumber,
      state: currentState,
      oldImageId,
      image,
      ...updateData
    } = body

    // --- Step 2-1. Validate required input fields ---
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
    // --- Step 2-2. Verify member identity consistency ---
    if (!memberId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Missing memberId in payload.' },
        { status: 400 }
      )
    }

    if (memberId !== currentUser.memberId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Unauthorized: Member ID does not match current user.',
        },
        { status: 403 }
      )
    }

    // --- Step 2-3. Prevent if the state is outdated and determine next state dynamically ---
    if (!currentState) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Missing currentState in payload.' },
        { status: 400 }
      )
    }

    const nextState = getNextState(currentState as OrderState)

    if (!nextState) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Cannot determine next state for current order state.',
        },
        { status: 400 }
      )
    }

    // --- Step 2-4. Perform the order update mutation ---
    const { data: result, errors: updateErrors } = await client.mutate({
      mutation: updateOrderForUploadSubmit,
      variables: {
        where: {
          orderNumber,
        },
        data: {
          state: nextState,
          ...(image && { image }),
          ...updateData,
        },
      },
      errorPolicy: 'all',
    })

    if (updateErrors?.length) {
      // --- Handle update failure with image compensation ---
      if (image?.connect?.id) {
        try {
          await client.mutate({
            mutation: deletePhotoMutation,
            variables: { where: { id: image.connect.id } },
            context: {
              headers: { 'x-apollo-operation-name': 'deleteFailedNewPhoto' },
            },
          })
          createErrorLogger(
            `Compensated: deleted unlinked new photo ${image.connect.id}`
          )(new Error('Order update mutation failed'))
        } catch (cleanupError) {
          createErrorLogger(
            `Failed to delete new photo after mutation failure ${image.connect.id}`
          )(cleanupError)
        }
      }

      const errorMsg = updateErrors.map((e) => e.message).join(', ')
      createErrorLogger(`Order update mutation failed: ${orderNumber}`)(
        new Error(errorMsg)
      )
      return NextResponse.json<ApiResponse>(
        { success: false, message: errorMsg },
        { status: 500 }
      )
    }

    // --- Step 2-5. Delete old image after successful update ---
    if (oldImageId) {
      try {
        await client.mutate({
          mutation: deletePhotoMutation,
          variables: { where: { id: oldImageId } },
          context: { headers: { 'x-apollo-operation-name': 'deleteOldPhoto' } },
        })
      } catch (cleanupError) {
        createErrorLogger(`Failed to delete previous image record ${oldImageId}`)(
          cleanupError
        )
      }
    }

    // --- Step 2-6 Return success response ---
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
