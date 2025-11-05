'use client'

import { useEffect, useMemo, useState } from 'react'

import { format, formatISO, parseISO } from 'date-fns'
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
import ConfirmDialog, { PreviewData } from '@/components/upload/confirm-dialog'
import { layout, ORDER_STATE } from '@/constants'
import { OrderRecordForUploadMutation } from '@/graphql/mutations/order'
import { OrderRecordForUploadQuery } from '@/graphql/queries/orders'
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
const adText1LabelId = 'ad-text1-label'
const adText2LabelId = 'ad-text2-label'
const imageUploadLabelId = 'image-upload-label'

type FormState = {
  adName: string
  adText1: string
  adText2: string
  adRange: DateRange | undefined
  adImage:
    | (Pick<PhotoSchema, 'id' | 'name' | 'url'> & { data: File | null })
    | null
}

type FieldEditability = Pick<
  OrderRecordForUploadQuery,
  | 'nameEditable'
  | 'scheduleEditable'
  | 'paragraphOneEditable'
  | 'paragraphTwoEditable'
  | 'imageEditable'
>

type UploadTemplateProps = {
  pageTitle: string
  onSubmit: (data: OrderRecordForUploadMutation) => void
  orders: OrderRecordForUploadQuery[]
  loading: boolean
}

const initialFormState: FormState = {
  adName: '',
  adText1: '',
  adText2: '',
  adRange: undefined,
  adImage: null,
}

const initialFieldsEditability: FieldEditability = {
    nameEditable: true,
    scheduleEditable: true,
    paragraphOneEditable: true,
    paragraphTwoEditable: true,
    imageEditable: true,
  }

