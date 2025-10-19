import { StatusBadge } from '@/components/ui/status-badge'
import { OrderStatusMap, ORDER_STATUS } from '@/constants'
import { type OrderRecord } from '@/mocks/mockData'

type OrderCardProps = {
  order: OrderRecord
  className?: string
}

export function OrderCard({ order, className = '' }: OrderCardProps) {
  const statusConfig = OrderStatusMap[order.status]
  const colors = statusConfig.colors

  return (
    <div
      className={`relative overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${colors.border} ${className}`}
    >
      {/* Status indicator dot */}
      <div
        className={`absolute top-3 right-3 h-2 w-2 rounded-full ${colors.dot}`}
      />

      {/* Order header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h5 className="mb-1 text-gray-9">{order.productName}</h5>
          <p className="typography-caption1 text-gray-6">{order.orderNumber}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Order details */}
      <div className="space-y-2">
        <div className="typography-caption1 flex items-center justify-between">
          <span className="text-gray-6">播出日期</span>
          <span className="text-gray-8">{order.broadcastDate}</span>
        </div>
        <div className="typography-caption1 flex items-center justify-between">
          <span className="text-gray-6">最後更新</span>
          <span className="text-gray-8">{order.lastUpdated}</span>
        </div>
      </div>

      {/* Action buttons for certain statuses */}
      {order.status === ORDER_STATUS.PENDING_CONFIRMATION && (
        <div className="mt-4 flex gap-2">
          <button className="typography-caption1 flex-1 rounded-md bg-red-6 px-3 py-2 text-white transition-colors hover:bg-red-7">
            確認
          </button>
          <button className="typography-caption1 flex-1 rounded-md border border-gray-3 px-3 py-2 text-gray-8 transition-colors hover:bg-gray-1">
            修改
          </button>
        </div>
      )}

      {order.status === ORDER_STATUS.PENDING_QUOTE_CONFIRMATION && (
        <div className="mt-4">
          <div className="rounded-md bg-red-1 p-3">
            <p className="typography-caption1 font-medium text-red-9">
              修改報價：NT$ 15,000
            </p>
          </div>
        </div>
      )}

      {/* Image placeholder for certain statuses */}
      {(order.status === ORDER_STATUS.PENDING_CONFIRMATION ||
        order.status === ORDER_STATUS.PENDING_SCHEDULE ||
        order.status === ORDER_STATUS.PENDING_QUOTE_CONFIRMATION ||
        order.status === ORDER_STATUS.MODIFICATION_REQUEST ||
        order.status === ORDER_STATUS.PENDING_BROADCAST_DATE) && (
        <div className="mt-4">
          <div className="flex aspect-video w-full items-center justify-center rounded-md bg-gray-1">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-3">
                <svg
                  className="h-6 w-6 text-gray-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="typography-caption2 text-gray-6">預覽圖</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
