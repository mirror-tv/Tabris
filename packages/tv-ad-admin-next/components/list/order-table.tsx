import { OrderGroup } from '@/components/list/order-group'
import { type OrderRecordForList } from '@/types/order'

const TABLE_HEADER_CLASS =
  'p-2 text-left text-sm tracking-wide text-text-primary uppercase'

type OrderTableProps = {
  orders: OrderRecordForList[][]
  onViewOrder: (orderId: string) => void
}

const tableHeader = [
  { key: 'number', label: '訂單編號' },
  { key: 'name', label: '廣告名稱' },
  { key: 'broadcastDate', label: '排播日期' },
  { key: 'state', label: '狀態' },
  { key: 'updatedAt', label: '最後更新' },
  { key: 'moreBtn', label: '操作' },
]

export function OrderTable({ orders, onViewOrder }: OrderTableProps) {
  return (
    <div className="w-full overflow-x-scroll">
      <table className="min-w-full divide-y divide-border-default">
        <thead>
          <tr>
            {tableHeader.map((header) => (
              <th key={header.key} className={TABLE_HEADER_CLASS}>
                {header.label}
              </th>
            ))}
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
