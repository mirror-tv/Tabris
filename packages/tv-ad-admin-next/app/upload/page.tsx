'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import SubmitResult from '@/components/shared/submit-result'
import UploadTemplate from '@/components/upload/upload-template'
import { OrderRecordForUploadMutation } from '@/graphql/mutations/order'
import { OrderRecordForUploadQuery } from '@/graphql/queries/orders'
import { useSubmitStatus } from '@/hooks/useSubmitStatus'
import { ApiResponse } from '@/types'

const pageTitle = '上傳廣告素材'

export default function UploadPage() {
  const { submitStatus, setSubmitStatus } = useSubmitStatus()
  const router = useRouter()

  const [orders, setOrders] = useState<OrderRecordForUploadQuery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // TODO: consider pagination or lazy loading if performance becomes an issue
        const res = await fetch(`/api/upload/orders`)
        const payload: ApiResponse<OrderRecordForUploadQuery[]> =
          await res.json()

        if (!res.ok || !payload.success) {
          console.error('Failed to fetch orders:', payload.message)

          // If the API returns an error, redirect to not-found page with status code
          router.push(`/not-found/${res.status}`)
          return
        }

        setOrders(payload.data || [])
      } catch (err) {
        console.error('Failed to fetch orders for upload:', err)
        router.push(`/not-found/500`)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [router])

  async function handleConfirmUpload(data: OrderRecordForUploadMutation) {
    try {
      const res = await fetch('/api/upload/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const payload: ApiResponse = await res.json()

      if (!res.ok || !payload.success) {
        throw new Error(payload.message || 'Upload failed')
      }
      setSubmitStatus('success')
    } catch (error) {
      console.error('Upload submit error:', error)
      setSubmitStatus('failure')
    }
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
      onSubmit={handleConfirmUpload}
      orders={orders}
      loading={loading}
    />
  )
}
