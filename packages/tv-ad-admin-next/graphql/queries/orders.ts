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
  | 'isUrgent'
  | 'needsModification'
> & {
  parentOrder?: { id: OrderSchema['id'] }
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
      parentOrder {
        id
      }
      isUrgent
      needsModification
    }
  }
`

export type OrderRecordForDashboard = Pick<
  OrderSchema,
  'id' | 'state' | 'updatedAt' | 'needsModification'
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
      needsModification
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
  | 'attachment'
  | 'demoImage'
  | 'videoDuration'
  | 'scheduleConfirmDeadline'
  | 'isUrgent'
>

export const getOrdersByOrderNumberQuery = gql`
  query getOrdersByOrderNumber($where: OrderWhereInput!) {
    orders(where: $where) {
      id
      orderNumber
      name
      state
      scheduleStartDate
      scheduleEndDate
      scheduleConfirmDeadline
      paragraphOne
      paragraphTwo
      createdAt
      updatedAt
      videoDuration
      isUrgent
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

export type OrderRecordForUploadQuery = Pick<
  OrderSchema,
  | 'id'
  | 'name'
  | 'member'
  | 'scheduleStartDate'
  | 'scheduleEndDate'
  | 'scheduleStartDateString'
  | 'scheduleEndDateString'
  | 'schedule'
  | 'paragraphOne'
  | 'paragraphTwo'
  | 'image'
  | 'state'
  | 'isUrgent'
  | 'isReviewed'
  | 'needsModification'
  | 'price'
> & {
  orderNumber: string
}

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
      price
      member {
        id
      }
      scheduleStartDate
      scheduleEndDate
      paragraphOne
      paragraphTwo
      image {
        id
        url
        name
        imageFile {
          extension
        }
      }
      state
      isUrgent
      needsModification
      isReviewed
    }
  }
`

export type OrderRecordForEdit = Pick<
  OrderSchema,
  | 'id'
  | 'orderNumber'
  | 'name'
  | 'state'
  | 'scheduleStartDate'
  | 'scheduleEndDate'
  | 'scheduleStartDateString'
  | 'scheduleEndDateString'
  | 'isUrgent'
>

export const getOrderForEditQuery = gql`
  query getOrderForEdit($where: OrderWhereInput!) {
    orders(where: $where) {
      id
      orderNumber
      name
      state
      scheduleStartDate
      scheduleEndDate
      isUrgent
    }
  }
`
