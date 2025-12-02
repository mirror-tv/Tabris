import { NextRequest, NextResponse } from 'next/server'

const TAIPEI_HOLIDAY_API_BASE_URL =
  'https://data.taipei/api/v1/dataset/0dcbcfcf-f7a1-4664-a810-82c01cb524e0'

type HolidayData = {
  date: string
  isholiday: '是' | '否'
  name?: string
  [key: string]: unknown
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { year: string } }
) {
  const { year } = params

  if (!year) {
    return NextResponse.json({ error: 'Year is required' }, { status: 400 })
  }

  try {
    const url = `${TAIPEI_HOLIDAY_API_BASE_URL}?scope=resourceAquire&q=date ${year}&limit=365`

    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch holiday data: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const holidayData: HolidayData[] = data.result?.results || []

    return NextResponse.json({ data: holidayData })
  } catch (error) {
    console.error('Failed to fetch holidays:', error)
    return NextResponse.json(
      { error: 'Failed to fetch holidays' },
      { status: 500 }
    )
  }
}
