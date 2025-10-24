/**
 * Member 驗證服務
 * 檢查使用者是否在 CMS member 資料中存在
 */

import {
  checkMemberByEmailQuery,
  checkMemberByPhoneQuery,
} from '@/graphql/queries/members'
import { getClient } from '@/utils/apollo-client'
import { createErrorLogger } from '@/utils/error-handler'

/**
 * 檢查信箱是否在 CMS member 中存在
 */
export async function checkMemberByEmail(email: string): Promise<{
  exists: boolean
  message?: string
}> {
  const errorLogger = createErrorLogger('Failed to check member by email', {
    function: 'checkMemberByEmail',
    email,
  })

  try {
    const client = getClient()
    const { data, errors } = await client.query({
      query: checkMemberByEmailQuery,
      variables: {
        where: { email: { equals: email }, state: { equals: 'active' } },
      },
      errorPolicy: 'all',
    })

    // 檢查 GraphQL 錯誤
    if (errors && errors.length > 0) {
      const graphQLError = new Error(
        `GraphQL errors: ${errors.map((e) => e.message).join(', ')}`
      )
      errorLogger(graphQLError)
      return {
        exists: false,
        message: '系統錯誤，請稍後再試',
      }
    }

    const members = data?.members || []

    return {
      exists: members.length > 0,
      message:
        members.length === 0 ? '請輸入您註冊應援科技使用的電子信箱' : undefined,
    }
  } catch (error) {
    errorLogger(error)
    return {
      exists: false,
      message: '系統錯誤，請稍後再試',
    }
  }
}

/**
 * 檢查手機號碼是否在 CMS member 中存在
 */
export async function checkMemberByPhone(phone: string): Promise<{
  exists: boolean
  message?: string
}> {
  const errorLogger = createErrorLogger('Failed to check member by phone', {
    function: 'checkMemberByPhone',
    phone,
  })

  try {
    const client = getClient()
    const { data, errors } = await client.query({
      query: checkMemberByPhoneQuery,
      variables: {
        where: { mobile: { equals: phone }, state: { equals: 'active' } },
      },
      errorPolicy: 'all',
    })

    // 檢查 GraphQL 錯誤
    if (errors && errors.length > 0) {
      const graphQLError = new Error(
        `GraphQL errors: ${errors.map((e) => e.message).join(', ')}`
      )
      errorLogger(graphQLError)
      return {
        exists: false,
        message: '系統錯誤，請稍後再試',
      }
    }

    const members = data?.members || []

    return {
      exists: members.length > 0,
      message:
        members.length === 0 ? '請輸入您註冊應援科技使用的手機號碼' : undefined,
    }
  } catch (error) {
    errorLogger(error)
    return {
      exists: false,
      message: '系統錯誤，請稍後再試',
    }
  }
}
