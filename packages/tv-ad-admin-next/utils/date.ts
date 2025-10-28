import { parseISO, addHours, format } from 'date-fns'

/**
 * Convert UTC time to Taiwan time (+8 hours)
 * 將 UTC 時間轉換為台灣時間（+8 小時）
 */
export function toTaiwanTime(
  dateInput: string | Date | null | undefined
): Date | null {
  if (!dateInput) return null

  // Parse string into Date object if necessary
  const date =
    typeof dateInput === 'string' ? parseISO(dateInput) : dateInput

  // Taiwan is UTC+8, so add 8 hours to UTC time
  return addHours(date, 8)
}

/**
 * Format date as YYYY/MM/DD (Taiwan timezone)
 * 將日期格式化為 YYYY/MM/DD（台灣時區）
 */
export function formatTaiwanDate(
  dateInput: string | Date | null | undefined
): string {
  const date = toTaiwanTime(dateInput)
  if (!date) return ''
  return format(date, 'yyyy/MM/dd')
}
