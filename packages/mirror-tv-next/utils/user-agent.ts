import 'server-only'
import { headers, type UnsafeUnwrappedHeaders } from 'next/headers'
import { UAParser } from 'ua-parser-js'

export function parseUserAgent(userAgent: string) {
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

  const inAppPatterns = [
    'fbav',
    'instagram',
    'line',
    'wechat',
    'micromessenger',
    'tiktok',
    'snapchat',
  ]

  const webviewPatterns = ['wv', 'webview', '; wv', ';webview', 'mobile safari']

  const isInAppBrowser = inAppPatterns.some((pattern) =>
    userAgent.toLowerCase().includes(pattern)
  )

  const isWebview = webviewPatterns.some((pattern) =>
    userAgent.toLowerCase().includes(pattern)
  )

  return { browser, device, os, isInAppBrowser, isWebview }
}

export function parseUserAgentInfo() {
  const headersList = headers() as unknown as UnsafeUnwrappedHeaders
  const userAgent = headersList.get('user-agent') || ''
  const ipAddress =
    headersList.get('x-forwarded-for') || headersList.get('remote-addr') || ''
  const refererUrl = headersList.get('referer') || ''

  const parsedData = parseUserAgent(userAgent)

  return { ipAddress, refererUrl, ...parsedData }
}
