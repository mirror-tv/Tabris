import ListContent from './list-content'

import { ErrorState } from '@/components/list/error-state'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import { getOrdersQuery } from '@/graphql/queries/orders'
import { type OrderRecordForList } from '@/types/order'
import { getClient } from '@/utils/apollo-client'
import { createErrorLogger } from '@/utils/error-handler'
import { groupOrders } from '@/utils/order-grouping'
export default async function ListPage() {
  let isError = false
  let initialOrders: OrderRecordForList[][] = []

  try {
    const client = getClient()
    const { data } = await client.query<{ orders: OrderRecordForList[] }>({
      query: getOrdersQuery,
      variables: {
        where: {},
        orderBy: [{ updatedAt: 'desc' }],
      },
    })

    const orders = data?.orders || []
    initialOrders = groupOrders(orders)
  } catch (error) {
    createErrorLogger('Failed to fetch orders list')(error)
    isError = true
  }

  return (
    <>
      <PageHeader title="訂單紀錄" />
      <PageMain className="py-5 md:py-10">
        {isError ? (
          <ErrorState />
        ) : (
          <ListContent initialOrders={initialOrders} />
        )}
      </PageMain>
    </>
  )
}
