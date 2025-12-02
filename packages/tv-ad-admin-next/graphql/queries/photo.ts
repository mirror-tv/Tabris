import { gql } from '@apollo/client'

export const getOrderImageQuery = gql`
  query GetOrderImage($orderNumber: String!, $memberId: ID!) {
    orders(
      where: {
        orderNumber: { equals: $orderNumber }
        member: { id: { equals: $memberId } }
      }
    ) {
      id
      state
      member {
        id
      }
      image {
        id
      }
    }
  }
`
