'use client'

import { useEffect, useState } from 'react'

import UploadTemplate, {
  EditableFields,
} from '@/components/upload/upload-template'

export default function ReUploadPage() {
  const [editableFields, setEditableFields] = useState<EditableFields>()

  useEffect(() => {
    async function fetchEditableFields() {
      try {
        //  Mock: simulate API fetch delay (2 seconds)
        // const res = await fetch('/api/reupload/fields')
        // const data = (await res.json()) as EditableFields

        // Mock data: simulate backend response for field editability
        const mockData: EditableFields = {
          adName: true, // can edit
          range: true, // cannot edit
          text1: true,
          text2: true,
          file: true,
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

  return (
    <UploadTemplate
      pageTitle="重新上傳廣告素材"
      mode="reupload"
      showAfterOrderSelect
      editableFields={editableFields}
      onSubmit={(data) => console.log('重新上傳廣告資料', data)}
    />
  )
}
