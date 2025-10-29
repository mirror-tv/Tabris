import { gql } from '@apollo/client'

export const getOrdersQuery = gql`
  query getOrders($where: OrderWhereInput, $orderBy: [OrderOrderByInput!]) {
    orders(where: $where, orderBy: $orderBy) {
      id
      orderNumber
      name
      state
      scheduleStartDate
      scheduleEndDate
      createdAt
      updatedAt
      relatedOrder {
        id
      }
    }
  }
`

export const getOrdersStateQuery = gql`
  query getOrdersState(
    $where: OrderWhereInput
    $orderBy: [OrderOrderByInput!]
  ) {
    orders(where: $where, orderBy: $orderBy) {
      id
      state
      updatedAt
    }
  }
`
