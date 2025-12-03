import { NextRequest, NextResponse } from 'next/server'

const TAIPEI_HOLIDAY_API_BASE_URL =
  'https://data.taipei/api/v1/dataset/0dcbcfcf-f7a1-4664-a810-82c01cb524e0'

type HolidayData = {
  date: string
  isholiday: '是' | '否'
  name?: string
  [key: string]: unknown
}

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

export async function GET(
  req: NextRequest,
  { params }: { params: { year: string } }
) {
  const { year } = params

  if (!year) {
    return NextResponse.json({ error: 'Year is required' }, { status: 400 })
  }

  const yearNum = parseInt(year, 10)
  if (isNaN(yearNum)) {
    return NextResponse.json({ error: 'Invalid year' }, { status: 400 })
  }

  // 檢查是否有 debug=time 參數，如果有則模擬"打不到政府日曆"的狀況
  const searchParams = req.nextUrl.searchParams
  const isDebugMode = searchParams.get('debug') === 'time'

  if (isDebugMode) {
    // Debug 模式：模擬政府日曆 API 無法取得的情況，使用周六周日作為 fallback
    console.info(
      `[DEBUG MODE] 模擬無法取得 ${year} 年的政府放假日資料，使用周六周日作為 fallback`
    )
    const fallbackData = generateWeekendHolidays(yearNum)
    return NextResponse.json({ data: fallbackData })
  }

  try {
    const url = `${TAIPEI_HOLIDAY_API_BASE_URL}?scope=resourceAquire&q=date ${year}&limit=365`

    const response = await fetch(url)

    if (!response.ok) {
      // API 請求失敗（HTTP 錯誤），使用 fallback
      console.warn(
        `無法取得 ${year} 年的政府放假日資料（HTTP ${response.status}），使用周六周日作為 fallback`
      )
      const fallbackData = generateWeekendHolidays(yearNum)
      return NextResponse.json({ data: fallbackData })
    }

    const data = await response.json()
    const holidayData: HolidayData[] = data.result?.results || []

    // 如果沒有資料，可能是政府還沒釋出，返回空陣列（不使用 fallback）
    if (holidayData.length === 0) {
      console.info(`${year} 年的政府放假日資料尚未釋出，不顯示假日標記`)
      return NextResponse.json({ data: [] })
    }

    return NextResponse.json({ data: holidayData })
  } catch (error) {
    // 網路錯誤或其他異常，使用 fallback
    console.error('Failed to fetch holidays:', error)
    console.warn(
      `無法取得 ${year} 年的政府放假日資料（網路錯誤），使用周六周日作為 fallback`
    )
    const fallbackData = generateWeekendHolidays(yearNum)
    return NextResponse.json({ data: fallbackData })
  }
}
