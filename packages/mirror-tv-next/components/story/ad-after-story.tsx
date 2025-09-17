'use client'
import useWindowDimensions from '~/hooks/use-window-dimensions'
import { useEffect, useRef } from 'react'

import dynamic from 'next/dynamic'
const LazyRenderWrapper = dynamic(
  () => import('~/components/shared/lazy-render-wrapper'),
  {
    ssr: false,
  }
)

const AdAfterStory = () => {
  const { width } = useWindowDimensions()

  return (
    <>
      <LazyRenderWrapper
        callbackFn={() => {
          const initDable = () => {
            const dableFunction = (window as any).dable
            const isDableReady =
              typeof dableFunction === 'function' ||
              (typeof dableFunction === 'object' &&
                dableFunction &&
                dableFunction.q)

            if (isDableReady) {
              try {
                if (typeof dableFunction === 'function') {
                  dableFunction('setService', 'mnews.tw')
                  dableFunction(
                    'renderWidgetByWidth',
                    'dablewidget_2Xnxwk7d_xXAWmB7G'
                  )
                } else {
                  dableFunction.q.push(['setService', 'mnews.tw'])
                  dableFunction.q.push([
                    'renderWidgetByWidth',
                    'dablewidget_2Xnxwk7d_xXAWmB7G',
                  ])
                }
              } catch (error) {
                console.error('dable initialization failed:', error)
              }
            } else {
              setTimeout(initDable, 1000)
            }
          }

          setTimeout(initDable, 2000)
        }}
      >
        <div
          id="dablewidget_2Xnxwk7d_xXAWmB7G"
          data-widget_id-pc="2Xnxwk7d"
          data-widget_id-mo="xXAWmB7G"
          className="dable-widget-last"
        />
        {width && width >= 768 && (
          <div id="_popIn_recommend" className="popin_recommend" />
        )}
      </LazyRenderWrapper>
    </>
  )
}

export default AdAfterStory
