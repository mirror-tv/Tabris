import 'server-only'
import { headers } from 'next/headers'
import { NextRequest, userAgent } from 'next/server'

export function parseUserAgentInfo(request: NextRequest) {
  const headersList = headers()
  const userAgenInfo = headersList.get('user-agent') || ''
  const ipAddress =
    headersList.get('x-forwarded-for') || headersList.get('remote-addr') || ''
  const pathname = headersList.get('referer') || ''

  const { browser, device, os } = userAgent(request)

  const uaBrowser = {
    name: browser.name || '',
    version: browser.version || '',
  }

  const uaDevice = {
    model: device.model || '',
    vendor: device.vendor || '',
  }

  const uaOS = {
    name: os.name || '',
    version: os.version || '',
  }
  return { userAgenInfo, ipAddress, pathname, uaBrowser, uaDevice, uaOS }
}
