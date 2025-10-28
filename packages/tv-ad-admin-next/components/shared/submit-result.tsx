import { useRouter } from 'next/navigation'

import { Button } from '../ui/button'

import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import CloseCircleIcon from '@/public/icons/close-circle.svg'
import DoneCircleIcon from '@/public/icons/done-circle.svg'

type SubmitResultProps =
  | {
      pageTitle: string
      status?: 'failure' // default
      heading?: undefined
      message?: undefined
    }
  | {
      pageTitle: string
      status: 'success'
      heading: string
      message: string
    }

export default function SubmitResult({
  pageTitle,
  status = 'failure',
  heading,
  message,
}: SubmitResultProps) {
  const router = useRouter()
  const isSuccess = status === 'success'
  return (
    <>
      <PageHeader title={pageTitle} />
      <PageMain className="flex flex-1 items-start justify-center">
        <section className="mt-20 flex flex-col items-center gap-2">
          {isSuccess ? (
            <>
              <DoneCircleIcon className="size-12 text-primary" />
              <h4>{heading}</h4>
              <span className="text-gray-6">{message}</span>
            </>
          ) : (
            <>
              <CloseCircleIcon className="size-12 text-gray-5" />
              <h4>抱歉，出了點問題</h4>
              <span className="text-gray-6 text-center">
                請重新嘗試，或聯繫客服信箱 mirror@mirrormedia.mg
              </span>
            </>
          )}
          <Button intent="secondary" onClick={() => router.push('/')}>
            回首頁
          </Button>
        </section>
      </PageMain>
    </>
  )
}
