import 'server-only'
import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'

export function parseUserAgentInfo() {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const ipAddress =
    headersList.get('x-forwarded-for') || headersList.get('remote-addr') || ''
  const pathname = headersList.get('referer') || ''

  const parser = new UAParser(userAgent)
  const result = parser.getResult()

  const browser = {
    name: result.browser.name || '',
    version: result.browser.version || '',
  }

  const device = {
    model: result.device.model || '',
    vendor: result.device.vendor || '',
  }

  const os = {
    name: result.os.name || '',
    version: result.os.version || '',
  }

  return { ipAddress, pathname, browser, device, os }
}
