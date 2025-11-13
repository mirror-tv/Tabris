'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import SubmitResult from '@/components/shared/submit-result'
import UploadTemplate from '@/components/upload/upload-template'
import { OrderRecordForUploadMutation } from '@/graphql/mutations/order'
import { OrderRecordForUploadQuery } from '@/graphql/queries/orders'
import { useSubmitStatus } from '@/hooks/useSubmitStatus'
import { ApiResponse } from '@/types'
import { handleUnauthorized } from '@/utils/handle-unauthorized'

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

        if (!res.ok || !payload?.success) {
          console.error('Failed to fetch orders:', payload?.message)
        }

        if (!res.ok) {
          if (res.status === 401) {
            await handleUnauthorized(router)
            return
          }
          // If the API returns an error, redirect to not-found page with status code
          router.push(`/not-found/${res.status}`)
          return
        }

        setOrders(payload?.data || [])
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
      const formData = new FormData()

      formData.append('orderNumber', data.orderNumber)
      formData.append('state', data.state)

      if ('name' in data && data.name) formData.append('name', data.name)
      if ('paragraphOne' in data && data.paragraphOne)
        formData.append('paragraphOne', data.paragraphOne)
      if ('paragraphTwo' in data && data.paragraphTwo)
        formData.append('paragraphTwo', data.paragraphTwo)
      if ('scheduleStartDate' in data && data.scheduleStartDate)
        formData.append('scheduleStartDate', data.scheduleStartDate)
      if ('scheduleEndDate' in data && data.scheduleEndDate)
        formData.append('scheduleEndDate', data.scheduleEndDate)
      if ('isUrgent' in data && data.isUrgent !== undefined)
        formData.append('isUrgent', String(data.isUrgent))

      // Attach image file if present
      if ('image' in data && data.image?.data) {
        if (data.image.data instanceof File) {
          formData.append('file', data.image.data)
        } else {
          // Log an error if image.data exists but is not a valid File instance.
          console.error('Invalid image file type:', data.image.data)
        }
      }

      const res = await fetch('/api/upload/submit', {
        method: 'POST',
        body: formData,
      })

      const payload: ApiResponse = await res.json()

      if (!res.ok || !payload?.success) {
        throw new Error(payload?.message || 'Upload failed')
      }

      setSubmitStatus('success')
    } catch (error) {
      console.error('Upload page submit error:', error)
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
