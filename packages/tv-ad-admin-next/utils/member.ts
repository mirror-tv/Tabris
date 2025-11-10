/**
 * Member 驗證服務
 * 檢查使用者是否在 CMS member 資料中存在
 */

import type { UserPayload } from '@/utils/auth'

import {
  checkMemberByEmailQuery,
  getMembersQuery,
} from '@/graphql/queries/members'
import { getClient } from '@/utils/apollo-client'
import { createErrorLogger } from '@/utils/error-handler'

// Member 完整資料類型
export type MemberData = {
  id: string
  firebaseID?: string
  email?: string
  name?: string
  mobile?: string
  state?: string
}

/**
 * 內部共用：執行 GraphQL 查詢並處理錯誤
 */
async function queryMembers(
  query: typeof checkMemberByEmailQuery | typeof getMembersQuery,
  variables: Record<string, unknown>,
  functionName: string
): Promise<MemberData[]> {
  const errorLogger = createErrorLogger(
    `Failed to query members in ${functionName}`,
    {
      function: functionName,
      variables,
    }
  )

  try {
    const client = getClient()
    const { data, errors } = await client.query({
      query,
      variables,
      errorPolicy: 'all',
    })

    if (errors && errors.length > 0) {
      const graphQLError = new Error(
        `GraphQL errors: ${errors.map((e: { message: string }) => e.message).join(', ')}`
      )
      errorLogger(graphQLError)
      return []
    }

    return (data?.members || []) as MemberData[]
  } catch (error) {
    errorLogger(error)
    return []
  }
}

/**
 * 檢查信箱是否在 CMS member 中存在
 */
export async function checkMemberByEmail(email: string): Promise<{
  exists: boolean
  message?: string
}> {
  const members = await queryMembers(
    checkMemberByEmailQuery,
    {
      where: { email: { equals: email }, state: { equals: 'active' } },
    },
    'checkMemberByEmail'
  )

  return {
    exists: members.length > 0,
    message:
      members.length === 0 ? '請輸入您註冊應援科技使用的電子信箱' : undefined,
  }
}

/**
 * 根據 member id 取得完整的 Member 資料（推薦：更可靠）
 */
export async function getMemberById(id: string): Promise<MemberData | null> {
  // 🔒 安全性：驗證 memberId 格式（防止注入攻擊和異常輸入）
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return null
  }

  // 限制長度（根據實際 CMS member id 格式調整）
  if (id.length > 100) {
    return null
  }

  // 移除前後空白
  const cleanId = id.trim()

  const members = await queryMembers(
    getMembersQuery,
    {
      where: { id: { equals: cleanId } },
    },
    'getMemberById'
  )

  return members.length > 0 ? members[0] : null
}

/**
 * 根據 email 取得完整的 Member 資料（用於登入時查詢 member id）
 */
export async function getMemberByEmail(
  email: string
): Promise<MemberData | null> {
  if (!email) {
    return null
  }

  const whereCondition = {
    email: { equals: email },
    state: { equals: 'active' },
  }

  const members = await queryMembers(
    getMembersQuery,
    { where: whereCondition },
    'getMemberByEmail'
  )

  return members.length > 0 ? members[0] : null
}

export async function getMemberByUser(
  user: UserPayload
): Promise<MemberData | null> {
  // 如果有 memberId，直接使用（更可靠）
  if (user.memberId) {
    return getMemberById(user.memberId)
  }

  return getMemberByEmail(user.email)
}
