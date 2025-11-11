'use client'

import { useEffect, useState, useMemo } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { OrderActions } from '@/components/order/order-actions'
import { OrderDetails } from '@/components/order/order-details'
import { OrderNotFound } from '@/components/order/order-not-found'
import { OrderPreview } from '@/components/order/order-preview'
import { OrderState as OrderStateComponent } from '@/components/order/order-state'
import LoadingSpinner from '@/components/shared/loading-spinner'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import { ORDER_STATE_CONFIG, ORDER_STYLES } from '@/constants'
import { type OrderRecordForOrderNumber } from '@/graphql/queries/orders'
import { handleUnauthorized } from '@/utils/handle-unauthorized'

export default function OrderPage() {
  const params = useParams()
  const router = useRouter()
  const orderNumber = params?.orderNumber as string
  const [order, setOrder] = useState<OrderRecordForOrderNumber | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!orderNumber) {
        setError('Order number is required')
        return
      }
      try {
        const res = await fetch(`/api/order/${orderNumber}`)
        if (!res.ok) {
          // 404 在這裡顯示錯誤訊息而不是重導向
          if (res.status === 404) {
            setError(`Order not found: ${orderNumber}`)
            return
          }
          if (res.status === 401) {
            await handleUnauthorized(router)
            return
          }
          throw new Error(
            `Failed to fetch order by order number: ${orderNumber}: ${res.statusText}`
          )
        }
        const data = await res.json()
        const order = data.orders[0]
        if (!order) {
          setError(`Order not found: ${orderNumber}`)
          return
        }
        setOrder(order)
        setError(null)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        setError(error instanceof Error ? error.message : '載入訂單失敗')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [orderNumber])

  const shouldShowPreview = useMemo(() => {
    if (!order) return false
    return ORDER_STATE_CONFIG.PREVIEW_REQUIRED_STATUSES.includes(
      order.state as (typeof ORDER_STATE_CONFIG.PREVIEW_REQUIRED_STATUSES)[number]
    )
  }, [order])

  return (
    <div className={ORDER_STYLES.pageContainer}>
      <PageHeader title="訂單詳情" variant="default" />
      <PageMain className="py-5 md:py-10">
        <div className={ORDER_STYLES.contentContainer}>
          <div className={ORDER_STYLES.innerContainer}>
            <div className={ORDER_STYLES.layoutGrid}>
              <div className={`flex-1 ${ORDER_STYLES.sectionSpacing}`}>
                {order && <OrderDetails order={order} />}
                {shouldShowPreview && order && <OrderPreview order={order} />}
                {order && <OrderActions order={order} />}
              </div>
              {order && <OrderStateComponent order={order} />}
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {isLoading && (
              <div className="flex min-h-[400px] items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
            {!error && !isLoading && !order && (
              <OrderNotFound orderId={orderNumber} />
            )}
          </div>
        </div>
      </PageMain>
    </div>
  )
}
