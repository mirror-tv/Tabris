import { type OrderState } from '@/constants'

export type OrderRecord = {
  id: string
  orderNumber: string
  name: string
  schedule: string
  state: OrderState
  relatedOrder?: OrderRecord
  createdAt: string
  updatedAt: string
}

export type OrderRecordForList = Pick<
  OrderRecord,
  | 'id'
  | 'orderNumber'
  | 'name'
  | 'state'
  | 'schedule'
  | 'createdAt'
  | 'updatedAt'
> & {
  relatedOrder?: { id: string }
}