export default function UploadTemplate({
  pageTitle,
  onSubmit,
  orders,
  loading,
}: UploadTemplateProps) {
  const [selectedOrder, setSelectedOrder] =
    useState<OrderRecordForUploadQuery | null>(null)
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [fields, setFields] = useState<FieldEditability>(initialFieldsEditability)
  const [uploadData, setUploadData] =
    useState<OrderRecordForUploadMutation | null>(null)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { adName, adText1, adText2, adRange, adImage } = formState

  const mode = useMemo(() => {
    if (selectedOrder?.state === ORDER_STATE.PENDING_QUOTE_CONFIRMATION)
      return 'reupload'
    if (selectedOrder?.state === ORDER_STATE.PENDING_UPLOAD) return 'upload'
    return 'upload'
  }, [selectedOrder])

  devLog(selectedOrder, 'selectedOrder')
  devLog(orders, 'orders')

  // ====================== Start: drop image ======================
  function _validateAndSetFile(adImage: File) {
    if (!['image/jpeg', 'image/png'].includes(adImage.type)) {
      setErrors((prev) => ({ ...prev, adImage: '僅支援 JPG 或 PNG 格式' }))
      setFormState((prev) => ({ ...prev, adImage: null }))
      return
    }

    if (adImage.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        adImage: '檔案超過 5MB，請重新上傳',
      }))
      setFormState((prev) => ({ ...prev, adImage: null }))
      return
    }

    setFormState({
      ...formState,
      adImage: {
        id: '',
        name: adImage.name,
        url: '',
        data: adImage,
      },
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
  // ====================== End: drop image ======================

  function handleOrderSelect(value: string) {
    const currentOrder = orders.find((o) => o.orderNumber === value)
    if (!currentOrder) return

    setErrors({})
    setSelectedOrder(currentOrder)

    const image = currentOrder.image
    const photoData =
      image && image.id
        ? {
            id: image.id,
            name: image.name || '舊圖片',
            url: image.url ?? '',
            data: null,
          }
        : null

    const startDate = currentOrder.scheduleStartDate
      ? parseISO(currentOrder.scheduleStartDate)
      : undefined

    const endDate = currentOrder.scheduleEndDate
      ? parseISO(currentOrder.scheduleEndDate)
      : undefined

    setFormState({
      adName: currentOrder.name ?? '',
      adText1: currentOrder.paragraphOne ?? '',
      adText2: currentOrder.paragraphTwo ?? '',
      adRange:
        startDate && endDate ? { from: startDate, to: endDate } : undefined,
      adImage: photoData,
    })

    const {
      nameEditable,
      scheduleEditable,
      paragraphOneEditable,
      paragraphTwoEditable,
      imageEditable,
    } = currentOrder

    setFields({
      nameEditable,
      scheduleEditable,
      paragraphOneEditable,
      paragraphTwoEditable,
      imageEditable,
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    // Always validate "order" because it’s never disabled
    if (!selectedOrder) newErrors.order = '請選擇訂單'

    // Skip validation if the field is disabled in reupload page
    if (fields.nameEditable && !adName.trim()) {
      newErrors.adName = '請輸入廣告名稱'
    }

    if (fields.paragraphOneEditable) {
      if (adText1.trim().length === 0 || adText1.trim().length > 10) {
        newErrors.adText1 = '請輸入 1 - 10 字以內的文字素材'
      }
    }

    if (fields.paragraphTwoEditable && adText2.trim().length > 10)
      newErrors.adText2 = '文字素材二最多 10 字'

    if (fields.scheduleEditable && (!adRange?.from || !adRange?.to)) {
      newErrors.adRange = '請選擇完整的排播起訖日期'
    }

    if (fields.imageEditable && !adImage) {
      newErrors.adImage = '請上傳圖片檔案'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    const mutationData: OrderRecordForUploadMutation = {
      id: selectedOrder!.id,
    }

    if (fields.nameEditable) mutationData.name = adName
    if (fields.paragraphOneEditable) mutationData.paragraphOne = adText1
    if (fields.paragraphTwoEditable) mutationData.paragraphTwo = adText2
    if (fields.scheduleEditable && adRange?.from && adRange?.to) {
      mutationData.scheduleStartDate = formatISO(adRange.from)
      mutationData.scheduleEndDate = formatISO(adRange.to)
    }
    // if (fields.imageEditable && adImage) {
    //   mutationData.image = {
    //     name: adImage!.name,
    //     // imageFile:{
    //     //   extension: adImage.
    //     // }
    //   }
    // }

    // 2. Build dialog preview data (for UI only)
    const dialogPreviewData: PreviewData = {
      orderNumber: selectedOrder!.orderNumber,
      adName,
      adText1,
      adText2,
      adImageName: adImage!.name,
      adRange: {
        from: format(adRange!.from!, 'yyyy/MM/dd'),
        to: format(adRange!.to!, 'yyyy/MM/dd'),
      },
    }

    devLog(mutationData,'mutationData ==')
    setPreviewData(dialogPreviewData)
    setUploadData(mutationData)
    setIsDialogOpen(true)
  }

  async function handleConfirmUpload() {
    if (!uploadData) return

    try {
      await onSubmit(uploadData) // Pass payload to parent for API submission
      setIsDialogOpen(false)
    } catch (err) {
      console.error('Upload submission failed:', err)
    }
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
                      const orderNumber = order.orderNumber || order.id
                      return (
                        <SelectItem value={orderNumber} key={orderNumber}>
                          {order.orderNumber || order.id}
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
                        disabled={!fields.nameEditable}
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
                      range={adRange}
                      setRange={(newRange) =>
                        setFormState((prev) => ({
                          ...prev,
                          adRange: newRange,
                        }))
                      }
                      error={errors.adRange}
                      disabled={!fields.scheduleEditable}
                    />
                  </div>

                  {/* 文字素材一、二 */}
                  <LabeledField
                    id={adText1LabelId}
                    label="文字素材一 (10字內)"
                    labelIcon={<TextFormatIcon />}
                  >
                    <CustomInput
                      id={adText1LabelId}
                      type="text"
                      placeholder="請輸入第一段文字素材"
                      className={cn(
                        !fields.paragraphOneEditable &&
                          'cursor-not-allowed bg-gray-3 text-gray-5'
                      )}
                      value={adText1}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          adText1: e.target.value,
                        }))
                      }
                      disabled={!fields.paragraphOneEditable}
                      error={errors.adText1}
                      errorMessage={errors.adText1}
                    />
                  </LabeledField>

                  <LabeledField
                    id={adText2LabelId}
                    label="文字素材二 (10字內)"
                    labelIcon={<TextFormatIcon />}
                  >
                    <CustomInput
                      id={adText2LabelId}
                      type="text"
                      placeholder="請輸入第二段文字素材"
                      value={adText2}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          adText2: e.target.value,
                        }))
                      }
                      disabled={!fields.paragraphTwoEditable}
                      error={errors.adText2}
                      errorMessage={errors.adText2}
                    />
                  </LabeledField>

                  {/* 上傳圖片 */}
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
                          errors.adImage && [
                            'border border-red-7',
                            'focus:border-red-8',
                          ]
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
                          disabled={!fields.imageEditable}
                          onClick={() =>
                            document.getElementById(imageUploadLabelId)?.click()
                          }
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
                          {errors.adImage && (
                            <p className="text-red-7">{errors.adImage}</p>
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

      {previewData && (
        <ConfirmDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          previewData={previewData}
          onConfirm={handleConfirmUpload}
        />
      )}
    </>
  )
}
