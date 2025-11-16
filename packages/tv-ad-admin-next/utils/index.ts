import { type OrderState } from '../constants'
import { normalizeOrderState } from './state'
import { type OrderRecord } from '../mocks/mockData'

function filterOrders(
  orders: OrderRecord[],
  searchKeyword: string,
  state: string
): OrderRecord[] {
  return orders.filter((order) => {
    const matchesKeyword =
      searchKeyword === '' ||
      order.productName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchKeyword.toLowerCase())

    const normalizedState = normalizeOrderState(order.state)
    const matchesStatus = state === 'all' ? true : normalizedState === state

    return matchesKeyword && matchesStatus
  })
}

function getStateGroups(orders: OrderRecord[]) {
  const total = orders.length
  const stateCounts = orders.reduce(
    (acc, order) => {
      const normalizedState = normalizeOrderState(order.state)
      acc[normalizedState] = (acc[normalizedState] || 0) + 1
      return acc
    },
    {} as Partial<Record<OrderState, number>>
  )

  return { total, stateCounts }
}

// Local exports — domain-related helpers
export { filterOrders, getStateGroups }

// Re-exports — generic shared utilities
export * from './cn'
export * from './devLog'
export * from './state'
export * from './date'
export * from './order-grouping'
