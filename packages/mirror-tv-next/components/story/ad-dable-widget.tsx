'use client'
import dynamic from 'next/dynamic'

import styles from './_styles/ad-dable-widget.module.scss'

const LazyRenderWrapper = dynamic(
  () => import('~/components/shared/lazy-render-wrapper'),
  {
    ssr: false,
  }
)

const AdDableWidget: React.FC = () => {
  return (
    <div className={styles.dableWidgetLast}>
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
            'script[src*="static.dable.io/dist/plugin.min.js"]'
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
          className="dable-widget-last"
        />
      </LazyRenderWrapper>
    </div>
  )
}

export default AdDableWidget
