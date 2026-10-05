'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import GPTAd from '~/components/ads/gpt/gpt-ad'
import type { SlotRenderEndedEvent } from '~/types/event'
import styles from './_styles/gpt-anchor.module.scss'

const ANCHOR_DELAY_MS = 60_000

function GptAnchor() {
  const [shouldRequest, setShouldRequest] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShouldRequest(true)
    }, ANCHOR_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  const handleSlotRenderEnded = useCallback((event: SlotRenderEndedEvent) => {
    const size = event?.size
    if (size && size?.[0] !== 1 && size?.[1] !== 1) {
      setIsVisible(true)
    }
  }, [])

  if (!shouldRequest) {
    return null
  }

  return (
    <div
      className={`${styles.anchor}${isVisible ? ` ${styles.shouldShow}` : ''}`}
    >
      <GPTAd
        adUnit="mnews_m_article_footer_320x50"
        onSlotRenderEnded={handleSlotRenderEnded}
      />
    </div>
  )
}

export default dynamic(() => Promise.resolve(GptAnchor), { ssr: false })
