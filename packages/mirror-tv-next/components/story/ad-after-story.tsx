'use client'
import useWindowDimensions from '~/hooks/use-window-dimensions'
import styles from './_styles/ad-after-story.module.scss'

import dynamic from 'next/dynamic'
import UiHeadingBordered from '../shared/ui-heading-bordered'
const LazyRenderWrapper = dynamic(
  () => import('~/components/shared/lazy-render-wrapper'),
  {
    ssr: false,
  }
)

const AdAfterStory: React.FC = () => {
  const { width } = useWindowDimensions()

  return (
    <>
      <LazyRenderWrapper
        callbackFn={() => {
          type DableFunction = ((...args: unknown[]) => void) & {
            q?: unknown[][]
          }
          const dableWindow = window as Window & {
            dable?: DableFunction
          }

          if (!dableWindow.dable) {
            const queuedDable = ((...args: unknown[]) => {
              ;(queuedDable.q = queuedDable.q || []).push(args)
            }) as DableFunction
            dableWindow.dable = queuedDable
          }

          const dablePluginSrc = '//static.dable.io/dist/plugin.min.js'
          const hasDablePlugin = !!document.querySelector(
            `script[src="${dablePluginSrc}"]`
          )
          if (!hasDablePlugin) {
            const scriptElement = document.createElement('script')
            scriptElement.async = true
            scriptElement.charset = 'utf-8'
            scriptElement.src = dablePluginSrc
            document.head.appendChild(scriptElement)
          }

          dableWindow.dable?.('setService', 'mnews.tw')
          dableWindow.dable?.('sendLogOnce')
          dableWindow.dable?.(
            'renderWidgetByWidth',
            'dablewidget_2Xnxwk7d_xXAWmB7G'
          )
        }}
      >
        <div
          id="dablewidget_2Xnxwk7d_xXAWmB7G"
          data-widget_id-pc="2Xnxwk7d"
          data-widget_id-mo="xXAWmB7G"
          className={`dable-widget-last ${styles.dableWidgetLast}`}
        />

        {width && width >= 1200 && (
          <>
            <UiHeadingBordered
              title="每日精選"
              className={styles.dailySelection}
            />
            <div
              id="_popIn_recommend"
              className={`popin_recommend ${styles.popinRecommend}`}
            />
          </>
        )}
      </LazyRenderWrapper>
    </>
  )
}

export default AdAfterStory
