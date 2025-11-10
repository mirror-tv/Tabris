'use client'

import { useMemo, useState } from 'react'

import { format, formatISO, parseISO } from 'date-fns'
import { DateRange } from 'react-day-picker'

import ImageUploadField from './image-upload-field'
import OrderSelectField from './order-select-field'

import { CustomInput } from '@/components/custom-ui/custom-input'
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
import ConfirmDialog, { PreviewData } from '@/components/upload/confirm-dialog'
import { ORDER_STATE } from '@/constants'
import { OrderRecordForUploadMutation } from '@/graphql/mutations/order'
import { OrderRecordForUploadQuery } from '@/graphql/queries/orders'
import TextFormatIcon from '@/public/icons/text-format.svg'
import TextIcon from '@/public/icons/text.svg'
import TriangleExclamationIcon from '@/public/icons/triangle-exclamation.svg'
import { PhotoSchema } from '@/types/photo'
import { cn } from '@/utils'


export type FormState = {
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

// ===== Label / Input Element IDs =====
const adNameLabelId = 'ad-name-label'
const adText1LabelId = 'ad-text1-label'
const adText2LabelId = 'ad-text2-label'

export default function UploadTemplate({
  pageTitle,
  onSubmit,
  orders,
  loading,
}: UploadTemplateProps) {
  const [selectedOrder, setSelectedOrder] =
    useState<OrderRecordForUploadQuery | null>(null)
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [fields, setFields] = useState<FieldEditability>(
    initialFieldsEditability
  )
  const [uploadData, setUploadData] =
    useState<OrderRecordForUploadMutation | null>(null)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { adName, adText1, adText2, adRange, adImage } = formState

  // mode: 'upload' | 'reupload'
  // Derived from selectedOrder.state. Used only for UI rendering (labels, buttons, editable fields), not for business or server logic.
  const { mode, nextState } =
    useMemo(() => {
      if (selectedOrder?.state === ORDER_STATE.PENDING_UPLOAD) {
        return {
          mode: 'upload' as const,
          nextState: ORDER_STATE.MATERIAL_UPLOADED,
        }
      }

      if (selectedOrder?.state === ORDER_STATE.PENDING_QUOTE_CONFIRMATION) {
        return {
          mode: 'reupload' as const,
          nextState: ORDER_STATE.TRANSFERRED,
        }
      }
    }, [selectedOrder]) ?? {}

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

    if (!selectedOrder || !nextState) {
      console.warn('[UploadTemplate] Missing required data for submission:', {
        selectedOrder,
        nextState,
      })
      return
    }

    // Build a complete GraphQL mutation payload in one step.
    // Use conditional spread syntax to include only editable fields.
    // This approach avoids later object mutations and ensures a clean, immutable data structure.
    const mutationData: OrderRecordForUploadMutation = {
      orderNumber: selectedOrder.orderNumber,
      state: nextState,
      ...(fields.nameEditable && { name: adName }),
      ...(fields.paragraphOneEditable && { paragraphOne: adText1 }),
      ...(fields.paragraphTwoEditable && { paragraphTwo: adText2 }),
      ...(fields.scheduleEditable &&
        adRange?.from &&
        adRange?.to && {
          scheduleStartDate: formatISO(adRange.from),
          scheduleEndDate: formatISO(adRange.to),
        }),
      ...(fields.imageEditable && adImage && { image: { data: adImage.data } }),
    }

    // Build dialog preview data (for UI only)
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

    setPreviewData(dialogPreviewData)
    setUploadData(mutationData)
    setIsDialogOpen(true)
  }

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
              <OrderSelectField
                orders={orders}
                loading={loading}
                error={errors.order}
                onSelect={handleOrderSelect}
              />

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
                  <ImageUploadField
                    adImage={adImage}
                    setImage={(newImage) =>
                      setFormState((prev) => ({
                        ...prev,
                        adImage: newImage,
                      }))
                    }
                    setErrors={setErrors}
                    error={errors.adImage}
                    disabled={!fields.imageEditable}
                  />

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
          onConfirm={()=>uploadData && onSubmit(uploadData)}
        />
      )}
    </>
  )
}
