import { OrderGroup } from '@/components/list/order-group'
import { type OrderRecordForList } from '@/types/order'

const TABLE_HEADER_CLASS =
  'p-2 text-left text-sm tracking-wide text-text-primary uppercase'

type OrderTableProps = {
  orders: OrderRecordForList[][]
  onViewOrder: (orderId: string) => void
}

export function OrderTable({ orders, onViewOrder }: OrderTableProps) {
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
          {orders.map((orderGroup) => (
            <OrderGroup
              key={orderGroup[0].id}
              orders={orderGroup}
              onViewOrder={onViewOrder}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
