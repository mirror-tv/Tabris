import { OrderRow } from './order-row'

import { type OrderRecordForList } from '@/types/order'

type OrderGroupProps = {
  orders: OrderRecordForList[]
  onViewOrder: (orderId: string) => void
}

export function OrderGroup({ orders, onViewOrder }: OrderGroupProps) {
  if (!orders?.length) return null

  return (
    <>
      <OrderRow order={orders[0]} onViewOrder={onViewOrder} />
      {orders.slice(1).map((order) => (
        <OrderRow
          key={order.id}
          order={order}
          onViewOrder={onViewOrder}
          isRelated
        />
      ))}
    </>
  )
}
