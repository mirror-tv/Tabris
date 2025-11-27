'use client'

import { useMemo, useState } from 'react'

import { formatISO } from 'date-fns'
import { DateRange } from 'react-day-picker'

import ImageUploadField from './image-upload-field'
import OrderSelectField from './order-select-field'
import { Checkbox } from '../ui/checkbox'

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
import { REVIEWED_ORDER_PRICE, UNREVIEWED_ORDER_PRICE } from '@/constants/price'
import { OrderRecordForUploadMutation } from '@/graphql/mutations/order'
import { OrderRecordForUploadQuery } from '@/graphql/queries/orders'
import TextFormatIcon from '@/public/icons/text-format.svg'
import TextIcon from '@/public/icons/text.svg'
import TriangleExclamationIcon from '@/public/icons/triangle-exclamation.svg'
import { PhotoSchema } from '@/types/photo'
import { formatTaiwanDate } from '@/utils/date'

export type FormState = {
  adName: string
  adText1: string
  adText2: string
  adRange: DateRange | undefined
  adImage:
    | (Pick<PhotoSchema, 'id' | 'name' | 'url'> & { data: File | null })
    | null
  isUrgent: boolean
}

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
  isUrgent: false,
}

// ===== Label / Input Element IDs =====
const adUrgentLabelId = 'ad-urgent-label'
const adNameLabelId = 'ad-name-label'
const adText1LabelId = 'ad-text1-label'
const adText2LabelId = 'ad-text2-label'

// const SCHEDULE_MIN_OFFSET_DAYS = 7

