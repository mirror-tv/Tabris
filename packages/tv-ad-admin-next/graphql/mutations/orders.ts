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
