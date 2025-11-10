import { OrderStateMap, type OrderState } from '@/constants'

export const OrderStateUtils = {
  getLabel: (status: OrderState) =>
    OrderStateMap[status]?.label || '待上傳素材',
  getColors: (status: OrderState) =>
    OrderStateMap[status]?.colors || { bg: 'bg-gray-3', text: 'text-gray-9', border: 'border-gray-3' },
  getBadgeVariant: (status: OrderState) => {
    return status.replace(/_/g, '-')
  },
  getAllOptions: () =>
    Object.entries(OrderStateMap).map(([value, info]) => ({
      value,
      label: info.label,
    })),
}
