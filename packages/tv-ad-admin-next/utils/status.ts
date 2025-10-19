import { OrderStatusMap, type OrderStatus } from '@/constants'

export const OrderStatusUtils = {
  getLabel: (status: OrderStatus) => OrderStatusMap[status].label,
  getColors: (status: OrderStatus) => OrderStatusMap[status].colors,
  getBadgeVariant: (status: OrderStatus) => {
    return status.replace(/_/g, '-')
  },
  getAllOptions: () =>
    Object.entries(OrderStatusMap).map(([value, info]) => ({
      value,
      label: info.label,
    })),
}
