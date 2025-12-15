import 'server-only'
import { headers } from 'next/headers'

export function parseUserAgentInfo() {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const ipAddress =
    headersList.get('x-forwarded-for') || headersList.get('remote-addr') || ''
  const pathname = headersList.get('referer') || ''

  return { userAgent, ipAddress, pathname }
}
