'use client'

import { useEffect, useMemo } from 'react'
import { logPageView } from '~/app/_actions/logging'
import { useReferrerTracker } from '~/hooks/use-referrer-tracker'

export default function PageLogger({
  extra,
}: {
  extra?: Record<string, unknown>
}) {
  const { currentUrl, referrer: clientReferrer } = useReferrerTracker()
  const extraKey = stringifyLogExtra(extra)
  const stableExtra = useMemo(() => {
    return JSON.parse(extraKey) as Record<string, unknown>
  }, [extraKey])

  const initialReferrer =
    typeof document !== 'undefined' ? document.referrer : ''

  const screenSize = useMemo(() => {
    if (typeof window === 'undefined') return null
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }, [])

  useEffect(() => {
    const log = async () => {
      if (!screenSize) return

      await logPageView({
        currentUrl: window.location.href,
        referrer: clientReferrer || initialReferrer || '',
        screenSize,
        extra: stableExtra,
      })
    }

    void log().catch((err) => {
      console.error('[PageLogger] failed to log page view', err)
    })
  }, [clientReferrer, currentUrl, initialReferrer, screenSize, stableExtra])

  return null
}

function stringifyLogExtra(extra: Record<string, unknown> | undefined): string {
  try {
    // Keep effect deps stable for inline object literals; callers should pass JSON-safe values.
    return JSON.stringify(extra ?? {})
  } catch (err) {
    console.error('[PageLogger] failed to serialize extra', err)
    return '{}'
  }
}
