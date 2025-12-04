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

const TAIPEI_HOLIDAY_API_BASE_URL =
  'https://data.taipei/api/v1/dataset/0dcbcfcf-f7a1-4664-a810-82c01cb524e0'

/**
 * 生成指定年度的周六周日假日資料（fallback）
 * 格式：YYYYMMDD
 */
function generateWeekendHolidays(year: number): HolidayData[] {
  const holidays: HolidayData[] = []
  const startDate = new Date(year, 0, 1) // 該年度第一天
  const endDate = new Date(year, 11, 31) // 該年度最後一天

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dayOfWeek = date.getDay() // 0 = 周日, 6 = 周六
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      const yearStr = String(date.getFullYear())
      const monthStr = String(date.getMonth() + 1).padStart(2, '0')
      const dayStr = String(date.getDate()).padStart(2, '0')
      holidays.push({
        date: `${yearStr}${monthStr}${dayStr}`,
        isholiday: '是',
      })
    }
  }

  return holidays
}

async function fetchHolidayData(year: number): Promise<HolidayData[]> {
  // 在客戶端使用 API 路由來避免 CORS 問題
  if (typeof window !== 'undefined') {
    try {
      // 檢查 URL 參數是否有 debug=time
      const urlParams = new URLSearchParams(window.location.search)
      const isDebugMode = urlParams.get('debug') === 'time'
      const apiUrl = isDebugMode
        ? `/api/holidays/${year}/full?debug=time`
        : `/api/holidays/${year}/full`

      if (isDebugMode) {
        console.info(
          `[DEBUG MODE] 使用 debug=time 模式取得 ${year} 年的假日資料，將模擬無法取得政府日曆 API 的情況`
        )
      }

      const response = await fetch(apiUrl)
      if (!response.ok) {
        // API 請求失敗（HTTP 錯誤），使用 fallback
        console.warn(
          `無法取得 ${year} 年的政府放假日資料（HTTP ${response.status}），使用周六周日作為 fallback`
        )
        return generateWeekendHolidays(year)
      }
      const result = await response.json()
      // 如果 API 返回錯誤，使用 fallback
      if (result.error) {
        console.warn(
          `無法取得 ${year} 年的政府放假日資料（API 錯誤），使用周六周日作為 fallback`
        )
        return generateWeekendHolidays(year)
      }
      // 如果沒有資料，可能是政府還沒釋出，返回空陣列（不使用 fallback）
      if (!result.data || result.data.length === 0) {
        console.info(`${year} 年的政府放假日資料尚未釋出，不顯示假日標記`)
        return []
      }
      return result.data || []
    } catch (error) {
      // 網路錯誤或其他異常，使用 fallback
      console.error('Failed to fetch holidays from API:', error)
      console.warn(
        `無法取得 ${year} 年的政府放假日資料（網路錯誤），使用周六周日作為 fallback`
      )
      return generateWeekendHolidays(year)
    }
  }

  // 伺服器端直接呼叫外部 API
  try {
    const url = `${TAIPEI_HOLIDAY_API_BASE_URL}?scope=resourceAquire&q=date ${year}&limit=365`

    const response = await fetch(url)

    if (!response.ok) {
      // API 請求失敗（HTTP 錯誤），使用 fallback
      console.warn(
        `無法取得 ${year} 年的政府放假日資料（HTTP ${response.status}），使用周六周日作為 fallback`
      )
      return generateWeekendHolidays(year)
    }

    const data = await response.json()
    const holidayData = data.result?.results || []

    // 如果沒有資料，可能是政府還沒釋出，返回空陣列（不使用 fallback）
    if (holidayData.length === 0) {
      console.info(`${year} 年的政府放假日資料尚未釋出，不顯示假日標記`)
      return []
    }

    return holidayData
  } catch (error) {
    // 網路錯誤或其他異常，使用 fallback
    console.error('Failed to fetch holidays from API:', error)
    console.warn(
      `無法取得 ${year} 年的政府放假日資料（網路錯誤），使用周六周日作為 fallback`
    )
    return generateWeekendHolidays(year)
  }
}

export async function getAllHolidaysForYear(year: number): Promise<string[]> {
  // 使用 fetchHolidayData 獲取完整數據，然後過濾出假日
  const holidayData = await fetchHolidayData(year)
  return holidayData
    .filter((item) => item.isholiday === '是')
    .map((item) => item.date)
}

/**
 * 取得指定年度的完整工作天/非工作天行事曆資料
 * 用於判斷是否應該開放到該年度年底的日期選擇
 * 如果該年度還沒有資料，返回 null
 *
 * 檢查標準：
 * - 資料筆數必須 >= 200（一年約 365 天，200 筆以上才視為有完整年度資料）
 * - 必須包含該年度的資料（檢查日期格式是否為該年度）
 */
export async function getYearData(year: number): Promise<HolidayData[] | null> {
  try {
    const holidayData = await fetchHolidayData(year)

    // 如果沒有資料，返回 null
    if (holidayData.length === 0) {
      return null
    }

    // 檢查資料筆數是否足夠（一年約 365 天，至少要有 200 筆才視為完整年度資料）
    if (holidayData.length < 200) {
      return null
    }

    // 檢查資料是否確實屬於該年度（檢查前幾筆和後幾筆資料的年份）
    const firstDate = holidayData[0]?.date
    const lastDate = holidayData[holidayData.length - 1]?.date

    if (firstDate && lastDate) {
      const firstYear = parseInt(firstDate.substring(0, 4))
      const lastYear = parseInt(lastDate.substring(0, 4))

      // 如果資料的年份範圍不包含目標年份，視為沒有該年度的資料
      if (firstYear > year || lastYear < year) {
        return null
      }
    }

    return holidayData
  } catch (error) {
    return null
  }
}
