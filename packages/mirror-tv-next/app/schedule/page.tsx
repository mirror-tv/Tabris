import errors from '@twreporter/errors'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import ScheduleTable from '~/components/schedule/schedule-table'
import {
  GLOBAL_CACHE_SETTING,
  SCHEDULE_JSON_URL,
  SITE_URL,
} from '~/constants/environment-variables'
import styles from '~/styles/pages/schedule-page.module.scss'
import type { Schedule } from '~/types/common'
import dynamic from 'next/dynamic'
import { GPTPlaceholderDesktop } from '~/components/ads/gpt/gpt-placeholder'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))

export const revalidate = GLOBAL_CACHE_SETTING

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '節目表 - 鏡新聞',
  openGraph: {
    title: '節目表 - 鏡新聞',
    images: {
      url: '/images/default-og-img.jpg',
    },
  },
}

type WeekDate = {
  date: string
  dayOfWeek: string
  year: number
}

async function getData() {
  try {
    const res = await fetch(SCHEDULE_JSON_URL, {
      next: { revalidate: GLOBAL_CACHE_SETTING },
    })

    if (!res.ok) {
      console.error('Failed to fetch schedule data')
      return []
    }

    return res.json()
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching schedule'
    )

    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(annotatingError, {
          withStack: false,
          withPayload: true,
        }),
      })
    )
    return
  }
}

export default async function SchedulePage() {
  let schedule: Schedule[] = []

  schedule = await getData()

  const dayOfWeekMap: { [key: string]: string } = {
    Monday: '星期一',
    Tuesday: '星期二',
    Wednesday: '星期三',
    Thursday: '星期四',
    Friday: '星期五',
    Saturday: '星期六',
    Sunday: '星期日',
  }

  //get week days
  const weekDates: WeekDate[] = []
  for (let i = 0; i < 7; i++) {
    const date = dayjs().add(i, 'day')
    const item: WeekDate = {
      date: date.format('M/D'),
      dayOfWeek: dayOfWeekMap[date.format('dddd')],
      year: date.year(),
    }
    weekDates.push(item)
  }

  return (
    <main className={styles.main}>
      <GPTPlaceholderDesktop>
        <p>廣告</p>
        <GPTAd pageKey="all" adKey="PC_HD" />
      </GPTPlaceholderDesktop>
      <ScheduleTable schedule={schedule} weekDates={weekDates} />
    </main>
  )
}
