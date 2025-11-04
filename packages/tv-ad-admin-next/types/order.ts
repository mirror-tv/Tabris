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
  id: string // GraphQL ID scalar，實際為字串
  orderNumber: string
  name: string | null

  state: OrderState

  scheduleStartDate: string | null // ISO 8601 日期字串或 null
  scheduleEndDate: string | null // ISO 8601 日期字串或 null
  scheduleStartDateString?: string | null // 前端格式化後的顯示字串（台灣日期格式）
  scheduleEndDateString?: string | null // 前端格式化後的顯示字串（台灣日期格式）
  // Keystone `schedule` field (free-text). Frontend may also derive start/end above.
  schedule?: string | null

  member?: {
    id: string
  } | null
  /**
   * 指向父訂單的引用陣列（訂單父子關係）
   *
   * 實際用途：
   * - 用於建立訂單之間的關聯關係（例如：原始訂單 → 修改訂單 → 再次修改訂單）
   * - 如果訂單有 relatedOrder，表示它是另一個訂單的「子訂單」
   * - 在業務邏輯中，通常只取第一個元素 `relatedOrder[0]?.id` 作為父訂單 ID
   * - 沒有 relatedOrder 或為空的訂單為「根訂單」
   *
   * 範例：
   * - 原始訂單：`relatedOrder: null` 或 `relatedOrder: []`（根訂單）
   * - 修改訂單：`relatedOrder: [{ id: "原始訂單ID" }]`（子訂單）
   *
   * 參考：`utils/order-grouping.ts` 中的訂單分組邏輯
   */
  relatedOrder?: { id: string }[]

  // 檔案相關欄位
  attachment?: {
    id: string
    filename?: string | null
    filesize?: number | null
    url?: string | null
  } | null
  
  paragraphOne?: string | null
  paragraphTwo?: string | null
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
