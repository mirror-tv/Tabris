'use client'

import { useState, useEffect } from 'react'

import { FormState } from './upload-template'

import { LabeledField } from '@/components/custom-ui/labeled-field'
import { Button } from '@/components/ui/button'
import ImageIcon from '@/public/icons/image.svg'
import { cn } from '@/utils'


type ImageUploadFieldProps = {
  adImage: FormState['adImage']
  setImage: (image: FormState['adImage']) => void
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
  disabled?: boolean
  error?: string
}

const imageUploadLabelId = 'image-upload-label'

export default function ImageUploadField({
  adImage,
  setImage,
  setErrors,
  disabled,
  error,
}: ImageUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  function _validateAndSetFile(adImage: File) {
    if (!['image/jpeg', 'image/png'].includes(adImage.type)) {
      setErrors((prev) => ({ ...prev, adImage: '僅支援 JPG 或 PNG 格式' }))
      setImage(null)
      return
    }

    if (adImage.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        adImage: '檔案超過 5MB，請重新上傳',
      }))
      setImage(null)
      return
    }

    setImage({
      id: '',
      name: adImage.name,
      url: '',
      data: adImage,
    })
    setErrors((prev) => ({ ...prev, adImage: '' }))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) _validateAndSetFile(uploadedFile)
  }
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) _validateAndSetFile(droppedFile)
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    const related = e.relatedTarget as Node | null
    if (related && e.currentTarget.contains(related)) return
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    const related = e.relatedTarget as Node | null
    if (related && e.currentTarget.contains(related)) return
    setIsDragging(false)
  }

  // ===== Update image preview when adImage changes =====
  useEffect(() => {
    if (!adImage) {
      setImagePreview(null)
      return
    }

    if (adImage.data) {
      const objectUrl = URL.createObjectURL(adImage.data)
      setImagePreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }

    if (adImage.url) {
      setImagePreview(adImage.url)
    }
  }, [adImage])

  return (
    <div className="space-y-2">
      <LabeledField
        id={imageUploadLabelId}
        label="上傳圖片"
        labelIcon={<ImageIcon />}
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-3 p-6 text-center',
            isDragging
              ? 'border-blue-5 bg-blue-1'
              : 'border-gray-3 bg-transparent',
            error && ['border border-red-7', 'focus:border-red-8']
          )}
        >
          {/* If a adImage is uploaded, show image preview; otherwise show icon */}
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              loading="lazy"
              src={imagePreview}
              alt={adImage?.name || '預覽圖'}
              className="h-[90px] w-40 rounded-sm bg-white object-contain shadow-sm"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = '/icons/image.svg'
              }}
            />
          ) : (
            <ImageIcon className="size-[90px] text-gray-5" />
          )}

          <Button
            type="button"
            variant="outline"
            size="lg"
            intent="secondary"
            className="bg-white"
            disabled={disabled}
            onClick={() => document.getElementById(imageUploadLabelId)?.click()}
          >
            {adImage ? '重新選擇圖片' : '選擇圖片檔案'}
          </Button>
          <input
            id={imageUploadLabelId}
            key={adImage?.name}
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="min-h-16 md:h-11">
            <p className="text-gray-5">
              支援 JPG, PNG 格式，檔案大小不超過 5MB
            </p>
            {adImage && (
              <p className="font-medium text-text-primary">
                已選擇檔案：{adImage.name}
              </p>
            )}
            {error && <p className="text-red-7">{error}</p>}
          </div>
        </div>
      </LabeledField>
    </div>
  )
}
