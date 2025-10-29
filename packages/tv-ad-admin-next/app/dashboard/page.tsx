'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Link from 'next/link'

import FileIcon from '@/assets/icons/file.svg'
import UploadIcon from '@/assets/icons/upload.svg'
import StateCard from '@/components/dashboard/state-card'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { OrderStateMap } from '@/constants'
import { getOrdersState } from '@/utils/order-grouping'

const ERROR_MESSAGE = '載入訂單失敗，請稍後再試'

export default function DashboardPage() {
  const [ordersState, setOrdersState] = useState<
    { state: keyof typeof OrderStateMap; count: number }[]
  >([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchOrders = useCallback(async () => {
    // 取消之前的請求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/dashboard/stats', {
        signal: abortControllerRef.current.signal,
      })

      // 先讀取 response text，以便在 JSON 解析失敗時可以記錄
      let data
      let responseText: string | null = null
      try {
        responseText = await res.text()
        data = JSON.parse(responseText)
      } catch (jsonError) {
        // JSON 解析失敗（可能是伺服器回傳非 JSON，如 HTML 錯誤頁）
        console.error('[Dashboard Stats API] JSON 解析失敗:', {
          status: res.status,
          statusText: res.statusText,
          url: res.url,
          responseText: responseText?.substring(0, 500), // 限制長度避免 log 過長
          error: jsonError,
        })
        throw new Error(ERROR_MESSAGE)
      }

      if (!res.ok) {
        // API 回傳了錯誤 JSON，記錄完整的 debug 資訊
        console.error('[Dashboard Stats API] 請求失敗:', {
          status: res.status,
          statusText: res.statusText,
          url: res.url,
          apiError: data.error,
          fullResponse: data,
        })
        throw new Error(ERROR_MESSAGE)
      }

      // 成功：設定資料
      setOrdersState(getOrdersState(data.orders || []))
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return // 請求被取消，不更新狀態
      }
      // 記錄完整的錯誤資訊供工程師 debug
      console.error('[Dashboard Stats] 載入訂單失敗:', {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        errorName: error instanceof Error ? error.name : undefined,
      })
      // 只顯示友善的錯誤訊息給使用者，避免顯示技術細節
      // 技術細節已記錄在 console，供工程師 debug 使用
      setError(ERROR_MESSAGE)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchOrders])

  return (
    <>
      <PageHeader variant="spread" title="鏡新聞個人廣告系統" />
      <PageMain className="grid grid-rows-[auto_1fr] gap-4 py-5 md:gap-10 md:py-10">
        {/* --- Top two cards --- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {/* Upload Card */}
          <Link href="/upload">
            <Card className="cursor-pointer items-center justify-center gap-3 hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.10)]">
              <UploadIcon className="text-blue-7" />
              <CardTitle className="flex flex-col items-center gap-1">
                <span>上傳廣告素材</span>
                <CardDescription>上傳後即可進入製作流程</CardDescription>
              </CardTitle>
            </Card>
          </Link>

          {/* history Card */}
          <Link href="/list">
            <Card className="cursor-pointer items-center justify-center gap-3 hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.10)]">
              <FileIcon className="text-blue-7" />
              <CardTitle className="flex flex-col items-center gap-1">
                <span>訂單紀錄</span>
                <CardDescription>查看與管理所有訂單</CardDescription>
              </CardTitle>
            </Card>
          </Link>
        </div>

        {/* --- Bottom: Order state overview --- */}
        <Card>
          <CardHeader>
            <CardTitle>訂單狀態總覽</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-4 md:gap-4 xl:grid-cols-6">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-8 animate-spin rounded-full border-4 border-gray-3 border-t-blue-6" />
                  <p className="text-sm text-gray-7">載入中...</p>
                </div>
              </div>
            ) : error ? (
              <div className="col-span-full flex flex-col items-center justify-center gap-4 py-8">
                <p className="text-sm text-red-9">{error}</p>
                <Button onClick={fetchOrders}>重新整理</Button>
              </div>
            ) : ordersState.length === 0 ? (
              <div className="col-span-full flex items-center justify-center py-8">
                <p className="text-sm text-gray-7">目前沒有訂單狀態資料</p>
              </div>
            ) : (
              ordersState.map(({ state, count }) => {
                const config =
                  OrderStateMap[state as keyof typeof OrderStateMap]
                if (!config) return null

                return (
                  <Link key={state} href={`/list?state=${state}`}>
                    <StateCard
                      count={count}
                      text={config.label}
                      color={config.colors.text}
                      bgColor={config.colors.bg}
                    />
                  </Link>
                )
              })
            )}
          </CardContent>
        </Card>
      </PageMain>
    </>
  )
}
