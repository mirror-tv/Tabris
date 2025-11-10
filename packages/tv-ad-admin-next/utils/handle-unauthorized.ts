'use client'

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { useAuthStore } from '@/store/auth.store'

/**
 * 處理 401 Unauthorized 錯誤
 * 登出並重導向登入頁面
 *
 * @param router
 */
export async function handleUnauthorized(router: AppRouterInstance) {
  const { logout } = useAuthStore.getState()

  try {
    await logout()
    router.push('/')
  } catch (error) {
    console.error('處理未授權錯誤時發生問題:', error)
    router.push('/')
  }
}
