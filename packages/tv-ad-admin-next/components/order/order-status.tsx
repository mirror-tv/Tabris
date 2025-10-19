import { ProgressSteps } from './progress-steps'

import { type OrderRecord } from '@/mocks/mockData'

type OrderStatusProps = {
  order: OrderRecord
  className?: string
}

const labelClassName = 'text-sm font-medium text-text-secondary'
const valueClassName = 'text-base font-normal text-text-primary'

export function OrderStatus({ order, className = '' }: OrderStatusProps) {
  return (
    <div className={`w-full space-y-6 md:max-w-none xl:max-w-60 ${className}`}>
      <div className="w-full rounded-lg border border-border-default bg-surface-primary p-6">
        <h4 className="mb-4 text-text-primary">訂單資訊與狀態</h4>

        <div className="md:flex md:gap-6 xl:flex-col xl:gap-0">
          <div className="md:flex-1">
            <div className="space-y-3">
              <div>
                <label className={labelClassName}>訂單編號</label>
                <p className={valueClassName}>{order.orderNumber}</p>
              </div>
              <div>
                <label className={labelClassName}>建立日期</label>
                <p className={valueClassName}>2024-12-02</p>
              </div>
              <div>
                <label className={labelClassName}>最後更新</label>
                <p className={valueClassName}>{order.lastUpdated}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-border-default pt-6 md:mt-0 md:flex-1 md:border-t-0 md:pt-0 xl:mt-6 xl:border-t xl:pt-6">
            <ProgressSteps currentStatus={order.status} />
          </div>
        </div>
      </div>
    </div>
  )
}
