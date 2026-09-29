'use client'
import React, { useEffect, useCallback, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import styles from './_styles/gpt-popup.module.scss'
import GptAd from './gpt-ad'
import type { SlotRenderEndedEvent } from '~/types/event'

const OVERLAY_DELAY_MS = 3_000
const CLOSE_BTN_DELAY_MS = 3_000
const AD_REMOVED_DELAY_MS = 500

function GptPopup({ adUnit }: { adUnit: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const sawAdRef = useRef(false)
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
    setIsClosed(true)
  }, [])

  useEffect(() => {
    if (!shouldRequest || isClosed) {
      return
    }

    const ad = rootRef.current?.querySelector('.gpt-ad')
    if (!ad) {
      return
    }

    let removedTimer = 0

    const observer = new MutationObserver(() => {
      const hasIframe = !!ad.querySelector('iframe')
      if (hasIframe) {
        sawAdRef.current = true
        window.clearTimeout(removedTimer)
        return
      }

      if (!sawAdRef.current) {
        return
      }

      window.clearTimeout(removedTimer)
      removedTimer = window.setTimeout(() => {
        if (!ad.querySelector('iframe')) {
          setIsClosed(true)
        }
      }, AD_REMOVED_DELAY_MS)
    })

    observer.observe(ad, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      window.clearTimeout(removedTimer)
    }
  }, [shouldRequest, isClosed])

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

  const handleSlotRenderEnded = useCallback((event: SlotRenderEndedEvent) => {
    const size = event?.size
    if (size && size?.[0] !== 1 && size?.[1] !== 1) {
      setIsVisible(true)
    }
  }, [])

  if (!shouldRequest || isClosed) {
    return null
  }

  return (
    <div
      ref={rootRef}
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
