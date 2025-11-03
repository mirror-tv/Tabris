'use client'

import { useEffect, useMemo, useState } from 'react'

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
import { layout, ORDER_STATE } from '@/constants'
import { OrderRecordForUpload } from '@/graphql/queries/orders'
import FileIcon from '@/public/icons/file.svg'
import ImageIcon from '@/public/icons/image.svg'
import TextFormatIcon from '@/public/icons/text-format.svg'
import TextIcon from '@/public/icons/text.svg'
import TriangleExclamationIcon from '@/public/icons/triangle-exclamation.svg'
import { PhotoSchema } from '@/types/photo'
import { cn, devLog } from '@/utils'

// ===== Label / Input Element IDs =====
const orderLabelId = 'order-label'
const adNameLabelId = 'ad-name-label'
const text1LabelId = 'text1-label'
const text2LabelId = 'text2-label'
const uploadLabelId = 'upload-label'
const fileInputLabelId = 'file-input-label'

type FormState = {
  adName: string
  text1: string
  text2: string
  range: DateRange | undefined
  file:
    | (Pick<PhotoSchema, 'id' | 'name' | 'url'> & { data: File | null })
    | null
}

type EditableFields = Partial<{
  adName: boolean
  range: boolean
  text1: boolean
  text2: boolean
  file: boolean
}>

type UploadTemplateProps = {
  pageTitle: string
  onSubmit: (data: UploadSubmittedData) => void
  orders: OrderRecordForUpload[]
  loading: boolean
}

const initialFormState: FormState = {
  adName: '',
  text1: '',
  text2: '',
  range: undefined,
  file: null,
}

const initialEditableFields: EditableFields = {
  adName: true,
  range: true,
  text1: true,
  text2: true,
  file: true,
}

