'use client'

import { Suspense, useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { OrderTable } from '@/components/list/order-table'
import { SearchAndFilter } from '@/components/list/search-and-filter'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import { type OrderState } from '@/constants'
import { type OrderRecordForList } from '@/types/order'

function ListContent() {
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [orderState, setOrderState] = useState<OrderState | 'all'>('all')
  const [orders, setOrders] = useState<OrderRecordForList[][]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/list/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.error('Failed to fetch orders:', err))
      .finally(() => setIsLoading(false))
    setIsLoading(false)
  }, [])

  const handleViewOrder = (orderId: string) => {
    router.push(`/order/${orderId}`)
  }

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
          <h4 className="text-text-primary">
            訂單列表 ({orders.flat().length}筆記錄)
          </h4>

          {isLoading ? (
            <div className="py-8 text-center">載入中...</div>
          ) : !orders.flat().length ? (
            <div className="py-8 text-center text-gray-6">沒有訂單資料</div>
          ) : (
            <OrderTable orders={orders} onViewOrder={handleViewOrder} />
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
