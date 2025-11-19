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
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput

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

type HolidayData = {
  date: string
  isholiday: '是' | '否'
  name?: string
  [key: string]: unknown
}

async function fetchHolidayData(year: number): Promise<HolidayData[]> {
  // 在客戶端使用 API 路由來避免 CORS 問題
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch(`/api/holidays/${year}/full`)
      if (!response.ok) {
        throw new Error(`Failed to fetch holiday data: ${response.statusText}`)
      }
      const result = await response.json()
      return result.data || []
    } catch (error) {
      console.error('Failed to fetch holidays from API:', error)
      throw error
    }
  }

  // 伺服器端直接呼叫外部 API
  const url = `https://data.taipei/api/v1/dataset/0dcbcfcf-f7a1-4664-a810-82c01cb524e0?scope=resourceAquire&q=date ${year}&limit=365`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch holiday data: ${response.statusText}`)
  }

  const data = await response.json()

  return data.result?.results || []
}

export async function getAllHolidaysForYear(year: number): Promise<string[]> {
  // 使用 fetchHolidayData 獲取完整數據，然後過濾出假日
  const holidayData = await fetchHolidayData(year)
  return holidayData
    .filter((item) => item.isholiday === '是')
    .map((item) => item.date)
}
