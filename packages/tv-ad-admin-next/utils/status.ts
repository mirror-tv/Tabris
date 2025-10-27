import { OrderStatusMap, type OrderStatus } from '@/constants'

export const OrderStatusUtils = {
  getLabel: (status: OrderStatus) =>
    OrderStatusMap[status]?.label || '待上傳素材',
  getColors: (status: OrderStatus) =>
    OrderStatusMap[status]?.colors || { bg: 'gray', text: 'white' },
  getBadgeVariant: (status: OrderStatus) => {
    return status.replace(/_/g, '-')
  },
  getAllOptions: () =>
    Object.entries(OrderStatusMap).map(([value, info]) => ({
      value,
      label: info.label,
    })),
}
