'use client'
import React, { useEffect, useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import styles from './_styles/gpt-popup.module.scss'
import GptAd from './gpt-ad'
import type { SlotRenderEndedEvent } from '~/types/event'

const OVERLAY_DELAY_MS = 3_000
const CLOSE_BTN_DELAY_MS = 3_000

function GptPopup({ adUnit }: { adUnit: string }) {
  const [shouldRequest, setShouldRequest] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isCloseBtnVisible, setIsCloseBtnVisible] = useState(false)
  const [isClosed, setIsClosed] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShouldRequest(true)
    }, OVERLAY_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  const closeAction = useCallback(() => {
    setIsVisible(false)
  }, [])

  useEffect(() => {
    if (!isVisible) {
      return
    }

    const timer = window.setTimeout(
      () => setIsCloseBtnVisible(true),
      CLOSE_BTN_DELAY_MS
    )

    return () => {
      window.clearTimeout(timer)
    }
  }, [isVisible])

  const handleSlotRenderEnded = useCallback(
    (event: SlotRenderEndedEvent) => {
      console.info('[GptPopup] slotRenderEnded', {
        adUnit,
        isEmpty: event.isEmpty,
        size: event.size,
        isBackfill: event.isBackfill,
        slotContentChanged: event.slotContentChanged,
        creativeId: event.creativeId,
        lineItemId: event.lineItemId,
        sourceAgnosticCreativeId: event.sourceAgnosticCreativeId,
        sourceAgnosticLineItemId: event.sourceAgnosticLineItemId,
        yieldGroupIds: event.yieldGroupIds,
        responseIdentifier: event.responseIdentifier,
      })

      if (event.isEmpty) {
        console.warn('[GptPopup] 沒有回填，關閉容器', { adUnit })
        setIsClosed(true)
        return
      }

      const size = event?.size
      if (size && size?.[0] !== 1 && size?.[1] !== 1) {
        setIsVisible(true)
      }
    },
    [adUnit]
  )

  if (!shouldRequest || isClosed) {
    return null
  }

  return (
    <div
      className={`${styles.adGeekPopup} ${isVisible ? styles.shouldShow : ''}`}
    >
      <div
        className={`${styles.adGeekPopupOverlay} ${
          isVisible ? styles.shouldShow : ''
        }`}
        onClick={closeAction}
      />
      <div className={styles.adGeekPopupSlot}>
        <GptAd adUnit={adUnit} onSlotRenderEnded={handleSlotRenderEnded} />
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

export default dynamic(() => Promise.resolve(GptPopup), { ssr: false })