export default function UploadTemplate({
  pageTitle,
  onSubmit,
  orders,
  loading,
}: UploadTemplateProps) {
  const [selectedOrder, setSelectedOrder] =
    useState<OrderRecordForUploadQuery | null>(null)
  const [formState, setFormState] = useState<FormState>(initialFormState)

  const [uploadData, setUploadData] =
    useState<OrderRecordForUploadMutation | null>(null)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { adName, adText1, adText2, adRange, adImage, isUrgent } = formState
  const calculatedMinWorkingDays = isUrgent ? 2 : 5

  const reuploadPrice = useMemo(
    () => [
      ...new Set(
        orders
          .filter(
            (o) => o.state === ORDER_STATE.PENDING_UPLOAD && o.needsModification
          )
          .map((o: OrderRecordForUploadQuery) => o.price)
          .filter((price): price is number => price != null)
      ),
    ],
    [orders]
  )

  // mode: 'upload' | 'reupload' | null
  // Derived from selectedOrder.state. Used only for UI rendering (labels, buttons, editable fields), not for business or server logic.
  const mode = useMemo(() => {
    if (selectedOrder?.state === ORDER_STATE.PENDING_UPLOAD) return 'upload'
    if (selectedOrder?.state === ORDER_STATE.PENDING_QUOTE_CONFIRMATION)
      return 'reupload'
    return null
  }, [selectedOrder])

  const urgentType = useMemo<{ urgent: boolean; normal: boolean }>(() => {
    const typeList = { urgent: false, normal: false }
    const basicPrice = selectedOrder?.isReviewed
      ? REVIEWED_ORDER_PRICE
      : (UNREVIEWED_ORDER_PRICE ?? 0)
    if (reuploadPrice.includes(basicPrice)) {
      typeList.normal = true
    }
    if (reuploadPrice.includes(basicPrice + 1000)) {
      typeList.urgent = true
    }
    if (!typeList.normal || !typeList.urgent) {
      setFormState((prev) => ({
        ...prev,
        isUrgent: typeList.urgent,
      }))
    }
    console.log(typeList)
    return typeList
  }, [selectedOrder, reuploadPrice])

  function handleOrderSelect(value: string) {
    const currentOrder = orders.find((o) => o.orderNumber === value)
    if (!currentOrder) return

    setErrors({})
    setSelectedOrder(currentOrder)

    // Determine field editability and form value depending on the order state
    if (
      currentOrder?.state === ORDER_STATE.PENDING_UPLOAD // upload mode
    ) {
      setFormState(initialFormState)
      return
    }

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

    setFormState({
      adName: currentOrder.name ?? '',
      adText1: currentOrder.paragraphOne ?? '',
      adText2: currentOrder.paragraphTwo ?? '',
      adRange: undefined,
      adImage: photoData,
      isUrgent: currentOrder.isUrgent ?? false,
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    // Always validate "order" because it’s never disabled
    if (!selectedOrder) newErrors.order = '請選擇訂單'

    // Skip validation if the field is disabled in reupload page
    if (!adName.trim()) {
      newErrors.adName = '請輸入廣告名稱'
    }

    if (adText1.trim().length === 0 || adText1.trim().length > 50) {
      newErrors.adText1 = '請輸入 1 - 50 字以內的文字素材'
    }

    if (adText2.trim().length > 50) newErrors.adText2 = '文字素材二最多 50 字'

    if (!adRange?.from || !adRange?.to) {
      newErrors.adRange = '請選擇完整的排播起訖日期'
    }

    if (!adImage) {
      newErrors.adImage = '請上傳圖片檔案'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    // Build a complete GraphQL mutation payload in one step.
    // Use conditional spread syntax to include only editable fields.
    // This approach avoids later object mutations and ensures a clean, immutable data structure.
    const mutationData: OrderRecordForUploadMutation = {
      orderNumber: selectedOrder!.orderNumber,
      state: selectedOrder!.state,
      name: adName,
      paragraphOne: adText1,
      paragraphTwo: adText2,
      ...(adRange?.from &&
        adRange?.to && {
          scheduleStartDate: formatISO(adRange.from),
          scheduleEndDate: formatISO(adRange.to),
        }),
      ...(adImage && { image: { data: adImage.data } }),
      ...(selectedOrder?.state === ORDER_STATE.PENDING_QUOTE_CONFIRMATION && {
        isUrgent: formState.isUrgent,
      }),
    }

    // Build dialog preview data (for UI only)
    const dialogPreviewData: PreviewData = {
      orderNumber: selectedOrder!.orderNumber,
      adName,
      adText1,
      adText2,
      adImageName: adImage!.name,
      adRange: {
        from: formatTaiwanDate(adRange!.from!, 'yyyy/MM/dd'),
        to: formatTaiwanDate(adRange!.to!, 'yyyy/MM/dd'),
      },
      ...(selectedOrder?.state === ORDER_STATE.PENDING_QUOTE_CONFIRMATION && {
        isUrgent: formState.isUrgent,
      }),
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
                value={selectedOrder?.orderNumber}
                reuploadPrice={reuploadPrice}
              />

              {!!selectedOrder && (
                <>
                  {/* 急件訂單 */}
                  {mode === 'reupload' && (
                    <div className="-mt-4 flex items-center gap-2">
                      <Checkbox
                        id={adUrgentLabelId}
                        checked={formState.isUrgent}
                        disabled={!urgentType.normal || !urgentType.urgent}
                        onCheckedChange={(value) =>
                          setFormState((prev) => ({
                            ...prev,
                            isUrgent: Boolean(value),
                          }))
                        }
                      />
                      <label
                        htmlFor={adUrgentLabelId}
                        className="cursor-pointer text-sm font-medium text-text-primary"
                      >
                        這是急件訂單
                      </label>
                    </div>
                  )}

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
                      minWorkingDays={calculatedMinWorkingDays}
                      labelDescription={`最早可排播時間為<br class="md:hidden"/>上傳素材 ${calculatedMinWorkingDays} 個工作天後`}
                    />
                  </div>

                  {/* 文字素材一、二 */}
                  <LabeledField
                    id={adText1LabelId}
                    label="文字素材一 (50字內)"
                    labelIcon={<TextFormatIcon />}
                  >
                    <CustomInput
                      id={adText1LabelId}
                      type="text"
                      placeholder="請輸入第一段文字素材"
                      value={adText1}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          adText1: e.target.value,
                        }))
                      }
                      maxLength={50}
                      error={errors.adText1}
                      errorMessage={errors.adText1}
                    />
                  </LabeledField>

                  <LabeledField
                    id={adText2LabelId}
                    label="文字素材二 (50字內)"
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
                      maxLength={50}
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
          onConfirm={() => uploadData && onSubmit(uploadData)}
        />
      )}
    </>
  )
}
