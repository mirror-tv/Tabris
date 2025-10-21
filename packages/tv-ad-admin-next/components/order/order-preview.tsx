import { ProductionPreview } from './production-preview'
import { RelatedDocuments } from './related-documents'
import { Instructions } from '../shared/instructions'

import { ORDER_STATUS, ORDER_STYLES } from '@/constants'
import { type OrderRecord } from '@/mocks/mockData'

type OrderPreviewProps = {
  order: OrderRecord
  className?: string
}

export function OrderPreview({ order, className = '' }: OrderPreviewProps) {
  return (
    <section
      className={`${ORDER_STYLES.sectionSpacing} ${ORDER_STYLES.card} ${className}`}
    >
      <ProductionPreview />
      <hr className="my-6 border-gray-3" />
      <RelatedDocuments />
      {order.status === ORDER_STATUS.PENDING_BROADCAST_DATE && (
        <Instructions
          wordings={[
            '由於您未在 9/21 23:59 前完成確認，原始排播日期已作廢，請重新設定',
          ]}
        />
      )}
      {order.status === ORDER_STATUS.PENDING_BROADCAST_DATE && (
        <Instructions
          title="說明"
          wordings={[
            '確認無誤，請於9/21 23:59前，於下方訂單操作區點選「確認」按鈕',
            '如需修改，請點選「提出修改」按鈕',
            '若操作未在9/21 23:59前完成，原始排播日期將會作廢，需重新設定',
          ]}
          isDot
        />
      )}
    </section>
  )
}
