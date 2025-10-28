'use client'

import UploadTemplate from '@/components/upload/upload-template'

export default function UploadPage() {
  return (
    <UploadTemplate
      pageTitle="上傳廣告素材"
      mode="upload"
      onSubmit={(data) => console.log('送出上傳資料', data)}
    />
  )
}
