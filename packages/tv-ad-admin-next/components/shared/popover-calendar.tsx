'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

import { addDays, format, startOfToday } from 'date-fns'
import { zhTW } from 'date-fns/locale/zh-TW'
import { DayButton } from 'react-day-picker'

import { ErrorMessage } from '../custom-ui/error-message'
import { LabeledField } from '../custom-ui/labeled-field'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

import type { DateRange } from 'react-day-picker'

import { Calendar, CalendarDayButton } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { layout } from '@/constants'
import CalendarIcon from '@/public/icons/calender.svg'
import { cn, getAllHolidaysForYear } from '@/utils'

function parseDateString(dateStr: string): Date {
  const year = parseInt(dateStr.substring(0, 4))
  const month = parseInt(dateStr.substring(4, 6)) - 1
  const day = parseInt(dateStr.substring(6, 8))
  return new Date(year, month, day, 12, 0, 0)
}

function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

type PopoverCalendarProps = {
  range: DateRange | undefined
  setRange: (range: DateRange | undefined) => void
  error?: string | null
  disabled?: boolean
  minOffsetDays?: number
  minWorkingDays?: number
  isLoading?: boolean
  className?: string
}

const calendarId = 'schedule'

export default function PopoverCalendar({
  range,
  setRange,
  error,
  disabled = false,
  minOffsetDays = 0,
  minWorkingDays,
  isLoading = false,
  className,
  ...props
}: PopoverCalendarProps) {
  // 使用 useMemo 穩定 today 的值，避免每次渲染都建立新物件
  const today = useMemo(() => startOfToday(), [])
  const dateFormat = 'yyyy/M/d'
  const [holidayDates, setHolidayDates] = useState<Date[]>([])
  const isLoadingRef = useRef(false)
  // 初始值：如果有 minWorkingDays，先設定為保守值（至少幾天後，會在 useEffect 中更新為正確的工作日）
  // 如果沒有，使用 minOffsetDays
  const [minDate, setMinDate] = useState<Date>(() => {
    if (minWorkingDays !== undefined && minWorkingDays > 0) {
      // 保守估計：至少是 minWorkingDays * 2 天後（考慮週末和假日）
      return addDays(startOfToday(), minWorkingDays * 2)
    }
    return addDays(startOfToday(), minOffsetDays)
  })

  const hasValue = !!(range?.from && range?.to)

  useEffect(() => {
    // 防止重複請求
    if (isLoadingRef.current) return

    let cancelled = false

    const fetchHolidaysAndCalculateMinDate = async () => {
      isLoadingRef.current = true
      try {
        const currentYear = today.getFullYear()
        const holidays = [
          ...(await getAllHolidaysForYear(currentYear)),
          ...(await getAllHolidaysForYear(currentYear + 1)),
        ]

        if (cancelled) return

        const holidayDateObjects = holidays.map(parseDateString)
        setHolidayDates(holidayDateObjects)

        // 如果有指定工作日數，計算最小日期
        if (minWorkingDays !== undefined && minWorkingDays > 0) {
          // 在元件內部計算工作日，避免呼叫可能失敗的 getNextWorkingDay
          let workingDayCount = 0
          const currentDate = new Date(today)

          // 檢查日期是否為工作日（不是週末且不是假日）
          const isWorkingDay = (date: Date) => {
            const dayOfWeek = date.getDay()
            // 週末（0 = 週日, 6 = 週六）
            if (dayOfWeek === 0 || dayOfWeek === 6) return false
            // 檢查是否為假日
            return !holidayDateObjects.some((holiday) =>
              isSameDate(holiday, date)
            )
          }

          while (workingDayCount < minWorkingDays) {
            currentDate.setDate(currentDate.getDate() + 1)
            if (isWorkingDay(currentDate)) {
              workingDayCount++
            }
          }

          if (!cancelled) {
            const minDateValue = new Date(currentDate)
            minDateValue.setHours(0, 0, 0, 0)
            setMinDate(minDateValue)
          }
        } else {
          // 否則使用簡單的天數偏移
          if (!cancelled) {
            setMinDate(addDays(today, minOffsetDays))
          }
        }
      } catch (error) {
        console.error('Failed to fetch holidays:', error)
        // 如果出錯，至少設定基本的最小日期
        if (!cancelled) {
          setMinDate(addDays(today, minOffsetDays))
        }
      } finally {
        if (!cancelled) {
          isLoadingRef.current = false
        }
      }
    }

    fetchHolidaysAndCalculateMinDate()

    return () => {
      cancelled = true
      isLoadingRef.current = false
    }
  }, [today, minOffsetDays, minWorkingDays])

  const isHoliday = useMemo(() => {
    return (date: Date) => {
      if (holidayDates.length === 0) return false
      return holidayDates.some((holiday) => isSameDate(holiday, date))
    }
  }, [holidayDates])

  const HolidayDayButton = useMemo(() => {
    const Component = (props: React.ComponentProps<typeof DayButton>) => {
      const isHolidayDate = isHoliday(props.day.date)
      return (
        <CalendarDayButton
          {...props}
          className={cn(
            props.className,
            isHolidayDate && 'font-semibold !text-red-900 dark:!text-red-700'
          )}
        />
      )
    }
    Component.displayName = 'HolidayDayButton'
    return Component
  }, [isHoliday])

  const CalendarText = hasValue ? (
    <>
      <span>{format(range!.from!, dateFormat, { locale: zhTW })}</span>
      <span>-</span>
      <span>{format(range!.to!, dateFormat, { locale: zhTW })}</span>
    </>
  ) : (
    <>
      <span>年 / 月 / 日</span>
      <span>-</span>
      <span>年 / 月 / 日</span>
    </>
  )

  return (
    <LabeledField
      id={calendarId}
      label="排播日期"
      labelDescription="最早可排播時間為<br class='md:hidden'/>上傳素材 3 個工作天"
      labelIcon={<CalendarIcon />}
      className="relative flex gap-2"
    >
      <Popover>
        {isLoading ? (
          <Skeleton className="h-[45px] w-90" />
        ) : (
          <PopoverTrigger asChild>
            <Button
              id={calendarId}
              variant="ghost"
              className={cn(
                'h-[45px] w-full justify-start gap-2 rounded-md bg-gray-2 tracking-widest md:gap-3',
                layout.hoverBorder,
                hasValue ? 'text-text-primary' : 'text-gray-5',
                error && ['border border-red-7', 'focus:border-red-8'],
                className
              )}
              disabled={disabled}
            >
              {CalendarText}
              <CalendarIcon className="ml-auto text-text-tertiary" />
            </Button>
          </PopoverTrigger>
        )}
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={{ before: minDate }}
            defaultMonth={minDate}
            components={{
              DayButton: HolidayDayButton,
            }}
            {...props}
          />
        </PopoverContent>
      </Popover>
      {!!error && <ErrorMessage>{error}</ErrorMessage>}
    </LabeledField>
  )
}
