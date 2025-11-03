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
      paragraphOne
      paragraphTwo
      createdAt
      updatedAt
    }
  }
`
