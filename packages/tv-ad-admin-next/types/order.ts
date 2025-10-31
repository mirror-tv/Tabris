import { type OrderState } from '@/constants'

export type OrderRecord = {
  id: number
  orderNumber: string
  name: string | null
  scheduleStartDate: Date | null
  scheduleEndDate: Date | null
  scheduleStartDateString?: string | null
  scheduleEndDateString?: string | null
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
  | 'scheduleStartDateString'
  | 'scheduleEndDateString'
  | 'createdAt'
  | 'updatedAt'
> & {
  relatedOrder?: { id: string }
}
