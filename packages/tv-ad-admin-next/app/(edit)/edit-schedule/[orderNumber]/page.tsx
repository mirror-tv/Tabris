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

export default function EditSchedule({
  params,
}: {
  params: { orderNumber: string }
}) {
  const { orderNumber } = params
  const { submitStatus, setSubmitStatus } = useSubmitStatus()

  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!orderNumber) {
      setError('訂單編號不存在')
      return
    }

    if (!range?.from || !range?.to) {
      setError('請選擇完整的排播起訖日期')
      return
    }

    setError(null)

    const formattedRange = {
      scheduleStartDate: format(range.from, 'yyyy-MM-dd'),
      scheduleEndDate: format(range.to, 'yyyy-MM-dd'),
    }

    try {
      const res = await fetch(`/api/order/${orderNumber}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedRange),
      })

      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`)
      }

      setSubmitStatus('success')
    } catch (error) {
      console.error('Failed to update order schedule:', error)
      setError(
        error instanceof Error ? error.message : '更新排播日期失敗，請稍後再試'
      )
      setSubmitStatus('failure')
    }
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
