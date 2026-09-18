'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  getAdWidth,
  resolveAdSlot,
  type ResolvedAdSlot,
} from '~/utils/gpt-ad'
import type { GPTAdProps } from './gpt-ad-client'
import styles from './_styles/gpt-ad.module.scss'

const GPTAdClient = dynamic(() => import('./gpt-ad-client'), { ssr: false })

const DEVICE_CLASS = {
  PC: styles.devicePc,
  MB: styles.deviceMb,
  ALL: styles.deviceAll,
} as const

function useWarnDuplicateGptDivId(adUnit: string, gptDivId: string) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    const count = document.querySelectorAll(
      `[id="${CSS.escape(gptDivId)}"]`
    ).length
    if (count > 1) {
      console.error(
        `[GPTAd] duplicate id ${gptDivId} (adUnit=${adUnit}), count=${count}`
      )
    }
  }, [adUnit, gptDivId])
}

export default function GPTAd({
  adUnit,
  onSlotRequested,
  onSlotRenderEnded,
  className,
}: GPTAdProps) {
  const slot = resolveAdSlot(adUnit)
  if (!slot) {
    return null
  }

  return (
    <GPTAdSlot
      slot={slot}
      adUnit={adUnit}
      onSlotRequested={onSlotRequested}
      onSlotRenderEnded={onSlotRenderEnded}
      className={className}
    />
  )
}

function GPTAdSlot({
  slot,
  adUnit,
  onSlotRequested,
  onSlotRenderEnded,
  className,
}: GPTAdProps & { slot: ResolvedAdSlot }) {
  useWarnDuplicateGptDivId(adUnit, slot.gptDivId)

  const adWidth = slot.cssWidth ? `${slot.cssWidth}px` : getAdWidth(slot.adSize)

  return (
    <div
      className={`${styles.reserver} ${DEVICE_CLASS[slot.device]}${
        className ? ` ${className}` : ''
      }`}
      style={
        slot.minHeight ? { minHeight: `${slot.minHeight}px` } : undefined
      }
    >
      <div
        className={`${styles.wrapper} gpt-ad`}
        style={
          slot.minHeight ? { minHeight: `${slot.minHeight}px` } : undefined
        }
      >
        <div
          className={styles.ad}
          style={{
            maxWidth: '100%',
            textAlign: 'center',
            width: adWidth || 'unset',
          }}
          id={slot.gptDivId}
        />
      </div>
      <GPTAdClient
        adUnit={adUnit}
        onSlotRequested={onSlotRequested}
        onSlotRenderEnded={onSlotRenderEnded}
      />
    </div>
  )
}
