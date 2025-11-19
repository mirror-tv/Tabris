'use client'

import { addDays, format, startOfToday } from 'date-fns'
import { zhTW } from 'date-fns/locale/zh-TW'

import { ErrorMessage } from '../custom-ui/error-message'
import { LabeledField } from '../custom-ui/labeled-field'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

import type { DateRange } from 'react-day-picker'

import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { layout } from '@/constants'
import CalendarIcon from '@/public/icons/calender.svg'
import { cn } from '@/utils'



type PopoverCalendarProps = {
  range: DateRange | undefined
  setRange: (range: DateRange | undefined) => void
  error?: string | null
  disabled?: boolean
  minOffsetDays?: number
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
  isLoading = false,
  className,
  ...props
}: PopoverCalendarProps) {
  const today = startOfToday()
  const minDate = addDays(today, minOffsetDays)
  const dateFormat = 'yyyy/M/d'

  const hasValue = !!(range?.from && range?.to)

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
            {...props}
          />
        </PopoverContent>
      </Popover>
      {!!error && <ErrorMessage>{error}</ErrorMessage>}
    </LabeledField>
  )
}
