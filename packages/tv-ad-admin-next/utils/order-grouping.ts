import { formatTaiwanDate } from './date'

import { OrderStateMap } from '@/constants'
import {
  type OrderRecordForList,
  type OrderRecordForDashboard,
} from '@/graphql/queries/orders'

type RelatedOrder = { id: string } | Array<{ id: string }>

/**
 * 將訂單分組並排序
 * 訂單之間有父子關係（透過 relatedOrder），將訂單分組顯示
 */
export function groupOrders(
  orders: OrderRecordForList[]
): OrderRecordForList[][] {
  const parentMap = new Map<string, OrderRecordForList[]>()

  // 建立父訂單到子訂單的映射
  for (const order of orders) {
    const related = order.relatedOrder as RelatedOrder | undefined

    // 處理陣列格式的 relatedOrder
    if (Array.isArray(related) && related.length > 0) {
      const parentId = related[0]?.id
      if (parentId) {
        if (!parentMap.has(parentId)) {
          parentMap.set(parentId, [])
        }
        parentMap.get(parentId)!.push(order)
      }
    }
  }

  const groupedOrders: OrderRecordForList[][] = []
  const processed: { [id: string]: boolean } = {}

  // 遞迴建立訂單鏈
  const buildChain = (
    order: OrderRecordForList,
    chain: OrderRecordForList[]
  ): OrderRecordForList[] => {
    if (processed[order.id]) return chain

    chain.push(order)
    processed[order.id] = true
    const children = parentMap.get(order.id) || ([] as OrderRecordForList[])

    for (const child of children) {
      if (!processed[child.id]) {
        buildChain(child, chain)
      }
    }
    return chain
  }

  // 找出所有根訂單並建立訂單鏈
  for (const order of orders) {
    if (processed[order.id]) continue

    const isRoot =
      !order.relatedOrder ||
      (Array.isArray(order.relatedOrder) && order.relatedOrder.length === 0) ||
      (typeof order.relatedOrder === 'object' &&
        Object.keys(order.relatedOrder).length === 0)

    if (isRoot) {
      const chain = buildChain(order, [])

      const formattedChain = chain.map((order) => ({
        ...order,
        createdAt: order.createdAt ? formatTaiwanDate(order.createdAt) : '',
        updatedAt: order.updatedAt ? formatTaiwanDate(order.updatedAt) : '',
      }))

      const rootOrder = formattedChain[0]
      const childOrders = formattedChain.slice(1)

      // 子訂單排序：非「已轉移」的排在前面，全部按 createdAt 從新到舊
      childOrders.sort((a, b) => {
        const isTransferredA = a.state === 'transferred'
        const isTransferredB = b.state === 'transferred'

        // 非「已轉移」的排在前面
        if (isTransferredA && !isTransferredB) return 1
        if (!isTransferredA && isTransferredB) return -1

        // 其餘按 createdAt 從新到舊排序
        const dateA = a.createdAt ?? ''
        const dateB = b.createdAt ?? ''
        return new Date(dateB).getTime() - new Date(dateA).getTime()
      })

      const sortedChain = [rootOrder, ...childOrders]
      groupedOrders.push(sortedChain)
    }
  }

  // 按群組中第一筆訂單的 updatedAt 從新到舊排序
  groupedOrders.sort((a, b) => {
    const firstA = a[0]
    const firstB = b[0]
    const dateA = firstA.updatedAt ?? ''
    const dateB = firstB.updatedAt ?? ''
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })

  return groupedOrders
}

export function getOrdersState(
  orders: OrderRecordForDashboard[]
): { state: keyof typeof OrderStateMap; count: number }[] {
  const stateCount = orders.reduce(
    (acc, order) => {
      acc[order.state] = (acc[order.state] || 0) + 1
      return acc
    },
    {} as Partial<Record<keyof typeof OrderStateMap, number>>
  )

  return Object.entries(stateCount).map(([state, count]) => ({
    state: state as keyof typeof OrderStateMap,
    count: count,
  }))
}
