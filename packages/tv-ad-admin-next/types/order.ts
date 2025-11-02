import { PhotoSchema } from './photo'

import { type OrderState } from '@/constants'


export type OrderSchema = {
  id: number
  orderNumber: string
  name: string | null
  nameEditable?: boolean
  member?: { id: string } | null
  scheduleStartDate: Date | null
  scheduleEndDate: Date | null
  scheduleStartDateString?: string | null
  scheduleEndDateString?: string | null
  // Keystone `schedule` field (free-text). Frontend may also derive start/end above.
  schedule?: string | null
  scheduleEditable?: boolean
  state: OrderState
  // Keystone `relatedOrder` is many=true
  relatedOrder?: { id: string }[]
  attachment?: { id: string } | null
  paragraphOne?: string | null
  paragraphOneEditable?: boolean
  paragraphTwo?: string | null
  paragraphTwoEditable?: boolean
  image?: Pick<PhotoSchema, 'id'> | null
  imageEditable?: boolean
  demoImage?: Pick<PhotoSchema, 'id'>[]
  createdAt: string
  updatedAt: string
}
