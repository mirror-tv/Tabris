'use client'

import { useEffect, useState } from 'react'

import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

import { CustomInput } from '@/components/custom-ui/custom-input'
import { ErrorMessage } from '@/components/custom-ui/error-message'
import { LabeledField } from '@/components/custom-ui/labeled-field'
import { Instructions } from '@/components/shared/instructions'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import PopoverCalendar from '@/components/shared/popover-calendar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import ConfirmDialog, {
  UploadSubmittedData,
} from '@/components/upload/confirm-dialog'
import { layout } from '@/constants'
import FileIcon from '@/public/icons/file.svg'
import ImageIcon from '@/public/icons/image.svg'
import TextFormatIcon from '@/public/icons/text-format.svg'
import TextIcon from '@/public/icons/text.svg'
import TriangleExclamationIcon from '@/public/icons/triangle-exclamation.svg'
import { cn, devLog } from '@/utils'

const orderId = 'order'
const adNameId = 'adName'
const text1Id = 'text1'
const text2Id = 'text2'
const uploadId = 'upload'
const fileInputId = 'fileInput'

export type EditableFields = Partial<{
  adName: boolean
  range: boolean
  text1: boolean
  text2: boolean
  file: boolean
}>

type UploadTemplateProps = {
  pageTitle: string
  mode: 'upload' | 'reupload'
  editableFields?: EditableFields
  showAfterOrderSelect?: boolean
  onSubmit: (data: UploadSubmittedData) => void
}

