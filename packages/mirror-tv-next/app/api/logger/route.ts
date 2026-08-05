import { NextResponse } from 'next/server'
import { z } from 'zod'
import { logPageView } from '~/utils/page-view-log'
import { SITE_URL } from '~/constants/environment-variables'

const MAX_BODY_BYTES = 8 * 1024
const MAX_URL_LENGTH = 2048
const MAX_SCREEN_DIMENSION = 10000
const MAX_EXTRA_VALUE_LENGTH = 256

// Keys must stay in sync with the extra passed by PageLogger callers, and with
// the BigQuery schema the log sink writes into. Unlisted keys are dropped.
const ALLOWED_EXTRA_KEYS = [
  'storyId',
  'storyTitle',
  'authorNames',
  'photographers',
  'cameraOperators',
  'designers',
  'engineers',
  'vocals',
  'externalId',
  'externalTitle',
  'authorName',
]

// Zoomed viewports report fractional pixels, so round before the int check
// rather than rejecting the whole page view.
const ScreenDimensionSchema = z
  .number()
  .finite()
  .transform(Math.round)
  .pipe(z.number().int().min(0).max(MAX_SCREEN_DIMENSION))

const PageViewLogPayloadSchema = z.object({
  currentUrl: z.string().max(MAX_URL_LENGTH).refine(isOwnSiteUrl, {
    message: 'currentUrl is not on an allowed host',
  }),
  // Referrers are mostly external (search, social), so only the length is
  // bounded here; an oversized one is dropped instead of failing the request.
  referrer: z.string().max(MAX_URL_LENGTH).catch(''),
  screenSize: z.object({
    width: ScreenDimensionSchema,
    height: ScreenDimensionSchema,
  }),
  // A malformed extra should not drop the whole page view log.
  extra: z
    .record(z.string(), z.unknown())
    .default({})
    .catch({})
    .transform(pickAllowedExtra),
})

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get('content-length'))

  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
  }

  let rawBody: string

  try {
    rawBody = await request.text()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  // Chunked requests omit Content-Length, so the real size is checked here too.
  if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
  }

  let body: unknown

  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const result = PageViewLogPayloadSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      {
        error: `Invalid payload: ${JSON.stringify(result.error.issues)}`,
      },
      { status: 400 }
    )
  }

  try {
    await logPageView(result.data)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[api/logger] failed', err)
    return NextResponse.json({ error: 'Failed to write log' }, { status: 500 })
  }
}

function isOwnSiteUrl(rawUrl: string): boolean {
  let parsed: URL

  try {
    parsed = new URL(rawUrl)
  } catch {
    return false
  }

  if (
    process.env.NODE_ENV === 'development' &&
    ['localhost', '127.0.0.1'].includes(parsed.hostname)
  ) {
    return true
  }

  return parsed.origin === new URL(SITE_URL).origin
}

function pickAllowedExtra(
  extra: Record<string, unknown>
): Record<string, unknown> {
  const picked: Record<string, unknown> = {}

  for (const key of ALLOWED_EXTRA_KEYS) {
    const value = extra[key]

    if (typeof value === 'string') {
      picked[key] = value.slice(0, MAX_EXTRA_VALUE_LENGTH)
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      picked[key] = value
    } else if (typeof value === 'boolean') {
      picked[key] = value
    }
  }

  return picked
}
