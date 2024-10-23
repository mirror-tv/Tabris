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
  let daysUntilNextThursday = 4 - currentDay // 4 代表星期四

  // 如果今天已經是星期四且時間已經超過中午 12 點，跳到下個星期四
  if (
    daysUntilNextThursday < 0 ||
    (daysUntilNextThursday === 0 && taiwanNow.getHours() >= 12)
  ) {
    daysUntilNextThursday += 7 // 跳到下個星期四
  }

  // 設置為下一個星期四中午 12:00
  const nextThursdayNoon = new Date(taiwanNow)
  nextThursdayNoon.setDate(taiwanNow.getDate() + daysUntilNextThursday)
  nextThursdayNoon.setHours(12, 0, 0, 0)

  return nextThursdayNoon
}

export { formateDateAtTaipei, getNextThursdayNoon }
