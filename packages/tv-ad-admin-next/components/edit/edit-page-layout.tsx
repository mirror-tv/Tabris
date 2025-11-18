'use client'

import { useRouter } from 'next/navigation'

import { Skeleton } from '../ui/skeleton'
import { Spinner } from '../ui/spinner'

import type { OrderRecordForEdit } from '@/graphql/queries/orders'

import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'



type EditPageLayoutProps = {
  pageTitle: string
  children: React.ReactNode
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  submitButtonName: string
  cardTitle?: string
  orderData?: OrderRecordForEdit | null
  isLoading?: boolean
  isUploading?: boolean
}

const Mock_Order_Number = 'B7H8M3'
const Mock_Order_Name = '新年特惠商品'
const Mock_Order_Date = '2024/12/25-2025/12/31'

export default function EditPageLayout({
  pageTitle,
  children,
  onSubmit,
  submitButtonName,
  cardTitle,
  orderData,
  isLoading = false,
  isUploading = false,
}: EditPageLayoutProps) {
  const router = useRouter()

  const orderInfo = [
    {
      title: '訂單編號',
      value: '#' + orderData?.orderNumber || Mock_Order_Number,
    },
    { title: '廣告名稱', value: orderData?.name || Mock_Order_Name },
    {
      title: '排播日期',
      value:
        orderData?.scheduleStartDateString && orderData?.scheduleEndDateString
          ? orderData.scheduleStartDateString +
            '-' +
            orderData.scheduleEndDateString
          : Mock_Order_Date,
    },
  ]

  return (
    <>
      <PageHeader title={pageTitle} />
      <PageMain className="space-y-xl py-5 md:space-y-3xl md:py-10 xl:space-y-4xl">
        {/* Order info */}
        <Card>
          <CardTitle>訂單資料</CardTitle>
          <CardContent className="flex flex-col justify-between gap-3 md:flex-row">
            {orderInfo.map((info) => (
              <div key={info.title} className="flex flex-col">
                <h6 className="text-text-secondary">{info.title}</h6>
                {isLoading ? (
                  <Skeleton className="h-[29px] w-50 rounded-none" />
                ) : (
                  <span className="typography-body2 w-50">{info.value}</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Dynamic form section */}
        <form onSubmit={onSubmit}>
          <Card>
            {!!cardTitle && <CardTitle>{cardTitle}</CardTitle>}
            <CardContent className="space-y-4xl">{children}</CardContent>
            <CardFooter className="justify-end gap-2">
              <Button
                variant="outline"
                intent="secondary"
                type="button"
                size="lg"
                onClick={() => router.back()}
              >
                取消
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || isUploading}
              >
                {submitButtonName}
                {isUploading && <Spinner className="text-gray-5" />}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </PageMain>
    </>
  )
}
