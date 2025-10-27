import { type ReactElement } from 'react'

import { OrderRow } from './order-row'

import { type OrderRecord } from '@/types/order'

type OrderGroupProps = {
  order: OrderRecord
  onViewOrder: (orderId: string) => void
}

function renderRelatedOrders(
  order: OrderRecord,
  onViewOrder: (orderId: string) => void
): ReactElement | null {
  if (!order.relatedOrder) return null

  return (
    <>
      <OrderRow
        order={order.relatedOrder}
        onViewOrder={onViewOrder}
        isRelated
      />
      {renderRelatedOrders(order.relatedOrder, onViewOrder)}
    </>
  )
}

export function OrderGroup({ order, onViewOrder }: OrderGroupProps) {
  return (
    <>
      <OrderRow order={order} onViewOrder={onViewOrder} />
      {renderRelatedOrders(order, onViewOrder)}
    </>
  )
}
