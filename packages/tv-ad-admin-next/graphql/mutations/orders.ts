import { gql } from '@apollo/client'

export const updateOrderScheduleMutation = gql`
  mutation updateOrderSchedule(
    $where: OrderWhereUniqueInput!
    $data: OrderUpdateInput!
  ) {
    updateOrder(where: $where, data: $data) {
      id
      orderNumber
      scheduleStartDate
      scheduleEndDate
    }
  }
`

export const updateOrderEditRequestMutation = gql`
  mutation updateOrderEditRequest(
    $where: OrderWhereUniqueInput!
    $data: OrderUpdateInput!
  ) {
    updateOrder(where: $where, data: $data) {
      member {
        id
      }
      orderNumber
      state
    }
  }
`

export const updateOrderStateMutation = gql`
  mutation updateOrderState(
    $where: OrderWhereUniqueInput!
    $data: OrderUpdateInput!
  ) {
    updateOrder(where: $where, data: $data) {
      id
      state
    }
  }
`
