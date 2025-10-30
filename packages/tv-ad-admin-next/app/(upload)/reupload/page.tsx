'use client'

import { useEffect, useState } from 'react'

import SubmitResult from '@/components/shared/submit-result'
import UploadTemplate, {
  EditableFields,
} from '@/components/upload/upload-template'
import { useSubmitStatus } from '@/hooks/useSubmitStatus'

const pageTitle = '重新上傳廣告素材'

export default function ReUploadPage() {
  const { submitStatus, setSubmitStatus } = useSubmitStatus()
  const [editableFields, setEditableFields] = useState<EditableFields>()

  function handleConfirmReupload(data: unknown) {
    console.log('重新上傳廣告資料', data) 

    // Demo alert to choose result
    const isSuccess = window.confirm(
      '是否要模擬「送出成功」？按「取消」則模擬失敗。'
    )

    // Update status based on result
    setSubmitStatus(isSuccess ? 'success' : 'failure')
  }

  useEffect(() => {
    async function fetchEditableFields() {
      try {
        //  Mock: simulate API fetch delay (2 seconds)
        // const res = await fetch('/api/reupload/fields')
        // const data = (await res.json()) as EditableFields

        // Mock data: simulate backend response for field editability
        const mockData: EditableFields = {
          adName: false,
          range: false,
          text1: false,
          text2: false,
          file: false,
        }

        setEditableFields(mockData)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } catch (err) {
        console.error('Failed to fetch editableFields', err)
        setEditableFields({
          adName: true,
          range: true,
          text1: true,
          text2: true,
          file: true,
        }) // fallback
      }
    }

    fetchEditableFields()
  }, [])

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
      mode="reupload"
      editableFields={editableFields}
      onSubmit={handleConfirmReupload}
    />
  )
}
