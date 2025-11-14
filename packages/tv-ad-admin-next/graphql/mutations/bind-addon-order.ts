import { gql } from '@apollo/client'

export const createOrderFromAddonMutation = gql`
  mutation CreateOrderFromAddon($data: OrderCreateInput!) {
    createOrder(data: $data) {
      id
      orderNumber
      name
      state
      scheduleStartDate
      scheduleEndDate
      paragraphOne
      paragraphTwo
      isUrgent
      member {
        id
      }
      relatedOrder {
        id
      }
    }
  }
`

export const updateOrderRelationMutation = gql`
  mutation UpdateOrderRelation(
    $where: OrderWhereUniqueInput!
    $data: OrderUpdateInput!
  ) {
    updateOrder(where: $where, data: $data) {
      id
      orderNumber
      state
      relatedOrder {
        id
      }
    }
  }
`
