'use client'

import { useEffect, useState } from 'react'

import { useSearchParams,useRouter } from 'next/navigation'

import SubmitResult from '@/components/shared/submit-result'
import UploadTemplate from '@/components/upload/upload-template'
import { OrderRecordForUpload } from '@/graphql/queries/orders'
import { useSubmitStatus } from '@/hooks/useSubmitStatus'

const pageTitle = '上傳廣告素材'

export default function UploadPage() {
  const { submitStatus, setSubmitStatus } = useSubmitStatus()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [orders, setOrders] = useState<OrderRecordForUpload[]>([])
  const [loading, setLoading] = useState(true)

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
      orders={orders}
      loading={loading}
    />
  )
}
