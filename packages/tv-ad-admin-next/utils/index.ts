import { type OrderStatus } from '../constants'
import { type OrderRecord } from '../mocks/mockData'

function filterOrders(
  orders: OrderRecord[],
  searchKeyword: string,
  status: string
): OrderRecord[] {
  return orders.filter((order) => {
    const matchesKeyword =
      searchKeyword === '' ||
      order.productName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchKeyword.toLowerCase())

    const matchesStatus = status === 'all' ? true : order.status === status

    return matchesKeyword && matchesStatus
  })
}

function getStatusStats(orders: OrderRecord[]) {
  const total = orders.length
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<OrderStatus, number>)

  return { total, statusCounts }
}

// Local exports — domain-related helpers
export { filterOrders, getStatusStats }

// Re-exports — generic shared utilities
export * from './cn'
export * from './devLog'
export * from './status'
