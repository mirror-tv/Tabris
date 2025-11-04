import { PhotoSchema } from './photo'

import { type OrderState } from '@/constants'


/**
 * Order 文件在 GraphQL schema 中的完整類型定義
 * 對應 Keystone CMS 的 Order model
 *
 * 注意：
 * - `id` 在 GraphQL 中為字串類型（GraphQL ID scalar）
 * - `scheduleStartDate` 和 `scheduleEndDate` 從 GraphQL 回傳為 ISO 8601 字串或 null
 * - `scheduleStartDateString` 和 `scheduleEndDateString` 為前端格式化後的顯示字串
 * - `*Editable` 欄位為前端狀態標記，不會從 GraphQL 回傳
 */
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
  image?: Partial<PhotoSchema> | null
  demoImage?: Partial<PhotoSchema>[]
  createdAt: string // ISO 8601 日期時間字串
  updatedAt: string // ISO 8601 日期時間字串
}
