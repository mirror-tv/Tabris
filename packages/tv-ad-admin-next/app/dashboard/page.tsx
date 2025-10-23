'use client'

// import { useState, useEffect } from 'react'


import Image from 'next/image'
import Link from 'next/link'

import StatusCard from '@/components/dashboard/status-card'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { OrderStatusMap } from '@/constants'
import fileIcon from '@/public/icons/file.svg'
import uploadIcon from '@/public/icons/upload.svg'
// import { mockOrderData } from '@/mocks/mockData'

// type StatusStats = { status: string; count: number }

export default function DashboardPage() {
  const statusStats = [
    { status: 'pending', count: 10 },
    { status: 'approved', count: 5 },
    { status: 'rejected', count: 3 },
    { status: 'cancelled', count: 2 },
  ]
  // const [statusStats, setStatusStats] = useState<StatusStats[]>([])

  // const getStatusStats = () => {
  //   const statusOrder: { status: string; count: number }[] = []

  //   mockOrderData.forEach((order) => {
  //     const existing = statusOrder.find((item) => item.status === order.status)
  //     if (!existing) {
  //       statusOrder.push({ status: order.status, count: 1 })
  //     } else {
  //       existing.count++
  //     }
  //   })

  //   return statusOrder
  // }

  // const fetchOrdersStatusStats = () => {
  //   try {
  //     setStatusStats(getStatusStats())
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // useEffect(() => {
  //   fetchOrdersStatusStats()
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
              <Image
                src={uploadIcon}
                alt="upload"
                width={40}
                height={40}
                className="text-blue-7"
              />
              <CardTitle className="flex flex-col items-center gap-1">
                <span>上傳廣告素材</span>
                <CardDescription>上傳後即可進入製作流程</CardDescription>
              </CardTitle>
            </Card>
          </Link>

          {/* history Card */}
          <Link href="/list">
            <Card className="cursor-pointer items-center justify-center gap-3 hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.10)]">
              <Image
                src={fileIcon}
                alt="file"
                width={40}
                height={40}
                className="text-blue-7"
              />
              <CardTitle className="flex flex-col items-center gap-1">
                <span>訂單紀錄</span>
                <CardDescription>查看與管理所有訂單</CardDescription>
              </CardTitle>
            </Card>
          </Link>
        </div>

        {/* --- Bottom: Order status overview --- */}
        <Card>
          <CardHeader>
            <CardTitle>訂單狀態總覽</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-4 md:gap-4 xl:grid-cols-6">
            {statusStats.map(({ status, count }) => {
              const config =
                OrderStatusMap[status as keyof typeof OrderStatusMap]
              if (!config) return null

              return (
                <Link key={status} href={`/list?status=${status}`}>
                  <StatusCard
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
