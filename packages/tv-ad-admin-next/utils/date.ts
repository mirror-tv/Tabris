/**
 * 將 UTC 時間轉換為台灣時間
 * @param dateString - ISO 日期字串
 * @returns 台灣時間的 Date 物件
 */
export function toTaiwanTime(
  dateString: string | Date | null | undefined
): Date | null {
  if (!dateString) return null
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }))
}

/**
 * 將日期格式化為 YYYY/MM/DD 格式
 * @param dateString - ISO 日期字串或 Date 物件
 * @returns 格式化的日期字串，例如 "2025/12/25"，或空字串
 */
export function formatTaiwanDate(
  dateString: string | Date | null | undefined
): string {
  const date = toTaiwanTime(dateString)
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}
