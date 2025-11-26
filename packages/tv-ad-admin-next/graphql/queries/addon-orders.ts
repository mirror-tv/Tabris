import { gql } from '@apollo/client'

import { OrderSchema } from '@/types/order'

export type AddonOrderQuery = Pick<
  OrderSchema,
  | 'id'
  | 'orderNumber'
  | 'name'
  | 'state'
  | 'price'
  | 'isUrgent'
  | 'needsModification'
  | 'isReviewed'
  | 'createdAt'
> & {
  member?: { id: string; email?: string; name?: string }
  parentOrder?: { id: string }
}

export const getAddonOrdersQuery = gql`
  query getAddonOrders(
    $where: OrderWhereInput
    $orderBy: [OrderOrderByInput!]
  ) {
    orders(where: $where, orderBy: $orderBy) {
      id
      orderNumber
      name
      state
      price
      isUrgent
      needsModification
      isReviewed
      createdAt
      member {
        id
        email
        name
      }
      parentOrder {
        id
      }
    }
  }
`
