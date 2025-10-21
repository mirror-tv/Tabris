'use client'

import { useState } from 'react'

import TextFormatIcon from '@/assets/icons/text-format.svg'
import TextIcon from '@/assets/icons/text.svg'
import TriangleExclamationIcon from '@/assets/icons/triangle-exclamation.svg'
import EditPageLayout, {
  type SubmitStatus,
} from '../../../components/edit/edit-page-layout'
import { Instructions } from '@/components/shared/instructions'
import { cn } from '@/utils'
import { Textarea } from '@/components/ui/textarea'

const textareaStyle =
  'w-full resize-none rounded-md bg-gray-2 p-3 placeholder:text-text-tertiary placeholder:text-h6'

const INSTRUCTIONS_INFO = [
  '提出修改要求後，原始排播日期將會作廢',
  '業務人員會根據修改複雜度，重新評估報價',
  '修改確認後，需重新安排排播時間',
]

const PAGE_TITLE = '提出修改'

export default function EditRequest() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
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
      <div className="space-y-m">
        <label
          htmlFor="reason"
          className="typography-h6 flex items-center gap-1"
        >
          <TextIcon className="text-text-tertiary" />
          修改原因
        </label>
        <Textarea
          id="reason"
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="例如：文字需要調整"
          className={cn(
            errors.reason &&
              'border-destructive focus-visible:ring-destructive/40'
          )}
        />
        {errors.reason && (
          <p className="text-destructive">{errors.reason}</p>
        )}
      </div>
      <div className="space-y-m">
        <label
          htmlFor="details"
          className="typography-h6 flex items-center gap-1"
        >
          <TextFormatIcon className="text-text-tertiary" />
          修改詳情
        </label>
        <Textarea
          id="details"
          name="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="請詳細描述您希望調整的地方及期望結果"
          className={cn(
            errors.details &&
              'border-destructive focus-visible:ring-destructive/40'
          )}
        />
        {errors.details && (
          <p className="text-destructive">{errors.details}</p>
        )}
      </div>
      <Instructions
        title="重要提醒"
        icon={<TriangleExclamationIcon />}
        wordings={INSTRUCTIONS_INFO}
        isDot
      />
    </EditPageLayout>
  )
}
