import { type OrderState } from '@/constants'

export type OrderSchema = {
  id: string
  orderNumber: string | null
  name: string | null

  state: OrderState

  scheduleStartDate: string | null
  scheduleEndDate: string | null
  scheduleStartDateString?: string | null
  scheduleEndDateString?: string | null
  schedule?: string | null

  member?: {
    id: string
    firebaseID?: string | null
    email?: string | null
    state?: string | null
    name?: string | null
    mobile?: string | null
  } | null
  relatedOrder?: { id: string }[]

  attachment?: {
    id: string
    name?: string | null
    description?: string | null
    filename?: string | null
    filesize?: number | null
    url?: string | null
  } | null
  image?: {
    id: string
    name?: string | null
    filename?: string | null
    filesize?: number | null
    url?: string | null
    urlOriginal?: string | null
    width?: number | null
    height?: number | null
    extension?: 'jpg' | 'png' | 'webp' | 'gif' | null
  } | null
  demoImage?: {
    id: string
    name?: string | null
    filename?: string | null
    filesize?: number | null
    url?: string | null
    urlOriginal?: string | null
    width?: number | null
    height?: number | null
    extension?: 'jpg' | 'png' | 'webp' | 'gif' | null
  }[]

  paragraphOne?: string | null
  paragraphTwo?: string | null

  createdAt: string | null
  updatedAt: string | null

  nameEditable?: boolean
  scheduleEditable?: boolean
  paragraphOneEditable?: boolean
  paragraphTwoEditable?: boolean
  imageEditable?: boolean
}
