'use client'

import { useEffect, useRef, useState } from 'react'
import useWindowDimensions from '~/hooks/use-window-dimensions'
import type { SlotRenderEndedEvent, SlotRequestedEvent } from '~/types/event'
import {
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

export default function GPTAdClient({
  adUnit,
  onSlotRequested,
  onSlotRenderEnded,
}: GPTAdProps) {
  const [shouldShowAd, setShouldShowAd] = useState(false)
  const [slot, setSlot] = useState<ResolvedAdSlot | undefined>()
  const { width = 0 } = useWindowDimensions()
  const onSlotRequestedRef = useRef(onSlotRequested)
  const onSlotRenderEndedRef = useRef(onSlotRenderEnded)
  onSlotRequestedRef.current = onSlotRequested
  onSlotRenderEndedRef.current = onSlotRenderEnded

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

  const adUnitPath = slot?.adUnitPath
  const gptDivId = slot?.gptDivId
  const adSize = slot?.adSize

  useEffect(() => {
    if (
      !shouldShowAd ||
      !adUnitPath ||
      !gptDivId ||
      !adSize ||
      typeof window === 'undefined' ||
      !window.googletag
    ) {
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
      if (!document.getElementById(gptDivId)) {
        mountedAdDivIds.delete(gptDivId)
        console.warn(`[GPTAd] defineSlot skipped, missing DIV ${gptDivId}`)
        return
      }

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
  }, [shouldShowAd, adUnitPath, gptDivId, adSize])

  return null
}
