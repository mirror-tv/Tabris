import { formatTaiwanDate } from './date'

import { type OrderRecordForList } from '@/types/order'

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
    const children = parentMap.get(order.id) || []

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
        updatedAt: order.updatedAt
          ? formatTaiwanDate(order.updatedAt)
          : order.createdAt
            ? formatTaiwanDate(order.createdAt)
            : '',
        createdAt: formatTaiwanDate(order.createdAt),
      }))

      const rootOrder = formattedChain[0]
      const childOrders = formattedChain.slice(1)

      // 子訂單按時間從舊到新排序
      childOrders.sort((a, b) => {
        const dateA = a.updatedAt || a.createdAt || ''
        const dateB = b.updatedAt || b.createdAt || ''
        return new Date(dateA).getTime() - new Date(dateB).getTime()
      })

      const sortedChain = [rootOrder, ...childOrders]
      groupedOrders.push(sortedChain)
    }
  }

  // 按群組中最新的訂單時間從新到舊排序
  groupedOrders.sort((a, b) => {
    const latestA = a[a.length - 1]
    const latestB = b[b.length - 1]
    const dateA = latestA.updatedAt || latestA.createdAt || ''
    const dateB = latestB.updatedAt || latestB.createdAt || ''
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })

  return groupedOrders
}
