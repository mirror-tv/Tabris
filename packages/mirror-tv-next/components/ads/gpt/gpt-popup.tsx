'use client'
import React, { useEffect, useCallback, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import styles from './_styles/gpt-popup.module.scss'
import GptAd from './gpt-ad'
import type { SlotRenderEndedEvent } from '~/types/event'

const OVERLAY_DELAY_MS = 3_000
const CLOSE_BTN_DELAY_MS = 3_000
const AD_REMOVED_DELAY_MS = 500
const EMPTY_SHELL_DELAY_MS = 500

function isCreativeHidden(el: HTMLElement) {
  const { display, visibility, pointerEvents } = el.style
  return (
    display === 'none' || visibility === 'hidden' || pointerEvents === 'none'
  )
}

function readQueryId(root: HTMLElement) {
  return (
    root
      .querySelector('[data-google-query-id]')
      ?.getAttribute('data-google-query-id') ?? ''
  )
}

function isEmptyShell(root: HTMLElement) {
  if (root.style.display !== 'block') {
    return false
  }

  const iframe = root.querySelector('iframe')
  if (!iframe || iframe.getAttribute('data-load-complete') !== 'true') {
    return false
  }

  if (readQueryId(root) !== '') {
    return false
  }

  const tead = root.querySelector('#teadunit')
  return !!tead && tead.childElementCount === 0
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
    let emptyShellTimer = 0

    const observer = new MutationObserver(() => {
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
        return
      }

      if (!isEmptyShell(root)) {
        window.clearTimeout(emptyShellTimer)
        emptyShellTimer = 0
        return
      }

      if (emptyShellTimer) {
        return
      }

      emptyShellTimer = window.setTimeout(() => {
        emptyShellTimer = 0
        if (!isEmptyShell(root)) {
          return
        }
        console.warn('[GptPopup] 遮罩已開但沒有廣告，自動關閉', { adUnit })
        setIsClosed(true)
      }, EMPTY_SHELL_DELAY_MS)
    })

    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['style', 'data-google-query-id', 'data-load-complete'],
    })

    return () => {
      observer.disconnect()
      window.clearTimeout(removedTimer)
      window.clearTimeout(emptyShellTimer)
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
      const size = event?.size
      console.info('[GptPopup] slotRenderEnded', {
        adUnit,
        isEmpty: event.isEmpty,
        size,
        lineItemId: event.lineItemId,
        creativeId: event.creativeId,
      })

      if (event.isEmpty) {
        console.warn('[GptPopup] 沒有回填，不開啟遮罩', { adUnit })
        setIsClosed(true)
        return
      }

      if (size && size?.[0] !== 1 && size?.[1] !== 1) {
        setIsVisible(true)
      }
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
