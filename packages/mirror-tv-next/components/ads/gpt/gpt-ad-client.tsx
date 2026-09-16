'use client'
import styles from './_styles/gpt-ad.module.scss'

import { useEffect, useRef, useState } from 'react'
import useWindowDimensions from '~/hooks/use-window-dimensions'
import type { SlotRenderEndedEvent, SlotRequestedEvent } from '~/types/event'
import {
  getAdWidth,
  resolveAdSlot,
  shouldDisplayAdSlot,
  type ResolvedAdSlot,
} from '~/utils/gpt-ad'

export type GPTAdProps = {
  adUnit: string
  onSlotRequested?: (event: SlotRequestedEvent) => void
  onSlotRenderEnded?: (event: SlotRenderEndedEvent) => void
  className?: string
}

const mountedAdDivIds = new Set<string>()

function getGptSlotByDivId(divId: string): googletag.Slot | undefined {
  return window.googletag
    .pubads()
    .getSlots()
    .find((gptSlot) => gptSlot.getSlotElementId() === divId)
}

const GPTAdRoot = ({
  slot,
  onSlotRequested,
  onSlotRenderEnded,
}: {
  slot: ResolvedAdSlot
  onSlotRequested?: (event: SlotRequestedEvent) => void
  onSlotRenderEnded?: (event: SlotRenderEndedEvent) => void
}) => {
  const { adUnitPath, adSize, gptDivId, minHeight } = slot
  const adWidth = getAdWidth(adSize)
  const onSlotRequestedRef = useRef(onSlotRequested)
  const onSlotRenderEndedRef = useRef(onSlotRenderEnded)
  onSlotRequestedRef.current = onSlotRequested
  onSlotRenderEndedRef.current = onSlotRenderEnded

  useEffect(() => {
    if (!gptDivId || !window.googletag) {
      return
    }

    let adSlot: googletag.Slot | undefined

    const handleOnSlotRequested = (event: SlotRequestedEvent) => {
      if (event.slot === adSlot) {
        onSlotRequestedRef.current?.(event)
      }
    }

    const handleOnSlotRenderEnded = (event: SlotRenderEndedEvent) => {
      if (event.slot === adSlot) {
        onSlotRenderEndedRef.current?.(event)
      }
    }

    if (mountedAdDivIds.has(gptDivId)) {
      console.warn(`[GPTAd] skip duplicate slot ${gptDivId}`)
      return
    }
    mountedAdDivIds.add(gptDivId)

    window.googletag.cmd.push(() => {
      const leftover = getGptSlotByDivId(gptDivId)
      if (leftover) {
        window.googletag.destroySlots([leftover])
      }

      const defined = window.googletag.defineSlot(adUnitPath, adSize, gptDivId)
      if (!defined) {
        mountedAdDivIds.delete(gptDivId)
        console.warn(`[GPTAd] defineSlot failed for ${gptDivId}`)
        return
      }

      adSlot = defined.addService(window.googletag.pubads())
      const pubads = window.googletag.pubads()
      pubads.addEventListener('slotRequested', handleOnSlotRequested)
      pubads.addEventListener('slotRenderEnded', handleOnSlotRenderEnded)
      window.googletag.display(gptDivId)
    })

    return () => {
      mountedAdDivIds.delete(gptDivId)

      if (
        typeof window === 'undefined' ||
        !window.googletag ||
        !window.googletag.cmd
      ) {
        return
      }

      window.googletag.cmd.push(() => {
        const pubads = window.googletag.pubads()
        pubads.removeEventListener('slotRequested', handleOnSlotRequested)
        pubads.removeEventListener('slotRenderEnded', handleOnSlotRenderEnded)
        if (adSlot) {
          window.googletag.destroySlots([adSlot])
        }
      })
    }
    // 只在版位身分改變時重定義；adSize 隨同一 gptDivId 固定，不列入 deps。
  }, [adUnitPath, gptDivId])

  return (
    <div
      className={`${styles.wrapper} gpt-ad`}
      style={minHeight ? { minHeight: `${minHeight}px` } : undefined}
    >
      <div
        className={styles.ad}
        style={{
          maxWidth: '100%',
          textAlign: 'center',
          width: adWidth || 'unset',
        }}
        id={gptDivId}
      />
    </div>
  )
}

export default function GPTAdClient({
  adUnit,
  onSlotRequested,
  onSlotRenderEnded,
}: GPTAdProps) {
  const [shouldShowAd, setShouldShowAd] = useState(false)
  const [slot, setSlot] = useState<ResolvedAdSlot | undefined>()
  const { width = 0 } = useWindowDimensions()

  useEffect(() => {
    if (!width || !adUnit) {
      return
    }

    const resolved = resolveAdSlot(adUnit)
    setSlot((prev) => {
      if (!resolved) {
        return undefined
      }
      if (
        prev?.gptDivId === resolved.gptDivId &&
        prev?.adUnitPath === resolved.adUnitPath
      ) {
        return prev
      }
      return resolved
    })
    setShouldShowAd(resolved ? shouldDisplayAdSlot(resolved, width) : false)
  }, [adUnit, width])

  if (!shouldShowAd || !slot) {
    return null
  }

  return (
    <GPTAdRoot
      slot={slot}
      onSlotRenderEnded={onSlotRenderEnded}
      onSlotRequested={onSlotRequested}
    />
  )
}
