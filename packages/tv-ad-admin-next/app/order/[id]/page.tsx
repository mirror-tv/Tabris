'use client'

import { useParams } from 'next/navigation'

import { OrderActions } from '@/components/order/order-actions'
import { OrderDetails } from '@/components/order/order-details'
import { OrderNotFound } from '@/components/order/order-not-found'
import { OrderPreview } from '@/components/order/order-preview'
import { OrderState as OrderStateComponent } from '@/components/order/order-state'
import { TestModal } from '@/components/order/test-modal'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import { ORDER_STATE_CONFIG, ORDER_STYLES } from '@/constants'
import { ENV } from '@/constants/environment-variables'
import { type OrderRecordForList } from '@/graphql/queries/orders'
import { mockOrderData } from '@/mocks/mockData'

export default function OrderPage() {
  const params = useParams()
  const id = params?.id as string

  if (!id) {
    return <OrderNotFound orderId={undefined} />
  }

  const order = mockOrderData.find((o) => o.id === id)

  if (!order) {
    return <OrderNotFound orderId={id} />
  }

  const shouldShowPreview =
    ORDER_STATE_CONFIG.PREVIEW_REQUIRED_STATUSES.includes(
      order.state as (typeof ORDER_STATE_CONFIG.PREVIEW_REQUIRED_STATUSES)[number]
    )

  return (
    <div className={ORDER_STYLES.pageContainer}>
      <PageHeader title="訂單詳情" variant="default" />
      <PageMain className="py-5 md:py-10">
        <div className={ORDER_STYLES.contentContainer}>
          <div className={ORDER_STYLES.innerContainer}>
            <div className={ORDER_STYLES.layoutGrid}>
              <div className={`flex-1 ${ORDER_STYLES.sectionSpacing}`}>
                <OrderDetails order={order} />
                {shouldShowPreview && <OrderPreview order={order} />}
                <OrderActions order={order} />
              </div>
              {(() => {
                const orderForState: OrderRecordForList = {
                  id: Number(order.id),
                  orderNumber: order.orderNumber,
                  name: order.productName ?? null,
                  state: order.state as OrderRecordForList['state'],
                  scheduleStartDate: null,
                  scheduleEndDate: null,
                  scheduleStartDateString: undefined,
                  scheduleEndDateString: undefined,
                  createdAt: order.createdAt,
                  updatedAt: order.updatedAt,
                  relatedOrder: [],
                }
                return <OrderStateComponent order={orderForState} />
              })()}
            </div>
          </div>

          {(ENV === 'local' || ENV === 'dev') && (
            <TestModal
              orders={mockOrderData}
              onOrderSelect={(orderId) => {
                window.location.href = `/order/${orderId}`
              }}
              currentOrderId={id}
            />
          )}
        </div>
      </PageMain>
    </div>
  )
}
