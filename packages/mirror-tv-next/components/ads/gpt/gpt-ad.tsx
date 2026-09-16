'use client'

import dynamic from 'next/dynamic'
import { resolveAdSlot } from '~/utils/gpt-ad'
import type { GPTAdProps } from './gpt-ad-client'
import styles from './_styles/gpt-ad.module.scss'

const GPTAdClient = dynamic(() => import('./gpt-ad-client'), { ssr: false })

const DEVICE_CLASS = {
  PC: styles.devicePc,
  MB: styles.deviceMb,
  ALL: styles.deviceAll,
} as const

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
    <div
      className={`${styles.reserver} ${DEVICE_CLASS[slot.device]}${
        className ? ` ${className}` : ''
      }`}
      style={
        slot.minHeight ? { minHeight: `${slot.minHeight}px` } : undefined
      }
    >
      <GPTAdClient
        adUnit={adUnit}
        onSlotRequested={onSlotRequested}
        onSlotRenderEnded={onSlotRenderEnded}
      />
    </div>
  )
}
