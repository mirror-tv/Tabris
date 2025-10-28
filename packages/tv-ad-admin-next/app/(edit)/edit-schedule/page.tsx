'use client'

import { useState } from 'react'

import { format } from 'date-fns'

import type { DateRange } from 'react-day-picker'

import EditPageLayout from '@/components/edit/edit-page-layout'
import { Instructions } from '@/components/shared/instructions'
import PopoverCalendar from '@/components/shared/popover-calendar'
import SubmitResult from '@/components/shared/submit-result'
import { useSubmitStatus } from '@/hooks/useSubmitStatus'
import TriangleExclamationIcon from '@/public/icons/triangle-exclamation.svg'


const PAGE_TITLE = '設定排播日期'

export default function EditSchedule() {
  const { submitStatus, setSubmitStatus } = useSubmitStatus()

  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

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
    
    setSubmitStatus(isSuccess ? 'success' : 'failure')
  }

  if (submitStatus === 'success') {
    return (
      <SubmitResult
        pageTitle={PAGE_TITLE}
        status="success"
        heading="送出成功"
        message="業務會重新寄送規格書給您，請記得至後台確認"
      />
    )
  } else if (submitStatus === 'failure') {
    return <SubmitResult pageTitle={PAGE_TITLE} />
  }

  return (
    <EditPageLayout
      pageTitle={PAGE_TITLE}
      onSubmit={handleSubmit}
      submitButtonName="送出"
      cardTitle="重新設定排播日期"
    >
      <PopoverCalendar
        range={range}
        setRange={setRange}
        error={error}
        className="md:w-[360px]"
      />
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
