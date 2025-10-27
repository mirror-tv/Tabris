import ArrowRightDownIcon from '@/assets/icons/arrow-right-sown.svg'
import DetailIcon from '@/assets/icons/detail.svg'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { type OrderRecordForList } from '@/types/order'

type OrderRowProps = {
  order: OrderRecordForList
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
          #{order.id}
        </div>
      </td>
      <td className="px-2 py-3 text-sm whitespace-nowrap text-text-primary">
        未命名
        {/* {order.id || `未命名`} */}
      </td>
      <td className="px-2 py-3 text-sm whitespace-nowrap text-text-primary">
        未排播
        {/* {formatTaiwanDate(order.broadcastDate) || `未排播`} */}
      </td>
      <td className="px-2 py-3 whitespace-nowrap">
        <StatusBadge status={order.state} />
      </td>
      <td className="px-2 py-3 text-sm whitespace-nowrap text-text-primary">
        {order.updatedAt || order.createdAt || `未更新`}
      </td>
      <td className="px-2 py-3 text-sm whitespace-nowrap text-text-primary">
        <Button onClick={() => onViewOrder(order.id)} variant="outline">
          <DetailIcon className="h-4 w-4" />
          查看
        </Button>
      </td>
    </tr>
  )
}
