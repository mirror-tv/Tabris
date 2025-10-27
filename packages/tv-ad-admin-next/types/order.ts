import { type OrderStatus } from '@/constants'

export type OrderRecord = {
  id: string
  orderNumber: string
  productName: string
  broadcastDate: string
  state: OrderStatus
  lastUpdated: string
  relatedOrder?: OrderRecord
  createdAt: string
  updatedAt: string
}

// List 頁面只需要這些欄位（對應 GraphQL query 實際返回的欄位）
export type OrderRecordForList = Pick<
  OrderRecord,
  'id' | 'state' | 'createdAt' | 'updatedAt'
> & {
  relatedOrder?: Pick<OrderRecord, 'id'>
}
