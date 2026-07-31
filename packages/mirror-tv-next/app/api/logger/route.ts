import { NextResponse } from 'next/server'
import { z } from 'zod'
import { logPageView } from '~/utils/page-view-log'

const PageViewLogPayloadSchema = z.object({
  currentUrl: z.string(),
  referrer: z.string(),
  screenSize: z.object({
    width: z.number(),
    height: z.number(),
  }),
  // A malformed extra should not drop the whole page view log.
  extra: z.record(z.string(), z.unknown()).default({}).catch({}),
})

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
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
