import { gql } from '@apollo/client'

export const getOrdersQuery = gql`
  query getOrders($where: OrderWhereInput, $orderBy: [OrderOrderByInput!]) {
    orders(where: $where, orderBy: $orderBy) {
      id
      orderNumber
      name
      state
      schedule
      createdAt
      updatedAt
      relatedOrder {
        id
      }
    }
  }
`
