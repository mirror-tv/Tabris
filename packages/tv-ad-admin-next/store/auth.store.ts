'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { UserPayload } from '@/utils/auth'

type AuthState = {
  user: UserPayload | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
}

type AuthActions = {
  setUser: (user: UserPayload | null) => void
  setLoading: (loading: boolean) => void
  login: (user: UserPayload) => void
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  initialize: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

// 初始狀態
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        })
      },
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
      login: (user) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: async () => {
        set({
          ...initialState,
          isInitialized: true,
        })
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
            keepalive: true, // 確保請求在頁面關閉後仍能完成
          })
        } catch (error) {
          console.error('登出 API 錯誤:', error)
          // API 錯誤不影響登出流程，因為本地狀態已清除
        }
      },
      // 檢查認證狀態（從 API 獲取當前使用者）
      checkAuth: async () => {
        const { setUser, setLoading } = get()
        setLoading(true)

        try {
          const response = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include',
          })

          const data = await response.json()

          if (data.success && data.user) {
            setUser(data.user)
          } else {
            setUser(null)
          }
        } catch (error) {
          console.error('檢查認證狀態錯誤:', error)
          setUser(null)
        } finally {
          setLoading(false)
          set({ isInitialized: true })
        }
      },
      // 初始化（應用啟動時檢查認證狀態）
      initialize: async () => {
        const { isInitialized, checkAuth } = get()
        if (!isInitialized) {
          await checkAuth()
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // 只持久化 user 和 isAuthenticated，不持久化 loading 狀態
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // hydration 後需要重新驗證 token（因為 cookie 才是真實來源）
      onRehydrateStorage: () => (state) => {
        // 注意：onRehydrateStorage 的回調不支援 async，所以不 await
        if (typeof window !== 'undefined') {
          // 如果 localStorage 顯示未登入，但 cookie 可能還存在（登出時沒清乾淨）
          // 清除可能的殘留 cookie
          if (!state?.isAuthenticated) {
            fetch('/api/auth/logout', {
              method: 'POST',
              credentials: 'include',
              keepalive: true,
            }).catch(() => {
              // 忽略錯誤，因為可能 cookie 已經不存在了
            })
            if (state) {
              state.setLoading(false)
              useAuthStore.setState({ isInitialized: true })
            }
          } else {
            // 如果 localStorage 顯示已登入，需要驗證 cookie 的真實狀態
            // 在開始驗證前，先設置 loading 狀態，避免畫面閃爍
            state?.setLoading(true)
            // 非同步執行驗證（不 await，因為 onRehydrateStorage 不支援 async）
            // checkAuth 會自動設置 isInitialized 和 loading 狀態
            state?.checkAuth()
          }
        } else {
          // 如果沒有 window 對象，直接設置為已初始化
          if (state) {
            useAuthStore.setState({ isInitialized: true })
          }
        }
      },
    }
  )
)
