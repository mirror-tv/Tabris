import FileIcon from '@/assets/icons/file.svg?react'
import { type OrderStatus } from '@/constants'
import { OrderStatusUtils } from '@/utils'

type EmptyStateProps = {
  searchKeyword: string
  orderStatus: string
}

export function EmptyState({ searchKeyword, orderStatus }: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <FileIcon className="mx-auto h-12 w-12 text-text-tertiary" />
      <h6 className="mt-4 text-text-primary">暫無訂單資料</h6>
      <p className="mt-2 text-sm text-text-secondary">
        搜尋條件：{searchKeyword ? `"${searchKeyword}"` : '無關鍵字'}
        {orderStatus !== 'all' &&
          ` • ${OrderStatusUtils.getLabel(orderStatus as OrderStatus)}`}
      </p>
    </div>
  )
}
