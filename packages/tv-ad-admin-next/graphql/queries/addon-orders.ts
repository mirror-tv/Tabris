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
  | 'paragraphOne'
  | 'paragraphTwo'
  | 'scheduleStartDate'
  | 'scheduleEndDate'
> & {
  member?: { id: string; email?: string; name?: string }
  parentOrder?: { id: string }
  image?: { id: string; name?: string }
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
      paragraphOne
      paragraphTwo
      scheduleStartDate
      scheduleEndDate
      member {
        id
        email
        name
      }
      parentOrder {
        id
      }
      image {
        id
        name
      }
    }
  }
`
