import ArrowRightDownIcon from '@/assets/icons/arrow-right-sown.svg?react'
import DetailIcon from '@/assets/icons/detail.svg?react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { type OrderRecord } from '@/mocks/mockData'

interface OrderRowProps {
  order: OrderRecord
  onViewOrder: (orderId: string) => void
  isRelated?: boolean
}

export function OrderRow({
  order,
  onViewOrder,
  isRelated = false,
}: OrderRowProps) {
  return (
    <tr className={isRelated ? 'bg-gray-50' : ''}>
      <td className="px-2 py-3 text-sm whitespace-nowrap text-text-primary">
        <div className="flex items-center">
          {isRelated && (
            <ArrowRightDownIcon className="mr-2 h-4 w-4 text-gray-400" />
          )}
          {order.orderNumber}
        </div>
      </td>
      <td className="px-2 py-3 text-sm whitespace-nowrap text-text-primary">
        {order.productName}
      </td>
      <td className="px-2 py-3 text-sm whitespace-nowrap text-text-primary">
        {order.broadcastDate}
      </td>
      <td className="px-2 py-3 whitespace-nowrap">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-2 py-3 text-sm whitespace-nowrap text-text-primary">
        {order.lastUpdated}
      </td>
      <td className="px-2 py-3 text-sm whitespace-nowrap text-text-primary">
        <Button
          onClick={() => onViewOrder(order.id)}
          variant="ghost"
          size="sm"
          className="gap-1"
        >
          <DetailIcon className="h-4 w-4" />
          查看
        </Button>
      </td>
    </tr>
  )
}
