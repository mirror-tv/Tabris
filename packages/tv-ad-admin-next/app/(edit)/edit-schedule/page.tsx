'use client'

import { useState } from 'react'

import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale/zh-TW'

import type { DateRange } from 'react-day-picker'

import CalendarIcon from '@/assets/icons/calender.svg'
import TriangleExclamationIcon from '@/assets/icons/triangle-exclamation.svg'
import EditPageLayout, {
  type SubmitStatus,
} from '../../../components/edit/edit-page-layout'
import { Instructions } from '@/components/shared/instructions'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/utils'

const PAGE_TITLE = '  設定排播日期'

export default function EditSchedule() {
  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!range?.from || !range?.to) {
      alert('請選擇完整的排播起訖日期')
      return
    }

    const formattedRange = {
      from: format(range.from, 'yyyy-MM-dd'),
      to: format(range.to, 'yyyy-MM-dd'),
    }

    console.log('Submitted schedule:', formattedRange)

    // Demo alert to choose result
    const isSuccess = window.confirm(
      '是否要模擬「送出成功」？按「取消」則模擬失敗。'
    )
    if (isSuccess) {
      setSubmitStatus('success')
    } else {
      setSubmitStatus('failure')
    }
  }

  return (
    <EditPageLayout
      pageTitle={PAGE_TITLE}
      onSubmit={handleSubmit}
      submitButtonName="送出"
      cardTitle="重新設定排播日期"
      submitStatus={submitStatus}
    >
      <div className="space-y-m">
        <h6 className="flex items-center gap-1">
          <CalendarIcon className="text-text-tertiary" />
          排播日期
        </h6>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-2 bg-gray-2 tracking-widest md:w-[360px] md:gap-3'
              )}
            >
              {CalendarText}
              <CalendarIcon className="ml-auto text-text-tertiary" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="range" selected={range} onSelect={setRange} />
          </PopoverContent>
        </Popover>
      </div>
      <Instructions
        title="重要提醒"
        icon={<TriangleExclamationIcon />}
        wordings={[
          '設定新的排播日期後，業務會重新寄送規格書給您，請記得至後台確認。',
        ]}
      />
    </EditPageLayout>
  )
}
