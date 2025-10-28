import { OrderGroup } from '@/components/list/order-group'
import { type OrderRecord, type OrderRecordForList } from '@/types/order'

const TABLE_HEADER_CLASS =
  'p-2 text-left text-sm tracking-wide text-text-primary uppercase'

type OrderTableProps =
  | {
      orders: OrderRecord[]
      onViewOrder: (orderId: string) => void
    }
  | {
      orders: OrderRecordForList[][]
      onViewOrder: (orderId: string) => void
    }

export function OrderTable({ orders, onViewOrder }: OrderTableProps) {
  // Check if it's a 2D array
  const isTwoDimensional = orders.length > 0 && Array.isArray(orders[0])

  if (isTwoDimensional) {
    const twoDOrders = orders as OrderRecordForList[][]
    return (
      <div className="w-full overflow-x-scroll">
        <table className="min-w-full divide-y divide-border-default">
          <thead>
            <tr>
              <th className={TABLE_HEADER_CLASS}>訂單編號</th>
              <th className={TABLE_HEADER_CLASS}>商品名稱</th>
              <th className={TABLE_HEADER_CLASS}>排播日期</th>
              <th className={TABLE_HEADER_CLASS}>狀態</th>
              <th className={TABLE_HEADER_CLASS}>最後更新</th>
              <th className={TABLE_HEADER_CLASS}>操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default bg-surface-primary">
            {twoDOrders.map((orderGroup, index) =>
              orderGroup.map((order) => (
                <OrderGroup
                  key={order.id || `${index}-${order.state}`}
                  order={order as OrderRecord}
                  onViewOrder={onViewOrder}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    )
  }

  // It's a 1D array
  const oneDOrders = orders as OrderRecord[]
  return (
    <div className="w-full overflow-x-scroll">
      <table className="min-w-full divide-y divide-border-default">
        <thead>
          <tr>
            <th className={TABLE_HEADER_CLASS}>訂單編號</th>
            <th className={TABLE_HEADER_CLASS}>商品名稱</th>
            <th className={TABLE_HEADER_CLASS}>排播日期</th>
            <th className={TABLE_HEADER_CLASS}>狀態</th>
            <th className={TABLE_HEADER_CLASS}>最後更新</th>
            <th className={TABLE_HEADER_CLASS}>操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default bg-surface-primary">
          {oneDOrders.map((order) => (
            <OrderGroup
              key={order.id}
              order={order}
              onViewOrder={onViewOrder}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
