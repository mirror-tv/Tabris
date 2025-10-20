import { TestModal } from './test-modal'

import PageHeader from '@/components/shared/page-header'
import { mockOrderData } from '@/mocks/mockData'

type OrderNotFoundProps = {
  orderId?: string
  className?: string
}

export function OrderNotFound({ orderId, className = '' }: OrderNotFoundProps) {
  return (
    <div className={`min-h-screen bg-gray-1 ${className}`}>
      <PageHeader title="訂單詳情" />
      <div className="container mx-auto max-w-200 px-4 py-8">
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4 text-gray-9">訂單不存在</h2>
            <p className="typography-body2 mb-6 text-gray-6">
              {orderId
                ? `找不到指定的訂單 ID: ${orderId}`
                : '請選擇一個有效的訂單'}
            </p>
            <button
              onClick={() => (window.location.href = '/order')}
              className="inline-flex items-center rounded-lg bg-blue-6 px-4 py-2 text-white transition-colors hover:bg-blue-7"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              回到訂單列表
            </button>
          </div>
        </div>
      </div>

      {!orderId && (
        <TestModal
          orders={mockOrderData}
          onOrderSelect={(orderId) => {
            window.location.href = `/order/${orderId}`
          }}
          currentOrderId={undefined}
        />
      )}
    </div>
  )
}
