'use client'

import SubmitResult from '@/components/shared/submit-result'
import UploadTemplate from '@/components/upload/upload-template'
import { useSubmitStatus } from '@/hooks/useSubmitStatus'

const pageTitle = '上傳廣告素材'

export default function UploadPage() {
  const { submitStatus, setSubmitStatus } = useSubmitStatus()

  function handleConfirmUpload(data: unknown) {
    console.log('送出上傳資料', data)

    // Demo alert to choose result
    const isSuccess = window.confirm(
      '是否要模擬「送出成功」？按「取消」則模擬失敗。'
    )

    // Update status based on result
    setSubmitStatus(isSuccess ? 'success' : 'failure')
  }

  if (submitStatus === 'success') {
    return (
      <SubmitResult
        pageTitle={pageTitle}
        status="success"
        heading="送出成功"
        message="請等待業務確認素材，如沒問題便會繼續製作影片"
      />
    )
  } else if (submitStatus === 'failure') {
    return <SubmitResult pageTitle={pageTitle} />
  }

  return (
    <UploadTemplate
      pageTitle={pageTitle}
      mode="upload"
      onSubmit={handleConfirmUpload}
    />
  )
}
