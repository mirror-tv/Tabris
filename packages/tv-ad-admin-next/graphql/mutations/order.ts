import { gql } from '@apollo/client'

import { OrderSchema } from '@/types'
import { PhotoSchema } from '@/types/photo'

export type OrderRecordForUploadMutation = Pick<
  OrderSchema,
  'orderNumber' | 'state'
> &
  Partial<
    Pick<
      OrderSchema,
      | 'id'
      | 'name'
      | 'paragraphOne'
      | 'paragraphTwo'
      | 'scheduleStartDate'
      | 'scheduleEndDate'
    > & {
      image?:
        | (Partial<PhotoSchema> & { data?: File | null })
        | { data: File | null }
        | null
    }
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
