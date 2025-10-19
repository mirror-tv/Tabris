import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { StatusBadge } from '@/components/ui/status-badge'
import { OrderStatusMap } from '@/constants'
import { type OrderRecord } from '@/mocks/mockData'

type TestModalProps = {
  orders: OrderRecord[]
  onOrderSelect: (orderId: string) => void
  currentOrderId?: string
}

export function TestModal({
  orders,
  onOrderSelect,
  currentOrderId,
}: TestModalProps) {
  const handleOrderClick = (orderId: string) => {
    onOrderSelect(orderId)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed top-1/2 right-4 z-50 -translate-y-1/2 rounded-full bg-white shadow-lg hover:bg-gray-1"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <span className="ml-2 hidden sm:inline">測試模式</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="typography-h4 font-semibold text-gray-9">
            選擇測試訂單
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="typography-caption1 text-gray-6">
            選擇要查看的訂單詳情，系統會顯示該訂單的詳細資訊
          </p>

          <div className="grid max-h-96 gap-2 overflow-y-auto">
            {orders.map((order) => {
              const statusConfig = OrderStatusMap[order.status]
              const isSelected = currentOrderId === order.id

              return (
                <button
                  key={order.id}
                  onClick={() => handleOrderClick(order.id)}
                  className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-blue-6 bg-blue-1'
                      : 'border-gray-3 bg-white hover:bg-gray-1'
                  } `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${statusConfig.colors.dot}`}
                    />
                    <div>
                      <p
                        className={`typography-caption1 font-medium ${
                          isSelected ? 'text-blue-9' : 'text-gray-9'
                        }`}
                      >
                        {order.productName}
                      </p>
                      <p
                        className={`typography-caption2 ${
                          isSelected ? 'text-blue-7' : 'text-gray-6'
                        }`}
                      >
                        {order.orderNumber} • {order.broadcastDate}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={order.status} />

                  {isSelected && (
                    <div className="ml-2">
                      <svg
                        className="h-4 w-4 text-blue-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => handleOrderClick('1')}
              className="w-full"
            >
              重置為預設訂單
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
