import { gql } from '@apollo/client'

export const getOrderImageQuery = gql`
  query GetOrderImage($orderNumber: String!) {
    orders(where: { orderNumber: { equals: $orderNumber } }) {
      id
      image {
        id
      }
    }
  }
`
