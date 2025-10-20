'use client'

import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import SubmitResult from '@/components/shared/submit-result'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'

export type SubmitStatus = 'idle' | 'success' | 'failure'

type EditPageLayoutProps = {
  pageTitle: string
  children: React.ReactNode
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  submitButtonName: string
  cardTitle?: string
  submitStatus: SubmitStatus
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
  submitStatus,
}: EditPageLayoutProps) {
  const orderInfo = [
    { title: '訂單編號', value: '#' + Mock_Order_Number },
    { title: '廣告名稱', value: Mock_Order_Name },
    { title: '排播日期', value: Mock_Order_Date },
  ]

  if (submitStatus === 'success') {
    return (
      <SubmitResult
        pageTitle={pageTitle}
        status="success"
        heading="送出成功"
        message="業務會寄信給您溝通後續修改事宜，再請密切注意"
      />
    )
  } else if (submitStatus === 'failure') {
    return <SubmitResult pageTitle={pageTitle} />
  }

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
                <span className="typography-body2">{info.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Dynamic form section */}
        <form onSubmit={onSubmit}>
          <Card>
            {!!cardTitle && <CardTitle>{cardTitle}</CardTitle>}
            <CardContent className="space-y-3xl">{children}</CardContent>
            <CardFooter className="justify-end gap-2">
              <Button
                variant="outline"
                intent="secondary"
                type="button"
                onClick={() => alert('取消')}
              >
                取消
              </Button>
              <Button type="submit">{submitButtonName}</Button>
            </CardFooter>
          </Card>
        </form>
      </PageMain>
    </>
  )
}
