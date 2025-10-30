import FileIcon from '@/assets/icons/file.svg'
import { type OrderState } from '@/constants'
import { OrderStateUtils } from '@/utils'

type EmptyStateProps = {
  searchKeyword: string
  OrderState: string
}

export function EmptyState({ searchKeyword, OrderState }: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <FileIcon className="mx-auto h-12 w-12 text-text-tertiary" />
      <h6 className="mt-4 text-text-primary">暫無訂單資料</h6>
      <p className="mt-2 text-sm text-text-secondary">
        搜尋條件：{searchKeyword ? `"${searchKeyword}"` : '無關鍵字'}
        {OrderState !== 'all' &&
          ` • ${OrderStateUtils.getLabel(OrderState as OrderState)}`}
      </p>
    </div>
  )
}