export default function UploadTemplate({
  pageTitle,
  mode,
  editableFields = {
    adName: true,
    range: true,
    text1: true,
    text2: true,
    file: true,
  },
  showAfterOrderSelect = false,
  onSubmit,
}: UploadTemplateProps) {
  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [order, setOrder] = useState<string | undefined>(undefined)
  const [adName, setAdName] = useState('')
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submittedData, setSubmittedData] =
    useState<UploadSubmittedData | null>(null)
  const [reuploadOrderSelected, setReuploadOrderSelected] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  function isDisabled(key: keyof EditableFields) {
    return editableFields[key] === false
  }
  devLog(editableFields, 'editableFields')

  // this constant controls whether to render all fields
  const shouldShowAllFields = !showAfterOrderSelect || reuploadOrderSelected

  // ====================== Start: drop file ======================
  function _validateAndSetFile(file: File) {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, file: '僅支援 JPG 或 PNG 格式' }))
      setFile(null)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: '檔案超過 5MB，請重新上傳',
      }))
      setFile(null)
      return
    }

    setFile(file)
    setErrors((prev) => ({ ...prev, file: '' }))
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
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  // ====================== End: drop file ======================

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    // Always validate "order" because it’s never disabled
    if (!order) newErrors.order = '請選擇訂單'

    // Skip validation if the field is disabled in reupload page
    if (!isDisabled('adName') && !adName.trim()) {
      newErrors.adName = '請輸入廣告名稱'
    }

    if (!isDisabled('text1')) {
      if (text1.trim().length === 0 || text1.trim().length > 10) {
        newErrors.text1 = '請輸入 1 - 10 字以內的文字素材'
      }
    }

    if (!isDisabled('text2')) {
      if (text2.trim().length > 10) {
        newErrors.text2 = '文字素材二最多 10 字'
      }
    }

    if (!isDisabled('range') && (!range?.from || !range?.to)) {
      newErrors.range = '請選擇完整的排播起訖日期'
    }

    if (!isDisabled('file') && !file) {
      newErrors.file = '請上傳圖片檔案'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    // Handle data construction safely for reupload mode
    const formattedRange =
      !isDisabled('range') && range?.from && range?.to
        ? {
            from: format(range.from, 'yyyy/MM/dd'),
            to: format(range.to, 'yyyy/MM/dd'),
          }
        : undefined
    const data: UploadSubmittedData = {
      order: order!,
      adName: adName || '[未修改]',
      text1: text1 || '[未修改]',
      text2: text2 || '[未修改]',
      fileName: file?.name ?? '[未上傳]',
      range: formattedRange ?? { from: '[未修改]', to: '[未修改]' },
    }

    setSubmittedData(data)
    setIsDialogOpen(true)
  }

  function handleConfirmUpload() {
    if (submittedData && onSubmit) onSubmit(submittedData)
    setIsDialogOpen(false)
    // TODO: 之後可改為實際 API 請求
  }

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return (
    <>
      <PageHeader title={pageTitle} />
      <PageMain className="py-5 md:py-10">
        <Card>
          <CardHeader>
            <CardTitle>{pageTitle}</CardTitle>
            <CardDescription>請完整填寫以下資訊，以便製作廣告</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col justify-between gap-8">
              <LabeledField
                id={orderId}
                label="選擇訂單"
                labelIcon={<FileIcon />}
                className="relative"
              >
                <Select
                  onValueChange={(value) => {
                    setOrder(value)
                    if (showAfterOrderSelect) setReuploadOrderSelected(true)
                  }}
                >
                  <SelectTrigger
                    id={orderId}
                    className={cn(
                      'w-full data-placeholder:bg-gray-2 data-placeholder:text-gray-5!',
                      layout.hoverBorder,
                      errors.order && [
                        'border border-red-7',
                        'focus:border-red-8',
                      ]
                    )}
                  >
                    <SelectValue placeholder="請選擇要上傳/修改素材的訂單" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="#C2GS19-1">訂單 1</SelectItem>
                    <SelectItem value="#C2GS19-2">訂單 2</SelectItem>
                    <SelectItem value="#C2GS19-3">訂單 3</SelectItem>
                    <SelectItem value="#C2GS19-4">訂單 4</SelectItem>
                    <SelectItem value="#C2GS19-5">訂單 5</SelectItem>
                  </SelectContent>
                </Select>
                {errors.order && <ErrorMessage>{errors.order}</ErrorMessage>}
              </LabeledField>

              {shouldShowAllFields && (
                <>
                  {/* 廣告名稱 + 排播日期 */}
                  <div className="grid gap-8 md:grid-cols-2 md:gap-4">
                    <LabeledField
                      id={adNameId}
                      label="廣告名稱"
                      labelIcon={<TextIcon />}
                    >
                      <CustomInput
                        id={adNameId}
                        type="text"
                        placeholder="請輸入廣告名稱"
                        disabled={isDisabled('adName')}
                        onChange={(e) => setAdName(e.target.value)}
                        error={errors.adName}
                        errorMessage={errors.adName}
                      />
                    </LabeledField>

                    <PopoverCalendar
                      range={range}
                      setRange={setRange}
                      error={errors.range}
                      disabled={isDisabled('range')}
                    />
                  </div>

                  {/* 文字素材一、二 */}
                  <LabeledField
                    id={text1Id}
                    label="文字素材一 (10字內)"
                    labelIcon={<TextFormatIcon />}
                  >
                    <CustomInput
                      id={text1Id}
                      type="text"
                      placeholder="請輸入第一段文字素材"
                      className={cn(
                        isDisabled('text1') &&
                          'cursor-not-allowed bg-gray-3 text-gray-5'
                      )}
                      onChange={(e) => setText1(e.target.value)}
                      disabled={isDisabled('text1')}
                      error={errors.text1}
                      errorMessage={errors.text1}
                    />
                  </LabeledField>

                  <LabeledField
                    id={text2Id}
                    label="文字素材二 (10字內)"
                    labelIcon={<TextFormatIcon />}
                  >
                    <CustomInput
                      id={text2Id}
                      type="text"
                      placeholder="請輸入第二段文字素材"
                      onChange={(e) => setText2(e.target.value)}
                      disabled={isDisabled('text2')}
                      error={errors.text2}
                      errorMessage={errors.text2}
                    />
                  </LabeledField>

                  {/* 上傳圖片 */}
                  <div className="space-y-2">
                    <LabeledField
                      id={uploadId}
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
                          errors.file && [
                            'border border-red-7',
                            'focus:border-red-8',
                          ]
                        )}
                      >
                        {/* If a file is uploaded, show preview; otherwise show icon */}
                        {preview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={preview}
                            alt="預覽圖"
                            className="h-[90px] w-40 rounded-sm bg-white object-contain shadow-sm"
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
                          disabled={isDisabled('file')}
                          onClick={() =>
                            document.getElementById(fileInputId)?.click()
                          }
                        >
                          {file ? '重新選擇圖片' : '選擇圖片檔案'}
                        </Button>
                        <input
                          id={fileInputId}
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <div className="min-h-16 md:h-11">
                          <p className="text-gray-5">
                            支援 JPG, PNG 格式，檔案大小不超過 5MB
                          </p>
                          {file && (
                            <p className="font-medium text-text-primary">
                              已選擇檔案：{file.name}
                            </p>
                          )}
                          {errors.file && (
                            <p className="text-red-7">{errors.file}</p>
                          )}
                        </div>
                      </div>
                    </LabeledField>
                  </div>

                  {/* 提示文字 */}
                  <Instructions
                    title="重要提醒"
                    icon={<TriangleExclamationIcon />}
                    wordings={[
                      '素材送出後將無法編輯、修改，請確認所有上傳內容正確無誤。',
                    ]}
                  />
                </>
              )}
            </CardContent>
            {shouldShowAllFields && (
              <CardFooter className="mt-6 justify-center">
                <Button type="submit" size="lg">
                  {mode === 'reupload' ? '重新上傳 ' : '上傳素材'}
                </Button>
              </CardFooter>
            )}
          </form>
        </Card>
      </PageMain>

      <ConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        submittedData={submittedData}
        onConfirm={handleConfirmUpload}
      />
    </>
  )
}
