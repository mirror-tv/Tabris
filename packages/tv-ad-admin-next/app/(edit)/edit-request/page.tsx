'use client'

import { useState } from 'react'

import { ErrorMessage } from '@/components/custom-ui/error-message'
import { LabeledField } from '@/components/custom-ui/labeled-field'
import EditPageLayout from '@/components/edit/edit-page-layout'
import { Instructions } from '@/components/shared/instructions'
import { Textarea } from '@/components/ui/textarea'
import { layout } from '@/constants'
import { useSubmitStatus } from '@/hooks/useSubmitStatus'
import TextFormatIcon from '@/public/icons/text-format.svg'
import TextIcon from '@/public/icons/text.svg'
import TriangleExclamationIcon from '@/public/icons/triangle-exclamation.svg'
import { cn } from '@/utils'

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

export default function EditRequest() {
  const { submitStatus, setSubmitStatus } = useSubmitStatus()

  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [errors, setErrors] = useState<{ reason?: string; details?: string }>(
    {}
  )

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const newErrors: typeof errors = {}
    if (!reason.trim()) newErrors.reason = '請輸入修改原因'
    if (!details.trim()) newErrors.details = '請輸入修改詳情'
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return
    console.log({ reason, details })

    // Demo alert to choose result
    const isSuccess = window.confirm(
      '是否要模擬「送出成功」？按「取消」則模擬失敗。'
    )
    setSubmitStatus(isSuccess ? 'success' : 'failure')
  }

  return (
    <EditPageLayout
      pageTitle={PAGE_TITLE}
      onSubmit={handleSubmit}
      submitButtonName="送出修改請求"
      submitStatus={submitStatus}
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
            errors.reason &&
              'border-destructive focus-visible:ring-destructive/40'
          )}
        />
        {errors.reason && <ErrorMessage>{errors.reason}</ErrorMessage>}
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
            errors.details &&
              'border-destructive focus-visible:ring-destructive/40'
          )}
        />
        {errors.details && <ErrorMessage>{errors.details}</ErrorMessage>}
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
