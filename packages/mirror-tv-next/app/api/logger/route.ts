import { NextResponse } from 'next/server'
import { logPageView, type PageViewLogPayload } from '~/utils/page-view-log'

function isValidScreenSize(
  value: unknown
): value is PageViewLogPayload['screenSize'] {
  if (!value || typeof value !== 'object') return false
  const { width, height } = value as Record<string, unknown>
  return typeof width === 'number' && typeof height === 'number'
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { currentUrl, referrer, screenSize, extra } = body as Record<
    string,
    unknown
  >

  if (typeof currentUrl !== 'string' || typeof referrer !== 'string') {
    return NextResponse.json(
      { error: 'currentUrl and referrer are required strings' },
      { status: 400 }
    )
  }

  if (!isValidScreenSize(screenSize)) {
    return NextResponse.json(
      { error: 'screenSize with numeric width and height is required' },
      { status: 400 }
    )
  }

  const payload: PageViewLogPayload = {
    currentUrl,
    referrer,
    screenSize,
    extra:
      extra && typeof extra === 'object' && !Array.isArray(extra)
        ? (extra as Record<string, unknown>)
        : {},
  }

  try {
    await logPageView(payload)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[api/logger] failed', err)
    return NextResponse.json({ error: 'Failed to write log' }, { status: 500 })
  }
}
