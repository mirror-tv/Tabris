'use client'
import React, { useEffect, useCallback, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import styles from './_styles/gpt-popup.module.scss'
import GptAd from './gpt-ad'
import type { SlotRenderEndedEvent } from '~/types/event'

const OVERLAY_DELAY_MS = 3_000
const CLOSE_BTN_DELAY_MS = 3_000
const AD_REMOVED_DELAY_MS = 500

function isCreativeHidden(el: HTMLElement) {
  const { display, visibility } = el.style
  return display === 'none' || visibility === 'hidden'
}

type RenderedSize = [number, number]

function readQueryId(root: HTMLElement) {
  return (
    root
      .querySelector('[data-google-query-id]')
      ?.getAttribute('data-google-query-id') ?? ''
  )
}

function readRenderedSize(
  size: SlotRenderEndedEvent['size']
): RenderedSize | null {
  if (!Array.isArray(size) || size.length < 2) {
    return null
  }

  const width = Number(size[0])
  const height = Number(size[1])
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return null
  }

  return [width, height]
}

function isOneByOneSize(size: RenderedSize | null) {
  return !!size && size[0] === 1 && size[1] === 1
}

function GptPopup({ adUnit }: { adUnit: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const sawAdRef = useRef(false)
  const sawShellRef = useRef(false)
  const [shouldRequest, setShouldRequest] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isCloseBtnVisible, setIsCloseBtnVisible] = useState(false)
  const [hasQueryId, setHasQueryId] = useState(false)
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

    const root = rootRef.current
    if (!root) {
      return
    }

    let removedTimer = 0

    const syncPopup = () => {
      const iframe = root.querySelector('iframe')
      if (iframe) {
        sawAdRef.current = true
        window.clearTimeout(removedTimer)
      } else if (sawAdRef.current) {
        window.clearTimeout(removedTimer)
        removedTimer = window.setTimeout(() => {
          if (!root.querySelector('iframe')) {
            console.info('[GptPopup] iframe 已移除，卸載 popup', { adUnit })
            setIsClosed(true)
          }
        }, AD_REMOVED_DELAY_MS)
      }

      if (root.style.display === 'block') {
        sawShellRef.current = true
      }

      if (readQueryId(root)) {
        setHasQueryId(true)
      }

      const iframeEl = iframe instanceof HTMLElement ? iframe : null
      if (
        (sawShellRef.current || sawAdRef.current) &&
        (isCreativeHidden(root) || (!!iframeEl && isCreativeHidden(iframeEl)))
      ) {
        console.info('[GptPopup] 素材關閉，卸載 popup', { adUnit })
        setIsClosed(true)
      }
    }

    const observer = new MutationObserver(syncPopup)
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['style', 'data-google-query-id'],
    })
    syncPopup()

    return () => {
      observer.disconnect()
      window.clearTimeout(removedTimer)
    }
  }, [shouldRequest, isClosed, adUnit])

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
      const size = readRenderedSize(event?.size)
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

      if (event.isEmpty || event.size == null) {
        console.warn('[GptPopup] 沒有回填，關閉容器', { adUnit })
        setIsClosed(true)
        return
      }

      if (isOneByOneSize(size)) {
        console.info('[GptPopup] 1x1 有回填，保留容器', {
          adUnit,
          slotContentChanged: event.slotContentChanged,
        })
        return
      }

      setIsVisible(true)
    },
    [adUnit]
  )

  if (!shouldRequest || isClosed) {
    return null
  }

  const interactive = isVisible || hasQueryId

  return (
    <div
      ref={rootRef}
      className={`${styles.adGeekPopup}${
        isVisible ? ` ${styles.shouldShow}` : ''
      }${interactive ? ` ${styles.canInteract}` : ''}`}
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
