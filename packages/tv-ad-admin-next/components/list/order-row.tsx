import ArrowRightDownIcon from '@/assets/icons/arrow-right-sown.svg'
import DetailIcon from '@/assets/icons/detail.svg'
import { Button } from '@/components/ui/button'
import { StateBadge } from '@/components/ui/state-badge'
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
          # {order.id}
        </div>
      </td>
      <td className="px-2 py-3 text-sm whitespace-nowrap text-text-primary">
        未命名商品
      </td>
      <td className="px-2 py-3 text-sm whitespace-nowrap text-text-primary">
        待排播日期
      </td>
      <td className="px-2 py-3 whitespace-nowrap">
        <StateBadge state={order.state} />
      </td>
      <td className="px-2 py-3 text-sm whitespace-nowrap text-text-primary">
        {order.updatedAt}
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
