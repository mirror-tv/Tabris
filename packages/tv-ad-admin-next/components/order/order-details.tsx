import { orderLabels } from '@/constants'
import { type OrderRecordForOrderNumber } from '@/graphql/queries/orders'

type OrderDetailsProps = {
  order: OrderRecordForOrderNumber
  className?: string
}

const labelStyles = 'typography-caption1 text-text-secondary'
const valueStyles = 'typography-body2 text-text-primary'

export function OrderDetails({ order, className = '' }: OrderDetailsProps) {
  return (
    <section
      className={`rounded-lg border border-gray-3 bg-white p-6 ${className}`}
    >
      <h4 className="mb-4 text-text-primary">{orderLabels.orderData}</h4>
      <div className="space-y-3">
        <div>
          <label className={labelStyles}>{orderLabels.adName}</label>
          <p className={valueStyles}>{order.name || '-'}</p>
        </div>
        <div>
          <label className={labelStyles}>{orderLabels.broadcastDate}</label>
          <p className={valueStyles}>
            {order.scheduleStartDateString || ''} -{' '}
            {order.scheduleEndDateString || ''}
          </p>
        </div>
        <div>
          <label className={labelStyles}>{orderLabels.textMaterial1}</label>
          <p className={valueStyles}>{order.paragraphOne || '-'}</p>
        </div>
        <div>
          <label className={labelStyles}>{orderLabels.textMaterial2}</label>
          <p className={valueStyles}>{order.paragraphTwo || '-'}</p>
        </div>
      </div>
    </section>
  )
}
