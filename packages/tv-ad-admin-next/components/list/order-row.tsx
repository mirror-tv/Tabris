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

const tdStyle = 'px-2 py-3 text-sm whitespace-nowrap'

export function OrderRow({
  order,
  onViewOrder,
  isRelated = false,
}: OrderRowProps) {
  const { id, state, updatedAt } = order
  const rowContent = [
    {
      key: 'number',
      content: (
        <div className="flex items-center">
          {isRelated && (
            <ArrowRightDownIcon className="mr-2 h-4 w-4 text-gray-400" />
          )}
          # {id}
        </div>
      ),
    },
    { key: 'name', content: `未命名` },
    { key: 'broadcastDate', content: `未排播` },
    { key: 'state', content: <StateBadge state={state} /> },
    { key: 'updatedAt', content: updatedAt || `未更新` },
    {
      key: 'moreBtn',
      content: (
        <Button onClick={() => onViewOrder(order.id)} variant="outline">
          <DetailIcon className="h-4 w-4" />
          查看
        </Button>
      ),
    },
  ]

  return (
    <tr className={isRelated ? 'bg-gray-50' : ''}>
      {rowContent.map((item) => (
        <td key={item.key} className={tdStyle}>
          {item.content}
        </td>
      ))}
    </tr>
  )
}
