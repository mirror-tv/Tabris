'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import type { OrderRecordForEdit } from '@/graphql/queries/orders'

import { ErrorMessage } from '@/components/custom-ui/error-message'
import { LabeledField } from '@/components/custom-ui/labeled-field'
import EditPageLayout from '@/components/edit/edit-page-layout'
import { Instructions } from '@/components/shared/instructions'
import SubmitResult from '@/components/shared/submit-result'
import { Textarea } from '@/components/ui/textarea'
import { layout } from '@/constants'
import { useSubmitStatus } from '@/hooks/useSubmitStatus'
import TextFormatIcon from '@/public/icons/text-format.svg'
import TextIcon from '@/public/icons/text.svg'
import TriangleExclamationIcon from '@/public/icons/triangle-exclamation.svg'
import { cn } from '@/utils'
import { handleUnauthorized } from '@/utils/handle-unauthorized'


const textareaStyle = [
  'w-full resize-none rounded-md bg-gray-2 p-3 placeholder:!text-text-tertiary placeholder:text-h6',
  layout.hoverBorder,
]

const INSTRUCTIONS_INFO = [
  '提出修改要求後，原始排播日期將會作廢',
  '業務人員會根據修改複雜度，重新評估報價',
  '修改確認後，需重新安排排播時間',
]

const PAGE_TITLE = '提出修改'
const reasonId = 'reason'
const detailsId = 'details'

export default function EditRequest({
  params,
}: {
  params: { orderNumber: string }
}) {
  const { orderNumber } = params
  const router = useRouter()
  const { submitStatus, setSubmitStatus } = useSubmitStatus()

  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [error, setError] = useState<{
    reason?: string
    details?: string
  }>({})
  const [orderData, setOrderData] = useState<OrderRecordForEdit | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEditRequest = async () => {
      setIsLoading(true)

      if (!orderNumber) {
        router.push('/not-found/404')
        return
      }

      try {
        const res = await fetch(`/api/order/${orderNumber}/edit-request`)
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
            `Failed to fetch edit request by order number: ${orderNumber}: ${res.statusText}`
          )
        }
        const data = await res.json()
        const { order } = data
        if (!order) {
          router.push('/not-found/404')
          return
        }

        setOrderData(order)

        setError({})
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch edit request:', error)
        router.push('/not-found/404')
        return
      }
    }
    fetchEditRequest()
  }, [router, orderNumber])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!orderData) {
      setError({ reason: '訂單尚未載入完成' })
      return
    }

    const newError: typeof error = {}
    if (!reason.trim()) newError.reason = '請輸入修改原因'
    if (!details.trim()) newError.details = '請輸入修改詳情'
    setError(newError)

    if (Object.keys(newError).length > 0) return

    try {
      // Step 1: send email first
      const emailRes = await fetch('/api/edit-request/send-notify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderData.orderNumber,
          reason,
          details,
        }),
      })

      if (!emailRes.ok) {
        throw new Error(`Email failed: ${emailRes.status}`)
      }

      // Step 2: update state only if email succeeded
      const updateRes = await fetch('/api/edit-request/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: orderData.state,
          orderNumber: orderData.orderNumber,
        }),
      })

      if (!updateRes.ok) throw new Error(`Response status: ${updateRes.status}`)

      setSubmitStatus('success')
    } catch (err) {
      console.error('Failed to submit edit request:', err)
      setSubmitStatus('failure')
    }
  }

  if (submitStatus === 'success') {
    return (
      <SubmitResult
        pageTitle={PAGE_TITLE}
        status="success"
        heading="送出成功"
        message="業務會寄信給您溝通後續修改事宜，再請密切注意"
      />
    )
  } else if (submitStatus === 'failure') {
    return <SubmitResult pageTitle={PAGE_TITLE} />
  }

  return (
    <EditPageLayout
      pageTitle={PAGE_TITLE}
      onSubmit={handleSubmit}
      submitButtonName="送出修改請求"
      orderData={orderData}
      isLoading={isLoading}
    >
      <LabeledField
        id={reasonId}
        label="修改原因"
        labelIcon={<TextIcon />}
        className="relative"
      >
        <Textarea
          id={reasonId}
          name={reasonId}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="例如：文字需要調整"
          className={cn(
            textareaStyle,
            error.reason &&
              'border-destructive focus-visible:ring-destructive/40'
          )}
        />
        {error.reason && <ErrorMessage>{error.reason}</ErrorMessage>}
      </LabeledField>
      <LabeledField
        id={detailsId}
        label="修改詳情"
        labelIcon={<TextFormatIcon />}
        className="relative"
      >
        <Textarea
          id={detailsId}
          name={detailsId}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="請詳細描述您希望調整的地方及期望結果"
          className={cn(
            textareaStyle,
            error.details &&
              'border-destructive focus-visible:ring-destructive/40'
          )}
        />
        {error.details && <ErrorMessage>{error.details}</ErrorMessage>}
      </LabeledField>
      <Instructions
        title="重要提醒"
        icon={<TriangleExclamationIcon />}
        wordings={INSTRUCTIONS_INFO}
        isDot
      />
    </EditPageLayout>
  )
}
