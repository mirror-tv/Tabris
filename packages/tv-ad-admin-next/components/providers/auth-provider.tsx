'use client'

import { useEffect } from 'react'

import { useAuthStore } from '@/store'

/**
 * AuthProvider 組件
 * 在應用啟動時初始化認證狀態
 * 應該放在 RootLayout 中使用
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, isInitialized } = useAuthStore()

  useEffect(() => {
    // 只在客戶端執行，避免 SSR 水合問題
    if (typeof window !== 'undefined' && !isInitialized) {
      initialize()
    }
  }, [initialize, isInitialized])

  return <>{children}</>
}
