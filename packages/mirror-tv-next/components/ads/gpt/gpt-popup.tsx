'use client'
import React, { useEffect, useCallback, useState } from 'react'
import styles from './_styles/gpt-popup.module.scss'
import GptAd from './gpt-ad'
import type { SlotRenderEndedEvent } from '~/types/event'

export default function GptPopup({ adKey = '' }: { adKey: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isCloseBtnVisible, setIsCloseBtnVisible] = useState(false)

  const closeAction = useCallback(() => {
    setIsVisible(false)
    console.log('[adGeek][Popup] close Popup')
  }, [])

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setIsCloseBtnVisible(true), 3000)
    }
  }, [isVisible])

  const handleSlotRenderEnded = useCallback((event: SlotRenderEndedEvent) => {
    const size = event?.size
    if (size && size?.[0] !== 1 && size?.[1] !== 1) {
      setIsVisible(true)
    }
  }, [])

  return (
    <div
      className={`${styles.adGeekPopup} ${isVisible ? styles.shouldShow : ''}`}
    >
      <div
        className={`${styles.adGeekPopupOverlay} ${
          isVisible ? styles.shouldShow : ''
        }`}
        onClick={closeAction}
      ></div>
      <div className={styles.adGeekPopupSlot}>
        <GptAd
          pageKey="fs"
          adKey={adKey}
          onSlotRenderEnded={handleSlotRenderEnded}
        />
        {isCloseBtnVisible && (
          <div className={styles.adGeekPopupClose} onClick={closeAction}>
            <img
              className={styles.adGeekPopupCloseBtn}
              src="https://sslcode.adgeek.com.tw/public/images/popup_close_button_large.png"
              alt="Close"
            />
          </div>
        )}
      </div>
    </div>
  )
}
