import { type ReactElement } from 'react'

import { OrderRow } from './order-row'

import { type OrderRecord } from '@/mocks/mockData'

interface OrderGroupProps {
  order: OrderRecord
  onViewOrder: (orderId: string) => void
}

function renderRelatedOrders(
  order: OrderRecord,
  onViewOrder: (orderId: string) => void
): ReactElement | null {
  if (!order.related) return null

  return (
    <>
      <OrderRow order={order.related} onViewOrder={onViewOrder} isRelated />
      {renderRelatedOrders(order.related, onViewOrder)}
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
