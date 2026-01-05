'use client'

import { useReferrer } from '~/context/referrer-context'

export function useReferrerTracker() {
  const { currentUrl, previousUrl } = useReferrer()

  return { currentUrl, referrer: previousUrl }
}
