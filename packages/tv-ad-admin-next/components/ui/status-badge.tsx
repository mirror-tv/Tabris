import { Badge } from './badge'

import { type OrderState } from '@/constants'
import { OrderStateUtils } from '@/utils'

type StatusBadgeProps = {
  status: OrderState
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const label = OrderStateUtils.getLabel(status)
  const colors = OrderStateUtils.getColors(status)

  return (
    <Badge
      variant="outline"
      className={`${colors.bg} ${colors.text} ${colors.border} ${className}`}
    >
      {label}
    </Badge>
  )
}
