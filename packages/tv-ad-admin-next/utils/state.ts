import { OrderStateMap, type OrderState } from '@/constants'

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
