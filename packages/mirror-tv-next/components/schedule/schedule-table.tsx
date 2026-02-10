'use client'

import Image from 'next/image'
import { useState } from 'react'
import CustomDropDown from '~/components/schedule/custom-dropdown'
import WeekDatesPicker from '~/components/schedule/week-dates-picker'
import styles from './_styles/schedule-table.module.scss'
import type { Schedule } from '~/types/common'

type ScheduleProps = {
  schedule: Schedule[]
  weekDates: WeekDate[]
}

type WeekDate = {
  date: string
  dayOfWeek: string
  year: number
}

export default function ScheduleTable({
  schedule,
  weekDates,
}: ScheduleProps): JSX.Element {
  const initialDay = weekDates[0]

  const [selectedDate, setSelectedDate] = useState<WeekDate>({
    date: initialDay.date,
    dayOfWeek: initialDay.dayOfWeek,
    year: initialDay.year,
  })

  const handleSelect = (selectedDate: WeekDate) => {
    setSelectedDate(selectedDate)
  }

  const sortData = (data: Schedule[]) => {
    return data.sort((a, b) => {
      const startTimeA =
        parseInt(a['Start Time(hh)']) * 60 + parseInt(a['Start Time(mm)'])
      const startTimeB =
        parseInt(b['Start Time(hh)']) * 60 + parseInt(b['Start Time(mm)'])

      return startTimeA - startTimeB
    })
  }

  const getSchedule = () => {
    const filterDate = selectedDate.date

    const data = schedule?.filter(
      (item) =>
        item.Month === filterDate.split('/')[0] &&
        item.Day === filterDate.split('/')[1]
    )

    return sortData(data)
  }

  const formatSchedules = getSchedule() ?? []
  const doesHaveSchedules = formatSchedules.length

  // format schedule table
  const formatHourTime = (time: string) => {
    const stringTime = time.toString()
    return stringTime.length > 1 ? stringTime : '0' + stringTime
  }

  const formatMinuteTime = (time: string) => {
    const stringTime = time.toString()
    return stringTime.length > 1 ? stringTime : stringTime + '0'
  }

  const getShowEndTime = (index: number) => {
    const nextShowIndex = index + 1
    if (nextShowIndex >= formatSchedules.length) {
      return '24:00'
    }
    return `${formatHourTime(
      formatSchedules[nextShowIndex]['Start Time(hh)']
    )}:${formatMinuteTime(formatSchedules[nextShowIndex]['Start Time(mm)'])}`
  }

  // const isReplay = (item) => {
  //   return item?.TxCategory === 'Repeat'
  // }

  return (
    <div>
      <WeekDatesPicker
        weekDates={weekDates}
        selectedDate={selectedDate}
        onButtonClick={handleSelect}
      />
      <CustomDropDown
        weekDates={weekDates}
        selectedDate={selectedDate}
        onDateChange={handleSelect}
      />

      {/* Render schedule based on the selected date */}
      {doesHaveSchedules ? (
        <div>
          <table className={styles.scheduleTable}>
            <thead>
              <tr>
                <th className={styles.show__time}>時間</th>
                <th className={styles.show__name}>節目名稱</th>
                <th className={styles.show__ep} />
                <th className={styles.show__rating} />
              </tr>
            </thead>
            <tbody>
              {formatSchedules.map((item, index) => (
                <tr
                  key={`${item.Programme}-${item['Start Time(hh)']}-${index}`}
                >
                  <td className={styles.show__time}>
                    {`${formatHourTime(
                      item['Start Time(hh)']
                    )}:${formatMinuteTime(
                      item['Start Time(mm)']
                    )}-${getShowEndTime(index)}`}
                  </td>
                  <td className={styles.show__name}>
                    {item.Programme}
                    {item['ep name'] && (
                      <span className={styles.show__name_ep}>
                        {item['ep name']}
                      </span>
                    )}
                  </td>
                  <td className={styles.show__ep}>{item['ep name']}</td>
                  <td className={styles.show__rating}>{item.Class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.noSchedule}>
          <Image
            src="/images/magnifier-with-question-mark.png"
            alt="找不到當日節目表"
            width={128}
            height={128}
          />
          <span>找不到當日節目表</span>
          <span>請選擇其他日查看</span>
        </div>
      )}
    </div>
  )
}
