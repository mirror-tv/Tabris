import { NextResponse } from 'next/server'

import { getOrdersStateQuery } from '@/graphql/queries/orders'
import { type OrderRecordForDashboard } from '@/graphql/queries/orders'
import { getClient } from '@/utils/apollo-client'
import { getCurrentUser } from '@/utils/auth'
import { createErrorLogger } from '@/utils/error-handler'
import { getMemberById } from '@/utils/member'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: '找不到使用者資料' }, { status: 401 })
    }

    // 必須要有 memberId
    if (!currentUser.memberId) {
      return NextResponse.json(
        { error: '使用者驗證失敗，請重新登錄。' },
        { status: 401 }
      )
    }

    // 取得完整的 Member 資料（使用 memberId）
    const member = await getMemberById(currentUser.memberId)

    if (!member) {
      return NextResponse.json({ error: '找不到會員資料' }, { status: 404 })
    }

    // 🔒 安全性：驗證查詢到的 member.id 與 JWT 中的 memberId 一致
    // 防止可能的 memberId 偽造或查詢錯誤（雖然理論上應該一致，但保留此檢查以增強安全性）
    if (member.id !== currentUser.memberId) {
      return NextResponse.json({ error: '會員資料驗證失敗' }, { status: 403 })
    }

    // 查詢訂單資料（可以根據 member.id 過濾，這裡示範取得所有訂單）
    const client = getClient()
    const { data } = await client.query<{ orders: OrderRecordForDashboard[] }>({
      query: getOrdersStateQuery,
      variables: {
        where: {
          member: { id: { equals: member.id } },
        },
        orderBy: [{ updatedAt: 'desc' }],
      },
    })

    const orders = data?.orders || []

    return NextResponse.json({
      orders,
      member, // 返回 member 資料
      user: currentUser, // 返回使用者資訊
    })
  } catch (error) {
    createErrorLogger('Failed to fetch dashboard stats')(error)

    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
