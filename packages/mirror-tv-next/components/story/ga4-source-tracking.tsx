'use client'

import { useEffect } from 'react'
import { GA4_ID } from '~/constants/environment-variables'

interface GA4SourceTrackingProps {
  source?: string
}

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}

export default function GA4SourceTracking({ source }: GA4SourceTrackingProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag && source) {
      // GA4 使用 gtag 設定 custom dimensions
      // dimension1 對應舊版的 dimension1
      window.gtag('config', GA4_ID, {
        custom_map: {
          dimension1: source,
        },
      })
    }
  }, [source])

  return null
}
