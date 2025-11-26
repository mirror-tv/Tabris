'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { OrderTable } from '@/components/list/order-table'
import { SearchAndFilter } from '@/components/list/search-and-filter'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import { Spinner } from '@/components/ui/spinner'
import { type OrderState } from '@/constants'
import { type OrderRecordForList } from '@/graphql/queries/orders'
import { handleUnauthorized } from '@/utils/handle-unauthorized'
import { groupOrders } from '@/utils/order-grouping'
import { normalizeOrderState } from '@/utils/state'

export default function ListPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [orderState, setOrderState] = useState<OrderState | 'all'>('all')
  const [orders, setOrders] = useState<OrderRecordForList[][]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/list/orders')
        if (!res.ok) {
          if (res.status === 401) {
            await handleUnauthorized(router)
            return
          }
          if (res.status === 404) {
            router.push('/not-found/404')
            return
          }
          throw new Error(`Failed to fetch orders: ${res.statusText}`)
        }
        const data = await res.json()
        setOrders(groupOrders(data.orders || []))
        setError(null)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        setError(error instanceof Error ? error.message : '載入訂單失敗')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [router])

  useEffect(() => {
    const state = searchParams.get('state') || 'all'
    const keyword = searchParams.get('keyword') || ''
    setOrderState(state as OrderState | 'all')
    setSearchKeyword(keyword)
  }, [searchParams])

  const handleViewOrder = useCallback(
    (orderNumber: string) => {
      router.push(`/order/${orderNumber}`)
    },
    [router]
  )

  const renderedOrders = useMemo(() => {
    let filtered = [...orders]
    if (orderState !== 'all') {
      filtered = filtered
        .map((group) => {
          return group.filter((order) => {
            const normalizedState = normalizeOrderState(order.state)
            return normalizedState === orderState
          })
        })
        .filter((group) => group.length > 0)
    }
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      filtered = filtered
        .map((group) => {
          return group.filter(
            (o) =>
              (o.name?.toLowerCase()?.includes(keyword) ?? false) ||
              (o.orderNumber?.toLowerCase()?.includes(keyword) ?? false)
          )
        })
        .filter((group) => group.length > 0)
    }
    return filtered
  }, [orders, orderState, searchKeyword])

  const totalOrders = useMemo(
    () => renderedOrders.flat().length,
    [renderedOrders]
  )

  return (
    <>
      <PageHeader title="訂單紀錄" />
      <PageMain className="py-5 md:py-10">
        <SearchAndFilter
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          orderState={orderState}
          onStateChange={setOrderState as (state: OrderState | 'all') => void}
          isLoading={isLoading}
        />

        <div className="mb-6 flex flex-col gap-6 rounded-xl border border-border-default bg-surface-primary p-6">
          <h4 className="text-text-primary">訂單列表 ({totalOrders}筆記錄)</h4>

          {isLoading ? (
            <Spinner className="mx-auto my-0 size-15" />
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : !totalOrders ? (
            <div className="py-8 text-center text-gray-6">沒有訂單資料</div>
          ) : (
            <OrderTable orders={renderedOrders} onViewOrder={handleViewOrder} />
          )}
        </div>
      </PageMain>
    </>
  )
}
