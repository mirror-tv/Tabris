/**
 * Member 驗證服務
 * 檢查使用者是否在 CMS member 資料中存在
 */

import type { UserPayload } from '@/utils/auth'

import {
  checkMemberByEmailQuery,
  checkMemberByPhoneQuery,
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
  query:
    | typeof checkMemberByEmailQuery
    | typeof checkMemberByPhoneQuery
    | typeof getMembersQuery,
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
 * 檢查手機號碼是否在 CMS member 中存在
 */
export async function checkMemberByPhone(phone: string): Promise<{
  exists: boolean
  message?: string
}> {
  const members = await queryMembers(
    checkMemberByPhoneQuery,
    {
      where: { mobile: { equals: phone }, state: { equals: 'active' } },
    },
    'checkMemberByPhone'
  )

  return {
    exists: members.length > 0,
    message:
      members.length === 0 ? '請輸入您註冊應援科技使用的手機號碼' : undefined,
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
 * 根據 email 或 phone 取得完整的 Member 資料（用於登入時查詢 member id）
 */
export async function getMemberByIdentifier(
  email?: string,
  phone?: string
): Promise<MemberData | null> {
  // 根據 email 或 phone 查詢 member
  const whereCondition = email
    ? { email: { equals: email }, state: { equals: 'active' } }
    : phone
      ? { mobile: { equals: phone }, state: { equals: 'active' } }
      : null

  if (!whereCondition) {
    return null
  }

  const members = await queryMembers(
    getMembersQuery,
    { where: whereCondition },
    'getMemberByIdentifier'
  )

  return members.length > 0 ? members[0] : null
}

/**
 * 根據 UserPayload 取得完整的 Member 資料（透過 email/phone 查詢）
 * @deprecated 如果 UserPayload 已有 memberId，請使用 getMemberById
 * 此函數僅為向後兼容保留，建議使用 getMemberByIdentifier 或 getMemberById
 */
export async function getMemberByUser(
  user: UserPayload
): Promise<MemberData | null> {
  // 如果有 memberId，直接使用（更可靠）
  if (user.memberId) {
    return getMemberById(user.memberId)
  }

  // 否則使用 email/phone 查詢
  return getMemberByIdentifier(user.email, user.phone)
}
