import { type OrderState } from '@/constants'

export type OrderRecord = {
  id: string
  orderNumber: string
  name: string
  scheduleStartDate: string
  scheduleEndDate: string
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
  | 'scheduleStartDate'
  | 'scheduleEndDate'
  | 'createdAt'
  | 'updatedAt'
> & {
  relatedOrder?: { id: string }
}
