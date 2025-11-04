'use client'

import { useRouter } from 'next/navigation'

import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import { Button } from '@/components/ui/button'
import NotFoundIcon from '@/public/icons/close-circle.svg'

type NotFoundTemplateProps = {
  status?: string
  message?: string
}

export default function NotFoundTemplate({
  status,
  message = '這個頁面可能已被移除、路徑輸入錯誤或會員資料無效。',
}: NotFoundTemplateProps) {
  const router = useRouter()

  return (
    <>
      <PageHeader title="頁面不存在" />
      <PageMain className="flex flex-1 items-start justify-center">
        <section className="mt-20 flex flex-col items-center gap-3 text-center">
          <NotFoundIcon className="size-12 text-gray-5" />
          {status && <h2 className="font-semibold text-gray-8">{status}</h2>}
          <h4 className="text-gray-8">找不到該頁面</h4>
          <p className="text-gray-6">{message}</p>
          <Button
            intent="secondary"
            className="mt-4"
            onClick={() => router.push('/')}
          >
            回首頁
          </Button>
        </section>
      </PageMain>
    </>
  )
}
