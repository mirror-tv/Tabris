'use client'

import Link from 'next/link'

import StateCard from '@/components/dashboard/state-card'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { OrderStateMap } from '@/constants'
import FileIcon from '@/public/icons/file.svg'
import UploadIcon from '@/public/icons/upload.svg'

// import { mockOrderData } from '@/mocks/mockData'

export default function DashboardPage() {
  const stateStats = [
    { state: 'pending', count: 10 },
    { state: 'approved', count: 5 },
    { state: 'rejected', count: 3 },
    { state: 'cancelled', count: 2 },
  ]
  // const [stateStats, setStateStats] = useState<StateStats[]>([])

  // const getStateStats = () => {
  //   const stateOrder: { state: string; count: number }[] = []

  //   mockOrderData.forEach((order) => {
  //     const existing = stateOrder.find((item) => item.state === order.state)
  //     if (!existing) {
  //       stateOrder.push({ state: order.state, count: 1 })
  //     } else {
  //       existing.count++
  //     }
  //   })

  //   return stateOrder
  // }

  // const fetchOrdersStateStats = () => {
  //   try {
  //     setStateStats(getStateStats())
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // useEffect(() => {
  //   fetchOrdersStateStats()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <>
      <PageHeader variant="spread" title="鏡新聞個人廣告系統" />
      <PageMain className="grid grid-rows-[auto_1fr] gap-4 py-5 md:gap-10 md:py-10">
        {/* --- Top two cards --- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {/* Upload Card */}
          <Link href="/upload">
            <Card className="cursor-pointer items-center justify-center gap-3 hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.10)]">
              <UploadIcon className="size-10 text-blue-7" />
              <CardTitle className="flex flex-col items-center gap-1">
                <span>上傳廣告素材</span>
                <CardDescription>上傳後即可進入製作流程</CardDescription>
              </CardTitle>
            </Card>
          </Link>

          {/* history Card */}
          <Link href="/list">
            <Card className="cursor-pointer items-center justify-center gap-3 hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.10)]">
              <FileIcon className="size-10 text-blue-7" />
              <CardTitle className="flex flex-col items-center gap-1">
                <span>訂單紀錄</span>
                <CardDescription>查看與管理所有訂單</CardDescription>
              </CardTitle>
            </Card>
          </Link>
        </div>

        {/* --- Bottom: Order state overview --- */}
        <Card>
          <CardHeader>
            <CardTitle>訂單狀態總覽</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-4 md:gap-4 xl:grid-cols-6">
            {stateStats.map(({ state, count }) => {
              const config = OrderStateMap[state as keyof typeof OrderStateMap]
              if (!config) return null

              return (
                <Link key={state} href={`/list?state=${state}`}>
                  <StateCard
                    count={count}
                    text={config.label}
                    color={config.colors.text}
                    bgColor={config.colors.bg}
                  />
                </Link>
              )
            })}
          </CardContent>
        </Card>
      </PageMain>
    </>
  )
}
