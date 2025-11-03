'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { OrderTable } from '@/components/list/order-table'
import { SearchAndFilter } from '@/components/list/search-and-filter'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import { type OrderState } from '@/constants'
import { type OrderRecordForList } from '@/graphql/queries/orders'
import { groupOrders } from '@/utils/order-grouping'

function ListContent() {
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

    const state = searchParams.get('state') || 'all'
    const keyword = searchParams.get('keyword') || ''
    setOrderState(state as OrderState | 'all')
    setSearchKeyword(keyword)
  }, [searchParams])

  const renderedOrders = useMemo(() => {
    let filtered = [...orders]
    if (orderState !== 'all') {
      filtered = filtered.filter((order) => {
        return order.some((o) => o.state === orderState)
      })
    }
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      filtered = filtered.filter((order) => {
        return order.some(
          (o) =>
            (o.name?.toLowerCase()?.includes(keyword) ?? false) ||
            (o.orderNumber?.toLowerCase()?.includes(keyword) ?? false)
        )
      })
    }
    return filtered
  }, [orderState, searchKeyword])

  const handleViewOrder = (orderNumber: string) => {
    router.push(`/order/${orderNumber}`)
  }

  // 使用 memo 避免重複計算訂單總數
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
        />

        <div className="mb-6 flex flex-col gap-6 rounded-xl border border-border-default bg-surface-primary p-6">
          <h4 className="text-text-primary">訂單列表 ({totalOrders}筆記錄)</h4>

          {isLoading ? (
            <div className="py-8 text-center">載入中...</div>
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

export default function ListPage() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <ListContent />
    </Suspense>
  )
}
