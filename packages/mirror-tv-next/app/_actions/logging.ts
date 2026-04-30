'use server'

import { Logging } from '@google-cloud/logging'
import { GCP_LOG_NAME_PREFIX, GCP_PROJECT_ID } from '~/constants/constant'
import { ENV } from '~/constants/environment'
import { SITE_URL } from '~/constants/environment-variables'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { parseUserAgentInfo } from '~/utils/user-agent'

dayjs.extend(utc)
dayjs.extend(timezone)

export async function logPageView({
  currentUrl,
  referrer,
  screenSize,
  extra = {},
}: {
  currentUrl: string
  referrer: string
  screenSize: { width: number; height: number }
  extra?: Record<string, unknown>
}) {
  if (
    process.env.NODE_ENV === 'development' &&
    !process.env.GOOGLE_APPLICATION_CREDENTIALS
  ) {
    return
  }

  try {
    const logging = new Logging({ projectId: GCP_PROJECT_ID })
    const eventType = 'page-view'
    const logName = `${GCP_LOG_NAME_PREFIX}-${ENV}-web-${eventType}`
    const log = logging.log(logName)
    const taipeiTime = dayjs().tz('Asia/Taipei')
    const eventTriggeredDate = taipeiTime.format('YYYY/MM/DD')
    const eventTriggeredTime = taipeiTime.format('HH:mm')
    const {
      browser,
      device,
      os,
      isInAppBrowser,
      isWebview,
      ipAddress,
      refererUrl,
    } = parseUserAgentInfo()
    const { name: browserName, version: browserVersion } = browser
    const { model: deviceModel, vendor: deviceVendor } = device
    const { name: osName, version: osVersion } = os
    const pageURL = currentUrl || refererUrl
    const pageType = parsePageType(pageURL)
    const metadata = {
      resource: { type: 'global' },
      severity: 'INFO',
      labels: {
        eventType,
        date: eventTriggeredDate,
        time: eventTriggeredTime,
        browserName,
        browserVersion,
        deviceModel,
        deviceVendor,
        osName,
        osVersion,
        ipAddress,
        referrer,
      },
    }

    const jsonPayload = {
      pageURL,
      pageType,
      screenSize,
      isInAppBrowser,
      isWebview,
      extra,
    }

    const entry = log.entry(metadata, jsonPayload)

    await log.write(entry)
  } catch (err) {
    console.error('[logPageView] failed', err)
  }
}

function parsePageType(url: string) {
  if (!url) return 'unknown'

  let pathname = ''

  try {
    pathname = new URL(url, SITE_URL).pathname
  } catch {
    return 'unknown'
  }

  const parsed = pathname.split('/')

  switch (parsed[1]) {
    case '':
      return 'index'
    case 'topic':
      return parsed[2] ? 'topic' : 'topic-listing'
    default:
      return parsed[1] || 'unknown'
  }
}
