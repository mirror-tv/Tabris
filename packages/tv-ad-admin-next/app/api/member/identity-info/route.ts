/**
 * POST /api/member/identity-info
 * 更新 member 的 nationalId 和 residentialAddress
 */

import { NextRequest, NextResponse } from 'next/server'

import { updateMemberIdentityMutation } from '@/graphql/mutations/member'
import { getClient } from '@/utils/apollo-client'
import { getCurrentUser } from '@/utils/auth'
import { createErrorLogger } from '@/utils/error-handler'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser?.memberId) {
      return NextResponse.json(
        { success: false, message: '未登入或缺少會員資訊' },
        { status: 401 }
      )
    }

    const { idNumber, address } = await request.json()

    if (!idNumber || typeof idNumber !== 'string' || !idNumber.trim()) {
      return NextResponse.json(
        { success: false, message: '請輸入身分證字號' },
        { status: 400 }
      )
    }

    if (!address || typeof address !== 'string' || !address.trim()) {
      return NextResponse.json(
        { success: false, message: '請輸入完整通訊地址' },
        { status: 400 }
      )
    }

    const client = getClient()
    const { data, errors } = await client.mutate({
      mutation: updateMemberIdentityMutation,
      variables: {
        where: {
          id: currentUser.memberId,
        },
        data: {
          nationalId: idNumber.trim(),
          residentialAddress: address.trim(),
        },
      },
      errorPolicy: 'all',
    })

    if (errors && errors.length) {
      const errorMessage = errors
        .map((e: { message: string }) => e.message)
        .join(', ')
      createErrorLogger('Failed to update member identity info')(
        new Error(`GraphQL errors: ${errorMessage}`)
      )

      return NextResponse.json(
        {
          success: false,
          message: `更新失敗: ${errorMessage}`,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '身份資訊更新成功',
      data: data?.updateMember,
    })
  } catch (error) {
    createErrorLogger('Failed to update member identity info')(error)

    return NextResponse.json(
      {
        success: false,
        message: '更新身份資訊時發生錯誤',
      },
      { status: 500 }
    )
  }
}
