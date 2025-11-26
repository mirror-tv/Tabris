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
      parentOrder {
        id
      }
    }
  }
`
