import { StateBadge } from '@/components/custom-ui/state-badge'
import { Button } from '@/components/ui/button'
import ArrowRightDownIcon from '@/public/icons/arrow-right-sown.svg'
import DetailIcon from '@/public/icons/detail.svg'
import { type OrderRecordForList } from '@/types/order'

type OrderRowProps = {
  order: OrderRecordForList
  onViewOrder: (orderId: number) => void
  isRelated?: boolean
}

const tdStyle = 'px-2 py-3 text-sm whitespace-nowrap'

export function OrderRow({
  order,
  onViewOrder,
  isRelated = false,
}: OrderRowProps) {
  const {
    state,
    updatedAt,
    name,
    orderNumber,
    scheduleStartDateString,
    scheduleEndDateString,
  } = order
  console.log(order)
  const rowContent = [
    {
      key: 'number',
      content: (
        <div className="flex items-center">
          {isRelated && (
            <ArrowRightDownIcon className="mr-2 h-4 w-4 text-gray-400" />
          )}
          # {orderNumber}
        </div>
      ),
    },
    { key: 'name', content: name || '-' },
    {
      key: 'broadcastDate',
      content: `${scheduleStartDateString} - ${scheduleEndDateString}`,
    },
    { key: 'state', content: <StateBadge state={state} /> },
    { key: 'updatedAt', content: updatedAt || '-' },
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
