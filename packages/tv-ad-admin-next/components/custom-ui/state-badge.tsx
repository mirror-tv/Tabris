import { Badge as BaseBadge } from '../ui/badge'

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
    <BaseBadge
      variant="outline"
      className={`${colors.bg} ${colors.text} ${colors.border} ${className}`}
    >
      {label}
    </BaseBadge>
  )
}
