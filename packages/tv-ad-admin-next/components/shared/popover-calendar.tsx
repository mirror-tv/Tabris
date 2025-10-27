'use client'

import type { Dispatch, SetStateAction } from 'react'

import { addDays, format, startOfToday } from 'date-fns'
import { zhTW } from 'date-fns/locale/zh-TW'

import { ErrorMessage } from '../custom-ui/error-message'
import { LabeledField } from '../custom-ui/labeled-field'
import { Button } from '../ui/button'

import type { DateRange } from 'react-day-picker'

import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import CalendarIcon from '@/public/icons/calender.svg'
import { cn } from '@/utils'



type PopoverCalendarProps = {
  range: DateRange | undefined
  setRange: Dispatch<SetStateAction<DateRange | undefined>>
  error?: string | null
  className?: string
}

const calendarId = '"schedule"'

export default function PopoverCalendar({
  range,
  setRange,
  error,
  className,
}: PopoverCalendarProps) {
  const today = startOfToday()
  const minDate = addDays(today, 14)
  const dateFormat = 'yyyy/M/d'

  const CalendarText =
    range?.from && range?.to ? (
      <>
        <span>{format(range.from, dateFormat, { locale: zhTW })}</span>
        <span>-</span>
        <span>{format(range.to, dateFormat, { locale: zhTW })}</span>
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
        <PopoverTrigger asChild>
          <Button
            id={calendarId}
            variant="ghost"
            className={cn(
              'h-[45px] w-full justify-start gap-2 rounded-md bg-gray-2 tracking-widest md:gap-3',
              error && ['border border-red-7', 'focus:border-red-8'],
              className
            )}
          >
            {CalendarText}
            <CalendarIcon className="ml-auto text-text-tertiary" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={{ before: minDate }}
            defaultMonth={minDate}
          />
        </PopoverContent>
      </Popover>
      {!!error && <ErrorMessage>{error}</ErrorMessage>}
    </LabeledField>
  )
}
