import { type ReactElement } from 'react'

import { OrderRow } from './order-row'

import { type OrderRecordForList } from '@/types/order'

type OrderGroupProps = {
  order: OrderRecordForList
  onViewOrder: (orderId: string) => void
}

function renderRelatedOrders(
  order: OrderRecordForList,
  onViewOrder: (orderId: string) => void
): ReactElement | null {
  if (!order.relatedOrder) return null

  return (
    <>
      <OrderRow
        order={order.relatedOrder as OrderRecordForList}
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
      <OrderRow order={order as OrderRecordForList} onViewOrder={onViewOrder} />
      {renderRelatedOrders(order, onViewOrder)}
    </>
  )
}
