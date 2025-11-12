import { Badge as BaseBadge } from '../ui/badge'

import { type OrderState } from '@/constants'
import { OrderStateUtils } from '@/utils'

type StateBadgeProps = {
  state: OrderState | 'urgent'
  className?: string
}

export function StateBadge({ state, className = '' }: StateBadgeProps) {
  const label = state === 'urgent' ? '急件' : OrderStateUtils.getLabel(state)
  const colors =
    state === 'urgent'
      ? { bg: 'bg-red-600', text: 'text-white', border: 'border-red-600' }
      : OrderStateUtils.getColors(state)

  return (
    <BaseBadge
      variant="outline"
      className={`${colors.bg} ${colors.text} ${colors.border} ${className}`}
    >
      {label}
    </BaseBadge>
  )
}
