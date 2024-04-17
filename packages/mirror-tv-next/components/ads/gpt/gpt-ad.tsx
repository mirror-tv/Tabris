'use client'
import styles from '~/styles/components/ads/gpt-ad/gpt-ad.module.scss'

import { useEffect, useState } from 'react'

import {
  getAdSlotParam,
  getAdSlotParamByAdUnit,
  getAdWidth,
} from '~/utils/gpt-ad'

type GPTAdProps = {
  pageKey?: string
  adKey?: string
  adUnit?: string
  onSlotRequested?: (event: unknown) => void
  onSlotRenderEnded?: (event: unknown) => void
  className?: string
}

type SingleSizeArray = [number, number]

const GPTAdRoot = ({
  pageKey,
  adKey,
  adUnit,
  onSlotRequested,
  onSlotRenderEnded,
}: GPTAdProps) => {
  const [adSize, setAdSize] = useState<SingleSizeArray[]>([])
  const [adUnitPath, setAdUnitPath] = useState('')
  const [adWidth, setAdWidth] = useState('')

  const adDivId = adUnitPath // Set the id of the ad `<div>` to be the same as the `adUnitPath`.

  useEffect(() => {
    let newAdSize, newAdUnitPath, newAdWidth
    if (pageKey && adKey) {
      // built-in ad unit
      const width = window.innerWidth
      const adSlotParam = getAdSlotParam(pageKey, adKey, width)
      if (!adSlotParam) {
        return
      }
      const { adUnitPath, adSize } = adSlotParam
      newAdSize = adSize
      newAdUnitPath = adUnitPath
      newAdWidth = getAdWidth(adSize)
    } else if (adUnit) {
      // custom ad unit string
      const adSlotParam = getAdSlotParamByAdUnit(adUnit)
      const { adUnitPath, adSize } = adSlotParam

      newAdSize = adSize
      newAdUnitPath = adUnitPath
      newAdWidth = getAdWidth(adSize)
    } else {
      console.error(
        `GPTAd not receive necessary pageKey '${pageKey}' and adKey '${adKey}' or adUnit '${adUnit}'`
      )
      return
    }

    setAdSize(newAdSize)
    setAdWidth(newAdWidth)
    setAdUnitPath(newAdUnitPath)
  }, [adKey, pageKey, adUnit])

  useEffect(() => {
    if (adDivId && adWidth && window.googletag) {
      /**
       * Check https://developers.google.com/publisher-tag/guides/get-started?hl=en for the tutorial of the flow.
       */
      let adSlot: string

      const handleOnSlotRequested = (event: { slot: string }) => {
        if (event.slot === adSlot && onSlotRequested) {
          onSlotRequested(event)
        }
      }

      const handleOnSlotRenderEnded = (event: { slot: string }) => {
        if (event.slot === adSlot && onSlotRenderEnded) {
          onSlotRenderEnded(event)
        }
      }

      window.googletag.cmd.push(() => {
        const pubads = window.googletag.pubads()

        adSlot = window.googletag
          .defineSlot(adUnitPath, adSize, adDivId)
          .addService(window.googletag.pubads())
        window.googletag.display(adDivId)

        // all events, check https://developers.google.com/publisher-tag/reference?hl=en#googletag.events.eventtypemap for all events
        if (onSlotRequested) {
          /**
           * add event listener  to respond only to certain adSlot
           * @see https://developers.google.com/publisher-tag/reference?hl=zh-tw#googletag.Service_addEventListener
           */
          pubads.addEventListener('slotRequested', handleOnSlotRequested)
        }
        if (onSlotRenderEnded) {
          pubads.addEventListener('slotRenderEnded', handleOnSlotRenderEnded)
        }
      })

      return () => {
        const pubads = window.googletag.pubads()

        window.googletag.cmd.push(() => {
          window.googletag.destroySlots([adSlot])
          if (onSlotRenderEnded) {
            pubads.removeEventListener('slotRequested', handleOnSlotRequested)
          }
          if (onSlotRenderEnded) {
            pubads.removeEventListener(
              'slotRenderEnded',
              handleOnSlotRenderEnded
            )
          }
        })
      }
    }
  }, [adDivId, adSize, adUnitPath, adWidth, onSlotRenderEnded, onSlotRequested])

  return (
    <div className={`${styles.wrapper} gpt-ad`}>
      <div
        className={styles.ad}
        style={{
          maxWidth: '100%',
          textAlign: 'center',
          width: adWidth || 'unset',
        }}
        id={adDivId}
      />
    </div>
  )
}

export default function GptAd({
  pageKey,
  adKey,
  adUnit,
  onSlotRequested,
  onSlotRenderEnded,
  className,
}: GPTAdProps) {
  const [shouldShowAd, setShouldAd] = useState(false)
  const isBuildInAdUnit = pageKey && adKey
  const isCustomAdUnit = adUnit
  const isValidAd = isBuildInAdUnit || isCustomAdUnit

  /**
   * If adKey contain 'MB', which means this ad should only render at device which viewport is smaller then 1200px.
   * If adKey contain 'PC', which means this ad should only render at device which viewport is smaller larger 1200px.
   *
   * Why we use `window.innerWidth` to decide should show GPT ad, not just using css `@media-query`?
   * Because in GPT ad, ad unit will load even if ad is unseen (`display: none`).
   * The inconsistency between the loading and rendering of ads does not align with our business logic.
   */
  useEffect(() => {
    const width = window.innerWidth

    if (!width || !isValidAd) {
      return
    }
    const isDesktopWidth = width >= 1200
    if (isBuildInAdUnit) {
      switch (true) {
        case adKey?.includes('MB'):
          setShouldAd(!isDesktopWidth)
          return
        case adKey?.includes('PC'):
          setShouldAd(isDesktopWidth)
          return
        default:
          setShouldAd(true)
          return
      }
    } else if (isCustomAdUnit) {
      setShouldAd(true)
      return
    }
  }, [adKey, pageKey, isBuildInAdUnit, isCustomAdUnit, isValidAd])
  return (
    <>
      {shouldShowAd && isValidAd ? (
        <GPTAdRoot
          className={className}
          pageKey={pageKey}
          adKey={adKey}
          adUnit={adUnit}
          onSlotRenderEnded={onSlotRenderEnded}
          onSlotRequested={onSlotRequested}
        ></GPTAdRoot>
      ) : null}
    </>
  )
}
