'use client'

import { useState } from 'react'

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
import FileIcon from '@/public/icons/file.svg'
import ImageIcon from '@/public/icons/image.svg'
import TextFormatIcon from '@/public/icons/text-format.svg'
import TextIcon from '@/public/icons/text.svg'
import TriangleExclamationIcon from '@/public/icons/triangle-exclamation.svg'
import { cn } from '@/utils'

const orderId = 'order'
const adNameId = 'adName'
const text1Id = 'text1'
const text2Id = 'text2'
const uploadId = 'upload'
const fileInputId = 'fileInput'

export default function UploadPage() {
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    if (!['image/jpeg', 'image/png'].includes(uploadedFile.type)) {
      setErrors((prev) => ({
        ...prev,
        file: '僅支援 JPG 或 PNG 格式',
      }))
      setFile(null)
      return
    }

    if (uploadedFile.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: '檔案大小不可超過 5MB',
      }))
      setFile(null)
      return
    }

    setFile(uploadedFile)
    setErrors((prev) => ({ ...prev, file: '' }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!order) newErrors.order = '請選擇訂單'
    if (!adName.trim()) newErrors.adName = '請輸入廣告名稱'
    if (text1.trim().length === 0 || text1.trim().length > 10)
      newErrors.text1 = '請輸入 1–10 字以內的文字素材'
    if (text2.trim().length > 10) newErrors.text2 = '文字素材二最多 10 字'
    if (!range?.from || !range?.to) newErrors.range = '請選擇完整的排播起訖日期'
    if (!file) newErrors.file = '請上傳圖片檔案'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    const formattedRange = {
      from: format(range!.from!, 'yyyy-MM-dd'),
      to: format(range!.to!, 'yyyy-MM-dd'),
    }

    const data: UploadSubmittedData = {
      order: order!,
      adName,
      text1,
      text2: text2 || undefined,
      fileName: file!.name,
      range: formattedRange,
    }

    setSubmittedData(data)
    setIsDialogOpen(true)
  }

  function handleConfirmUpload() {
    console.log('正在送出素材資料:', submittedData)
    // TODO: 之後可改為實際 API 請求
  }

  return (
    <>
      <PageHeader title="上傳廣告素材" />
      <PageMain className="py-5 md:py-10">
        <Card>
          <CardHeader>
            <CardTitle>上傳廣告素材</CardTitle>
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
                <Select onValueChange={(v) => setOrder(v)}>
                  <SelectTrigger
                    id={orderId}
                    className={cn(
                      'w-full data-placeholder:bg-gray-2 data-placeholder:text-gray-5!',
                      errors.order && [
                        'border border-red-7',
                        'focus:border-red-8',
                      ]
                    )}
                  >
                    <SelectValue placeholder="請選擇要上傳素材的訂單" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order1">訂單 A</SelectItem>
                    <SelectItem value="order2">訂單 B</SelectItem>
                  </SelectContent>
                </Select>
                {errors.order && <ErrorMessage>{errors.order}</ErrorMessage>}
              </LabeledField>

              {/* 廣告名稱 + 排播日期 */}
              <div className="grid gap-4 md:grid-cols-2">
                <LabeledField
                  className="mb-2"
                  id={adNameId}
                  label="廣告名稱"
                  labelIcon={<TextIcon />}
                >
                  <CustomInput
                    id={adNameId}
                    type="text"
                    onChange={(e) => setAdName(e.target.value)}
                    placeholder="請輸入廣告名稱"
                    error={errors.adName}
                    errorMessage={errors.adName}
                  />
                </LabeledField>

                <PopoverCalendar
                  range={range}
                  setRange={setRange}
                  error={errors.range}
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
                  onChange={(e) => setText1(e.target.value)}
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
                    className={cn(
                      'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-3 p-6 text-center',
                      errors.file && [
                        'border border-red-7',
                        'focus:border-red-8',
                      ]
                    )}
                  >
                    <ImageIcon className="mb-2 size-12 text-gray-5" />
                    {file ? (
                      <>
                        <p className="text-text-secondary">
                          已選擇檔案：
                        </p>
                        <p className="font-medium text-text-primary">
                          {file.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          intent="secondary"
                          onClick={() =>
                            document.getElementById(fileInputId)?.click()
                          }
                        >
                          選擇圖片檔案
                        </Button>
                        <input
                          id={fileInputId}
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      支援 JPG, PNG 格式，檔案大小不超過 5MB
                    </p>
                    {errors.file && <ErrorMessage>{errors.file}</ErrorMessage>}
                  </div>
                </LabeledField>
              </div>

              {/* 提示文字 */}
              <Instructions
                title="重要提醒"
                icon={<TriangleExclamationIcon />}
                wordings={[
                  '素材送出後將無法編輯、修改，請確認所有上傳內容正確無誤',
                ]}
              />
            </CardContent>
            <CardFooter className="mt-6 justify-center">
              <Button type="submit" size="lg">
                上傳素材
              </Button>
            </CardFooter>
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
