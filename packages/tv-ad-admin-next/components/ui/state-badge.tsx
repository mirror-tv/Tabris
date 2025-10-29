import { Badge } from './badge'

import { type OrderState } from '@/constants'
import { OrderStateUtils } from '@/utils'

type StateBadgeProps = {
  state: OrderState
  className?: string
}

export function StateBadge({ state, className = '' }: StateBadgeProps) {
  const label = OrderStateUtils.getLabel(state)
  const colors = OrderStateUtils.getColors(state)

  return (
    <Badge
      variant="outline"
      className={`${colors.bg} ${colors.text} ${colors.border} ${className}`}
    >
      {label}
    </Badge>
  )
}
