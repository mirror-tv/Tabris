import { gql } from '@apollo/client'

export const getOrdersQuery = gql`
  query getOrders($where: OrderWhereInput, $orderBy: [OrderOrderByInput!]) {
    orders(where: $where, orderBy: $orderBy) {
      id
      state
      createdAt
      updatedAt
      relatedOrder {
        id
      }
    }
  }
`
