import { useParams } from 'next/navigation'

import { OrderActions } from '@/components/order/order-actions'
import { OrderDetails } from '@/components/order/order-details'
import { OrderNotFound } from '@/components/order/order-not-found'
import { OrderPreview } from '@/components/order/order-preview'
import { OrderStatus as OrderStatusComponent } from '@/components/order/order-status'
import { TestModal } from '@/components/order/test-modal'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import { env } from '@/config/env'
import { ORDER_STATUS_CONFIG, ORDER_STYLES } from '@/constants'
import { mockOrderData } from '@/mocks/mockData'

export default function Order() {
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
    ORDER_STATUS_CONFIG.PREVIEW_REQUIRED_STATUSES.includes(
      order.status as (typeof ORDER_STATUS_CONFIG.PREVIEW_REQUIRED_STATUSES)[number]
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
              <OrderStatusComponent order={order} />
            </div>
          </div>

          {(env.ENV === 'local' || env.ENV === 'dev') && (
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
