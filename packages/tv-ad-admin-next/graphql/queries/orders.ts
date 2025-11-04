import { gql } from '@apollo/client'

import { OrderSchema } from '@/types/order'

export type OrderRecordForList = Pick<
  OrderSchema,
  | 'id'
  | 'orderNumber'
  | 'name'
  | 'state'
  | 'scheduleStartDate'
  | 'scheduleEndDate'
  | 'scheduleStartDateString'
  | 'scheduleEndDateString'
  | 'createdAt'
  | 'updatedAt'
> & {
  relatedOrder?: { id: OrderSchema['id'] }[]
}

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

export type OrderRecordForDashboard = Pick<
  OrderSchema,
  'id' | 'state' | 'updatedAt'
>

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

export type OrderRecordForOrderNumber = Pick<
  OrderSchema,
  | 'id'
  | 'orderNumber'
  | 'name'
  | 'state'
  | 'scheduleStartDate'
  | 'scheduleEndDate'
  | 'scheduleStartDateString'
  | 'scheduleEndDateString'
  | 'paragraphOne'
  | 'paragraphTwo'
  | 'createdAt'
  | 'updatedAt'
> & {
  attachment?:
    | (Pick<NonNullable<OrderSchema['attachment']>, 'id' | 'url' | 'name'> & {
        file?: {
          filename: string
          filesize: number
        } | null
      })
    | null
  demoImage?: (Pick<
    NonNullable<NonNullable<OrderSchema['demoImage']>[number]>,
    'id' | 'url'
  > & {
    imageFile?: {
      width: number
      height: number
    } | null
  })[]
}

export const getOrdersByOrderNumberQuery = gql`
  query getOrdersByOrderNumber($where: OrderWhereInput!) {
    orders(where: $where) {
      id
      orderNumber
      name
      state
      scheduleStartDate
      scheduleEndDate
      paragraphOne
      paragraphTwo
      createdAt
      updatedAt
      attachment {
        id
        url
        name
        file {
          filename
          filesize
        }
      }
      demoImage {
        id
        url
        imageFile {
          width
          height
        }
      }
    }
  }
`
/**
 * Order type used in the upload page, containing all fields required for uploading ad materials.
 */

export type OrderRecordForUpload = Pick<
  OrderSchema,
  | 'id'
  | 'orderNumber'
  | 'name'
  | 'member'
  | 'nameEditable'
  | 'scheduleStartDate'
  | 'scheduleEndDate'
  | 'scheduleStartDateString'
  | 'scheduleEndDateString'
  | 'schedule'
  | 'scheduleEditable'
  | 'paragraphOne'
  | 'paragraphOneEditable'
  | 'paragraphTwo'
  | 'paragraphTwoEditable'
  | 'image'
  | 'imageEditable'
  | 'state'
>

/**
 * Retrieves the list of orders related to ad material uploads, with optional filtering by member.
 */
export const getOrdersForUpload = gql`
  query getOrdersForUpload(
    $where: OrderWhereInput
    $orderBy: [OrderOrderByInput!]
  ) {
    orders(where: $where, orderBy: $orderBy) {
      id
      orderNumber
      name
      nameEditable
      member {
        id
      }
      scheduleStartDate
      scheduleEndDate
      scheduleEditable
      paragraphOne
      paragraphOneEditable
      paragraphTwo
      paragraphTwoEditable
      image {
        id
        url
        name
        imageFile {
          extension
        }
      }
      imageEditable
      state
    }
  }
`
