import { parseISO } from 'date-fns'

/**
 * Convert UTC time to Taiwan time (+8 hours)
 * 將 UTC 時間轉換為台灣時間（+8 小時）
 * Returns a Date object representing Taiwan time in UTC
 */
export function toTaiwanTime(
  dateInput: string | Date | null | undefined
): Date | null {
  if (!dateInput) return null

  // Parse string into Date object if necessary
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput

  // Get UTC time in milliseconds and add 8 hours for Taiwan time
  const utcTime = date.getTime()
  const taiwanTime = utcTime + 8 * 60 * 60 * 1000 // Add 8 hours in milliseconds

  // Create a new Date object (this will be displayed in local timezone when formatted)
  // But we'll use UTC methods to extract components for Taiwan time
  return new Date(taiwanTime)
}

/**
 * Format date as YYYY/MM/DD (Taiwan timezone)
 * 將日期格式化為 YYYY/MM/DD（台灣時區）
 * Uses UTC methods to format Taiwan time correctly regardless of local timezone
 */
export function formatTaiwanDate(
  dateInput: string | Date | null | undefined,
  rule: string = 'yyyy/MM/dd'
): string {
  if (!dateInput) return ''

  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput
  const taiwanDate = new Date(date.getTime() + 8 * 60 * 60 * 1000)

  // Extract components using UTC methods (Taiwan time = UTC + 8 hours)
  const components = {
    yyyy: String(taiwanDate.getUTCFullYear()),
    MM: String(taiwanDate.getUTCMonth() + 1).padStart(2, '0'),
    dd: String(taiwanDate.getUTCDate()).padStart(2, '0'),
    HH: String(taiwanDate.getUTCHours()).padStart(2, '0'),
    mm: String(taiwanDate.getUTCMinutes()).padStart(2, '0'),
    ss: String(taiwanDate.getUTCSeconds()).padStart(2, '0'),
  }

  // Replace time components first (to avoid MM/mm conflict), then date components
  return rule
    .replace(/yyyy/g, components.yyyy)
    .replace(/HH/g, components.HH)
    .replace(/mm/g, components.mm) // Replace minutes before month
    .replace(/ss/g, components.ss)
    .replace(/MM/g, components.MM) // Replace month after minutes
    .replace(/dd/g, components.dd)
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
