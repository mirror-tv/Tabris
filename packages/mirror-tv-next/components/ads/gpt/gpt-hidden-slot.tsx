'use client'

import GPTAd from '~/components/ads/gpt/gpt-ad'
import styles from './_styles/gpt-hidden-slot.module.scss'

export default function GptHiddenSlot({ adUnit }: { adUnit: string }) {
  return (
    <div className={styles.hidden} aria-hidden>
      <GPTAd adUnit={adUnit} />
    </div>
  )
}
