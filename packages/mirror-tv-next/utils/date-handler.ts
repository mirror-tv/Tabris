import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

function formateDateAtTaipei(
  date: Date,
  formateString: string,
  suffixStr?: string
): string {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Asia/Taipei')
  const taipeiTime = dayjs(date).tz('Asia/Taipei').format(formateString)
  return `${taipeiTime} ${suffixStr}`
}

function getNextThursdayNoon() {
  const now = new Date()
  const timezoneOffset = 480 // 台灣時區偏移量 (UTC+8)
  const localOffset = now.getTimezoneOffset()
  const taiwanNow = new Date(
    now.getTime() + (timezoneOffset + localOffset) * 60 * 1000
  )

  // 取得當前星期幾（0 表示星期日，6 表示星期六）
  const currentDay = taiwanNow.getDay()
  let daysUntilNextWednesday = 3 - currentDay // 3 代表星期三

  // 如果今天已經是星期三且時間已經超過下午 1:30，跳到下個星期三
  if (
    daysUntilNextWednesday < 0 ||
    (daysUntilNextWednesday === 0 &&
      (taiwanNow.getHours() > 13 ||
        (taiwanNow.getHours() === 13 && taiwanNow.getMinutes() >= 30)))
  ) {
    daysUntilNextWednesday += 7 // 跳到下個星期三
  }

  // 設置為下一個星期三下午 1:30
  const nextWednesdayNoon = new Date(taiwanNow)
  nextWednesdayNoon.setDate(taiwanNow.getDate() + daysUntilNextWednesday)
  nextWednesdayNoon.setHours(13, 30, 0, 0)

  return nextWednesdayNoon
}

export { formateDateAtTaipei, getNextThursdayNoon }
