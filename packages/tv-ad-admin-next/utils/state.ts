import { OrderStateMap, ORDER_STATE, type OrderState } from '@/constants'

/**
 * 如果 state 不在 OrderStateMap 中或是 null/undefined，則定義為 PENDING_UPLOAD
 */
export function normalizeOrderState(
  state: string | null | undefined
): OrderState {
  if (!state || !(state in OrderStateMap)) {
    return ORDER_STATE.PENDING_UPLOAD
  }
  return state as OrderState
}

export const OrderStateUtils = {
  getLabel: (status: OrderState) =>
    OrderStateMap[status]?.label || '待上傳素材',
  getColors: (status: OrderState) =>
    OrderStateMap[status]?.colors || { bg: 'gray', text: 'white' },
  getBadgeVariant: (status: OrderState) => {
    return status.replace(/_/g, '-')
  },
  getAllOptions: () =>
    Object.entries(OrderStateMap).map(([value, info]) => ({
      value,
      label: info.label,
    })),
}
