'use client'

import { useState, useMemo, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { OrderTable } from '@/components/list/order-table'
import { SearchAndFilter } from '@/components/list/search-and-filter'
import { type OrderState } from '@/constants'
import { type OrderRecordForList } from '@/graphql/queries/orders'
import { normalizeOrderState } from '@/utils/state'

export default function ListContent({
  initialOrders,
}: {
  initialOrders: OrderRecordForList[][]
}) {
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [orderState, setOrderState] = useState<string>('all')

  const handleViewOrder = useCallback(
    (orderId: string) => {
      router.push(`/order/${orderId}`)
    },
    [router]
  )

  const filteredOrders = useMemo(() => {
    return initialOrders
      .map((group) => {
        if (orderState !== 'all') {
          group = group.filter((order) => {
            const normalizedState = normalizeOrderState(order.state)
            return normalizedState === orderState
          })
        }
        if (searchKeyword) {
          const keyword = searchKeyword.toLowerCase()
          group = group.filter((order) =>
            order.id.toLowerCase().includes(keyword)
          )
        }
        return group
      })
      .filter((group) => group.length > 0)
  }, [initialOrders, orderState, searchKeyword])

  return (
    <>
      <SearchAndFilter
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        orderState={orderState as OrderState | 'all'}
        onStateChange={setOrderState as (value: OrderState | 'all') => void}
      />

      <div className="mb-6 flex flex-col gap-6 rounded-xl border border-border-default bg-surface-primary p-6">
        <h4 className="text-text-primary">
          訂單列表 ({filteredOrders.flat().length}筆記錄)
        </h4>

        <OrderTable orders={filteredOrders} onViewOrder={handleViewOrder} />
      </div>
    </>
  )
}
