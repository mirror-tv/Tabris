/**
 * Member 驗證服務
 * 檢查使用者是否在 CMS member 資料中存在
 */

import { env } from '@/utils/env'
import {
  CHECK_MEMBER_BY_EMAIL_QUERY,
  CHECK_MEMBER_BY_PHONE_QUERY,
} from '@/graphql/queries/members'

// CMS API 配置
const CMS_API_URL = env.GQL_ENDPOINT

/**
 * 檢查信箱是否在 CMS member 中存在
 */
export async function checkMemberByEmail(email: string): Promise<{
  exists: boolean
  message?: string
}> {
  try {
    // 呼叫 CMS API 驗證會員
    const response = await fetch(CMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CHECK_MEMBER_BY_EMAIL_QUERY,
        variables: {
          where: {
            email: { equals: email },
            state: { equals: 'active' },
          },
        },
      }),
    })

    if (!response.ok) {
      console.error('CMS API 查詢失敗:', response.statusText)
      return {
        exists: false,
        message: '系統錯誤，請稍後再試',
      }
    }

    const data = await response.json()
    const members = data?.data?.members || []

    return {
      exists: members.length > 0,
      message:
        members.length === 0 ? '請輸入您註冊應援科技使用的電子信箱' : undefined,
    }
  } catch (error) {
    console.error('檢查 member 錯誤:', error)
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
  try {
    // 呼叫 CMS API 驗證會員
    const response = await fetch(CMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CHECK_MEMBER_BY_PHONE_QUERY,
        variables: {
          where: {
            mobile: { equals: phone },
            state: { equals: 'active' },
          },
        },
      }),
    })

    if (!response.ok) {
      console.error('CMS API 查詢失敗:', response.statusText)
      return {
        exists: false,
        message: '系統錯誤，請稍後再試',
      }
    }

    const data = await response.json()
    const members = data?.data?.members || []

    return {
      exists: members.length > 0,
      message:
        members.length === 0 ? '請輸入您註冊應援科技使用的手機號碼' : undefined,
    }
  } catch (error) {
    console.error('檢查 member 錯誤:', error)
    return {
      exists: false,
      message: '系統錯誤，請稍後再試',
    }
  }
}