export default function UploadTemplate({
  pageTitle,
  onSubmit,
  orders,
  loading,
}: UploadTemplateProps) {
  const [selectedOrder, setSelectedOrder] =
    useState<OrderRecordForUpload | null>(null)
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [editableFields, setEditableFields] = useState<EditableFields>(
    initialEditableFields
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submittedData, setSubmittedData] =
    useState<UploadSubmittedData | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const { adName, text1, text2, range, file } = formState

  const mode = useMemo(() => {
    if (selectedOrder?.state === ORDER_STATE.PENDING_QUOTE_CONFIRMATION)
      return 'reupload'
    if (selectedOrder?.state === ORDER_STATE.PENDING_UPLOAD) return 'upload'
    return 'upload'
  }, [selectedOrder])

  function isFieldEditable(key: keyof EditableFields) {
    return editableFields[key] === false
  }

  devLog(selectedOrder, 'selectedOrder')
  devLog(orders, 'orders')

  // ====================== Start: drop file ======================
  function _validateAndSetFile(file: File) {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, file: '僅支援 JPG 或 PNG 格式' }))
      setFormState((prev) => ({ ...prev, file: null }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: '檔案超過 5MB，請重新上傳',
      }))
      setFormState((prev) => ({ ...prev, file: null }))
      return
    }

    setFormState({
      ...formState,
      file: {
        id: '',
        name: file.name,
        url: '',
        data: file,
      },
    })
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
  // ====================== End: drop file ======================

  async function handleOrderSelect(value: string) {
    const currentOrder = orders.find((o) => o.orderNumber === value)
    if (!currentOrder) return
    setSelectedOrder(currentOrder)

    const image = currentOrder.image
    const photoData =
      image && image.id
        ? {
            id: image.id,
            name: image.name
              ? `${image.name}${image.imageFile?.extension ? `.${image.imageFile?.extension}` : ''}`
              : '舊圖片',
            url: image.url ?? '',
            data: null,
          }
        : null

    // Date conversion
    const startDate = currentOrder.scheduleStartDate
      ? new Date(currentOrder.scheduleStartDate)
      : undefined
    const endDate = currentOrder.scheduleEndDate
      ? new Date(currentOrder.scheduleEndDate)
      : undefined

    setFormState({
      adName: currentOrder.name ?? '',
      text1: currentOrder.paragraphOne ?? '',
      text2: currentOrder.paragraphTwo ?? '',
      range:
        startDate && endDate ? { from: startDate, to: endDate } : undefined,
      file: photoData,
    })

    setEditableFields({
      adName: currentOrder.nameEditable,
      range: currentOrder.scheduleEditable,
      text1: currentOrder.paragraphOneEditable,
      text2: currentOrder.paragraphTwoEditable,
      file: currentOrder.imageEditable,
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    // Always validate "order" because it’s never disabled
    if (!selectedOrder) newErrors.order = '請選擇訂單'

    // Skip validation if the field is disabled in reupload page
    if (!isFieldEditable('adName') && !adName.trim()) {
      newErrors.adName = '請輸入廣告名稱'
    }

    if (!isFieldEditable('text1')) {
      if (text1.trim().length === 0 || text1.trim().length > 10) {
        newErrors.text1 = '請輸入 1 - 10 字以內的文字素材'
      }
    }

    if (!isFieldEditable('text2')) {
      if (text2.trim().length > 10) {
        newErrors.text2 = '文字素材二最多 10 字'
      }
    }

    if (!isFieldEditable('range') && (!range?.from || !range?.to)) {
      newErrors.range = '請選擇完整的排播起訖日期'
    }

    if (!isFieldEditable('file') && !file) {
      newErrors.file = '請上傳圖片檔案'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    // Handle data construction safely for reupload mode
    const formattedRange =
      !isFieldEditable('range') && range?.from && range?.to
        ? {
            from: format(range.from, 'yyyy/MM/dd'),
            to: format(range.to, 'yyyy/MM/dd'),
          }
        : undefined

    const data: UploadSubmittedData = {
      order: selectedOrder!.orderNumber,
      adName: adName || '[未修改]',
      text1: text1 || '[未修改]',
      text2: text2 || '[未修改]',
      fileName: file?.data?.name ?? (file?.id ? '[舊圖片保留]' : '[未上傳]'),
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
  // ===== Update preview when file changes =====
  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }

    if (file.data) {
      const objectUrl = URL.createObjectURL(file.data)
      setPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }

    if (file.url) {
      setPreview(file.url)
    }
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
                id={orderLabelId}
                label="選擇訂單"
                labelIcon={<FileIcon />}
                className="relative"
              >
                <Select onValueChange={handleOrderSelect} disabled={loading}>
                  <SelectTrigger
                    id={orderLabelId}
                    className={cn(
                      'w-full data-placeholder:bg-gray-2 data-placeholder:text-gray-5!',
                      layout.hoverBorder,
                      errors.order && [
                        'border border-red-7',
                        'focus:border-red-8',
                      ]
                    )}
                  >
                    <SelectValue
                      placeholder={
                        loading
                          ? '讀取資料中...'
                          : '請選擇要上傳/修改素材的訂單'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => {
                      return (
                        <SelectItem
                          value={order.orderNumber}
                          key={order.orderNumber}
                        >
                          {order.orderNumber}
                          {order.name
                            ? ` - ${order.name}`
                            : ' - 未命名 [新訂單]'}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {errors.order && <ErrorMessage>{errors.order}</ErrorMessage>}
              </LabeledField>

              {!!selectedOrder && (
                <>
                  {/* 廣告名稱 + 排播日期 */}
                  <div className="grid gap-8 md:grid-cols-2 md:gap-4">
                    <LabeledField
                      id={adNameLabelId}
                      label="廣告名稱"
                      labelIcon={<TextIcon />}
                    >
                      <CustomInput
                        id={adNameLabelId}
                        type="text"
                        placeholder="請輸入廣告名稱"
                        value={adName}
                        disabled={isFieldEditable('adName')}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            adName: e.target.value,
                          }))
                        }
                        error={errors.adName}
                        errorMessage={errors.adName}
                      />
                    </LabeledField>

                    <PopoverCalendar
                      range={range}
                      setRange={(newRange) =>
                        setFormState((prev) => ({
                          ...prev,
                          range: newRange,
                        }))
                      }
                      error={errors.range}
                      disabled={isFieldEditable('range')}
                    />
                  </div>

                  {/* 文字素材一、二 */}
                  <LabeledField
                    id={text1LabelId}
                    label="文字素材一 (10字內)"
                    labelIcon={<TextFormatIcon />}
                  >
                    <CustomInput
                      id={text1LabelId}
                      type="text"
                      placeholder="請輸入第一段文字素材"
                      className={cn(
                        isFieldEditable('text1') &&
                          'cursor-not-allowed bg-gray-3 text-gray-5'
                      )}
                      value={text1}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          text1: e.target.value,
                        }))
                      }
                      disabled={isFieldEditable('text1')}
                      error={errors.text1}
                      errorMessage={errors.text1}
                    />
                  </LabeledField>

                  <LabeledField
                    id={text2LabelId}
                    label="文字素材二 (10字內)"
                    labelIcon={<TextFormatIcon />}
                  >
                    <CustomInput
                      id={text2LabelId}
                      type="text"
                      placeholder="請輸入第二段文字素材"
                      value={text2}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          text2: e.target.value,
                        }))
                      }
                      disabled={isFieldEditable('text2')}
                      error={errors.text2}
                      errorMessage={errors.text2}
                    />
                  </LabeledField>

                  {/* 上傳圖片 */}
                  <div className="space-y-2">
                    <LabeledField
                      id={uploadLabelId}
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
                            loading="lazy"
                            src={preview}
                            alt={file?.name || '預覽圖'}
                            className="h-[90px] w-40 rounded-sm bg-white object-contain shadow-sm"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src =
                                '/icons/image.svg'
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
                          disabled={isFieldEditable('file')}
                          onClick={() =>
                            document.getElementById(fileInputLabelId)?.click()
                          }
                        >
                          {file ? '重新選擇圖片' : '選擇圖片檔案'}
                        </Button>
                        <input
                          id={fileInputLabelId}
                          key={file?.name}
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
            {!!selectedOrder && (
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
