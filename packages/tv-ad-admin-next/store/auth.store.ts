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

      // 設定使用者
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        })
      },

      // 設定載入狀態
      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      // 登入
      login: (user) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      // 登出
      logout: async () => {
        try {
          // 呼叫登出 API（清除 cookie）
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          })
        } catch (error) {
          console.error('登出 API 錯誤:', error)
          // 即使 API 失敗，也清除本地狀態
        } finally {
          // 清除 store 狀態
          set({
            ...initialState,
            isInitialized: true,
          })
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
      // 水合後需要重新驗證 token（因為 cookie 才是真實來源）
      onRehydrateStorage: () => (state) => {
        // 水合後，如果從 localStorage 恢復了用戶信息，仍需要驗證
        // 因為 cookie 可能已過期
        if (state?.isAuthenticated && typeof window !== 'undefined') {
          // 在客戶端異步驗證 token（但不設置 isInitialized，讓 initialize 方法處理）
          state.checkAuth().then(() => {
            // 驗證完成後設置初始化標記
            state && (state.isInitialized = true)
          })
        } else {
          // 如果沒有用戶信息，直接設置為已初始化
          state && (state.isInitialized = true)
        }
      },
    }
  )
)
