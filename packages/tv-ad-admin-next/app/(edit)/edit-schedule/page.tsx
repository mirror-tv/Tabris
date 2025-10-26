'use client'

import { useState } from 'react'

import { format } from 'date-fns'

import EditPageLayout, {
  type SubmitStatus,
} from '../../../components/edit/edit-page-layout'

import type { DateRange } from 'react-day-picker'

import { Instructions } from '@/components/shared/instructions'
import PopoverCalendar from '@/components/shared/popover-calendar'
import TriangleExclamationIcon from '@/public/icons/triangle-exclamation.svg'



const PAGE_TITLE = '設定排播日期'

export default function EditSchedule() {
  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!range?.from || !range?.to) {
      setError('請選擇完整的排播起訖日期')
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
      <PopoverCalendar range={range} setRange={setRange} error={error} />
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
