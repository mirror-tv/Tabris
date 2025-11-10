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
  scheduleConfirmDeadline?: string | null
  schedule?: string | null

  member?: MemberSchema | null
  relatedOrder?: { id: string }[]

  attachment?: AttachmentSchema | null
  image?: ImageSchema | null
  demoImage?: ImageSchema | null

  paragraphOne?: string | null
  paragraphTwo?: string | null

  createdAt: string | null
  updatedAt: string | null

  nameEditable?: boolean
  scheduleEditable?: boolean
  paragraphOneEditable?: boolean
  paragraphTwoEditable?: boolean
  imageEditable?: boolean

  price?: number | null
  videoDuration?: number | null
}

export type MemberSchema = {
  id: string
  firebaseID?: string | null
  email?: string | null
  state?: string | null
  name?: string | null
  mobile?: string | null
}

export type AttachmentSchema = {
  id: string
  name?: string | null
  url?: string | null
  file?: {
    filename: string
    filesize: number
  } | null
}

export type ImageSchema = {
  id: string
  name?: string | null
  url?: string | null
  imageFile?: {
    width: number
    height: number
    extension?: string | null
  } | null
}
