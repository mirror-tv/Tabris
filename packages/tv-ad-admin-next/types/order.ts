import { type OrderState } from '@/constants'

export type OrderRecord = {
  id: string
  orderNumber: string
  productName: string
  broadcastDate: string
  state: OrderState
  relatedOrder?: OrderRecord
  createdAt: string
  updatedAt: string
}

export type OrderRecordForList = Pick<
  OrderRecord,
  'id' | 'orderNumber' | 'state' | 'createdAt' | 'updatedAt'
> & {
  relatedOrder?: OrderRecordForList
}
