'use client'

import { useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import SubmitResult from '@/components/shared/submit-result'
import UploadTemplate from '@/components/upload/upload-template'
import { OrderRecordForUpload } from '@/graphql/queries/orders'
import { useSubmitStatus } from '@/hooks/useSubmitStatus'

const pageTitle = '重新上傳廣告素材'

export default function ReUploadPage() {
  const { submitStatus, setSubmitStatus } = useSubmitStatus()
  const [orders, setOrders] = useState<OrderRecordForUpload[]>([])
  const [loading, setLoading] = useState(true)
  // const [editableFields, setEditableFields] = useState<EditableFields>()

  const router = useRouter()
  const searchParams = useSearchParams()

  function handleConfirmReupload(data: unknown) {
    console.log('重新上傳廣告資料', data)

    // Demo alert to choose result
    const isSuccess = window.confirm(
      '是否要模擬「送出成功」？按「取消」則模擬失敗。'
    )

    // Update status based on result
    setSubmitStatus(isSuccess ? 'success' : 'failure')
  }

  // ToDO: 暫時層 upload 搬過來，待重新整合

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const memberId = searchParams.get('memberId')
        const res = await fetch(`/api/upload/orders?memberId=${memberId ?? ''}`)
        if (!res.ok) {
          // If the API returns an error, redirect to not-found page with status code
          router.push(`/not-found?status=${res.status}`)
          return
        }

        const data = await res.json()

        setOrders(data.orders || [])
      } catch (err) {
        console.error('Failed to fetch orders for upload:', err)
        router.push(`/not-found?status=500`)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [router, searchParams])

  useEffect(() => {
    async function fetchEditableFields() {
      try {
        //  Mock: simulate API fetch delay (2 seconds)
        // const res = await fetch('/api/reupload/fields')
        // const data = (await res.json()) as EditableFields

        // Mock data: simulate backend response for field editability
        // const mockData: EditableFields = {
        //   adName: false,
        //   range: false,
        //   text1: false,
        //   text2: false,
        //   file: false,
        // }

        // setEditableFields(mockData)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } catch (err) {
        console.error('Failed to fetch editableFields', err)
        // setEditableFields({
        //   adName: true,
        //   range: true,
        //   text1: true,
        //   text2: true,
        //   file: true,
        // }) // fallback
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
      // editableFields={editableFields}
      onSubmit={handleConfirmReupload}
      orders={orders}
      loading={loading}
    />
  )
}
