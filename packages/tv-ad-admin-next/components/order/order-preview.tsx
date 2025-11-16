import { useMemo } from 'react'

import { ProductionPreview } from './production-preview'
import { RelatedDocuments } from './related-documents'
import { Instructions } from '../shared/instructions'

import { ORDER_STATE, ORDER_STYLES } from '@/constants'
import { type OrderRecordForOrderNumber } from '@/graphql/queries/orders'
import { formatTaiwanDate } from '@/utils/date'
import { normalizeOrderState } from '@/utils/state'

type OrderPreviewProps = {
  order: OrderRecordForOrderNumber
  className?: string
}

export function OrderPreview({ order, className = '' }: OrderPreviewProps) {
  const normalizedState = normalizeOrderState(order.state)
  const deadline = useMemo(() => {
    return order.scheduleConfirmDeadline
      ? formatTaiwanDate(order.scheduleConfirmDeadline)
      : formatTaiwanDate(new Date())
  }, [order.scheduleConfirmDeadline])
  return (
    <section
      className={`${ORDER_STYLES.sectionSpacing} ${ORDER_STYLES.card} ${className}`}
    >
      <ProductionPreview order={order} />
      <hr className="my-6 border-gray-3" />
      {order.attachment && <RelatedDocuments attachment={order.attachment} />}
      {normalizedState === ORDER_STATE.PENDING_BROADCAST_DATE && (
        <Instructions
          wordings={[
            `由於您未在 ${deadline} 23:59前完成確認，原始排播日期已作廢，請重新設定`,
          ]}
        />
      )}
      {normalizedState === ORDER_STATE.PENDING_CONFIRMATION && (
        <Instructions
          title="說明"
          wordings={[
            `確認無誤，請於 ${deadline} 23:59 前，於下方訂單操作區點選「確認」按鈕`,
            '如需修改，請點選「提出修改」按鈕',
            `若操作未在 ${deadline} 23:59 前完成，原始排播日期將會作廢，需重新設定`,
          ]}
          isDot
        />
      )}
    </section>
  )
}
