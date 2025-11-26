import { StateBadge } from '@/components/custom-ui/state-badge'
import { Button } from '@/components/ui/button'
import { type OrderRecordForList } from '@/graphql/queries/orders'
import ArrowRightDownIcon from '@/public/icons/arrow-right-sown.svg'
import DetailIcon from '@/public/icons/detail.svg'

type OrderRowProps = {
  order: OrderRecordForList
  onViewOrder: (orderNumber: string) => void
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
    {
      key: 'state',
      content: (
        <div className="flex items-center gap-1">
          <StateBadge state={state} />
          {order.isUrgent && <StateBadge state="urgent" />}
        </div>
      ),
    },
    { key: 'updatedAt', content: updatedAt || '-' },
    {
      key: 'moreBtn',
      content: (
        <Button
          onClick={() => {
            if (order.orderNumber) {
              onViewOrder(order.orderNumber)
            }
          }}
          variant="outline"
          disabled={!order.orderNumber}
        >
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
