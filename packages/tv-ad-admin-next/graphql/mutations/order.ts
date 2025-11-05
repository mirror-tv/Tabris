import { gql } from '@apollo/client'

import { OrderSchema } from '@/types'

export type OrderRecordForUploadMutation = Pick<OrderSchema, 'orderNumber'> &
  Partial<
    Pick<
      OrderSchema,
      | 'id'
      | 'name'
      | 'paragraphOne'
      | 'paragraphTwo'
      | 'scheduleStartDate'
      | 'scheduleEndDate'
      | 'image'
      | 'state'
    >
  >

export const updateOrderForUploadSubmit = gql`
  mutation UpdateOrderForUploadSubmit(
    $where: OrderWhereUniqueInput!
    $data: OrderUpdateInput!
  ) {
    updateOrder(where: $where, data: $data) {
      id
      orderNumber
      name
      paragraphOne
      paragraphTwo
      scheduleStartDate
      scheduleEndDate
      image {
        id
        name
        imageFile {
          extension
        }
      }
      state
    }
  }
`
