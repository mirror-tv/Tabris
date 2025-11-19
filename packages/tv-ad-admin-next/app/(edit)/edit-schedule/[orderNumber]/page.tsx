'use client'

import { useEffect, useState } from 'react'

import { format, parseISO } from 'date-fns'
import { useRouter } from 'next/navigation'

import type { OrderRecordForEdit } from '@/graphql/queries/orders'
import type { DateRange } from 'react-day-picker'

import EditPageLayout from '@/components/edit/edit-page-layout'
import { Instructions } from '@/components/shared/instructions'
import PopoverCalendar from '@/components/shared/popover-calendar'
import SubmitResult from '@/components/shared/submit-result'
import { useSubmitStatus } from '@/hooks/useSubmitStatus'
import TriangleExclamationIcon from '@/public/icons/triangle-exclamation.svg'
import { handleUnauthorized } from '@/utils/handle-unauthorized'


const PAGE_TITLE = '設定排播日期'

export default function EditSchedule({
  params,
}: {
  params: { orderNumber: string }
}) {
  const { orderNumber } = params
  const router = useRouter()
  const { submitStatus, setSubmitStatus } = useSubmitStatus()

  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<OrderRecordForEdit | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true)

      if (!orderNumber) {
        setError('Order number is required')
        return
      }
      try {
        const res = await fetch(`/api/order/${orderNumber}/schedule`)
        if (!res.ok) {
          if (res.status === 401) {
            await handleUnauthorized(router)
            return
          }
          if (res.status === 404) {
            router.push('/not-found/404')
            return
          }
          throw new Error(
            `Failed to fetch schedule by order number: ${orderNumber}: ${res.statusText}`
          )
        }
        const data = await res.json()
        const { order } = data
        if (!order) {
          router.push('/not-found/404')
          return
        }

        setOrderData(order)

        // 初始化現有的排播日期到 range state
        if (order.scheduleStartDate && order.scheduleEndDate) {
          setRange({
            from: parseISO(order.scheduleStartDate),
            to: parseISO(order.scheduleEndDate),
          })
        }

        setError(null)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        setError(error instanceof Error ? error.message : '載入訂單失敗')
      }
    }
    fetchSchedule()
  }, [router, orderNumber])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!orderData) {
      setError('訂單資料還沒完全顯示，請稍等。')
      return
    }

    if (!orderNumber) {
      setError('訂單編號不存在')
      return
    }

    if (!range?.from || !range?.to) {
      setError('請選擇完整的排播起訖日期')
      return
    }

    setError(null)
    setIsUploading(true)

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
        if (res.status === 401) {
          await handleUnauthorized(router)
          return
        }
        if (res.status === 404) {
          router.push('/not-found/404')
          return
        }
        throw new Error(`Response status: ${res.status}`)
      }

      setSubmitStatus('success')
      setIsUploading(false)
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
      orderData={orderData}
      onSubmit={handleSubmit}
      submitButtonName="送出"
      cardTitle="重新設定排播日期"
      isLoading={isLoading}
      isUploading={isUploading}
    >
      <PopoverCalendar
        range={range}
        setRange={setRange}
        error={error}
        className="md:w-[360px]"
        isLoading={isLoading}
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
