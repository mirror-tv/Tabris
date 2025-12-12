import { Logging } from '@google-cloud/logging'
import { GCP_PROJECT_ID } from '~/constants/config'
import { ENV } from '~/constants/environment-variables'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

export async function logPageView() {
  const logging = new Logging({ projectId: GCP_PROJECT_ID })
  const eventType = 'page-view'
  const logName = `${GCP_PROJECT_ID}-${ENV}-web-${eventType}`
  const log = logging.log(logName)
  const taipeiTime = dayjs().tz('Asia/Taipei')
  const eventTriggeredDate = taipeiTime.format('YYYY/MM/DD')
  const eventTriggeredTime = taipeiTime.format('HH:mm')

  const metadata = {
    resource: { type: 'global' },
    severity: 'INFO',
    labels: {
      eventType,
      date: eventTriggeredDate,
      time: eventTriggeredTime,
    },
  }

  const entry = log.entry(metadata)

  return log.write(entry)
}
