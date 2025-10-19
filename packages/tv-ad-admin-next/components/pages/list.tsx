import { useState, useMemo, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { EmptyState } from '@/components/list/empty-state'
import { OrderTable } from '@/components/list/order-table'
import { SearchAndFilter } from '@/components/list/search-and-filter'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import { mockOrderData } from '@/mocks/mockData'
import { filterOrders } from '@/utils'

export default function List() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [orderStatus, setOrderStatus] = useState<string>('all')

  const filteredOrders = useMemo(() => {
    return filterOrders(mockOrderData, searchKeyword, orderStatus)
  }, [searchKeyword, orderStatus])

  useEffect(() => {
    if (status) {
      setOrderStatus(status)
    }
  }, [status])

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
          orderStatus={orderStatus}
          onStatusChange={setOrderStatus}
        />

        <div className="mb-6 flex flex-col gap-6 rounded-xl border border-border-default bg-surface-primary p-6">
          <h4 className="text-text-primary">
            訂單列表 ({filteredOrders.length}筆記錄)
          </h4>

          {!filteredOrders.length ? (
            <EmptyState
              searchKeyword={searchKeyword}
              orderStatus={orderStatus}
            />
          ) : (
            <OrderTable orders={filteredOrders} onViewOrder={handleViewOrder} />
          )}
        </div>
      </PageMain>
    </>
  )
}
