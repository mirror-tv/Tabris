import { useEffect } from 'react'

import { useAuthStore } from '@/store'

/**
 * 認證 Hook
 * 在元件中使用，會自動初始化認證狀態
 */
export function useAuth() {
  const store = useAuthStore()

  // 自動初始化認證狀態（如果還沒初始化的話）
  useEffect(() => {
    if (!store.isInitialized) {
      store.initialize()
    }
  }, [store])

  return store
}
