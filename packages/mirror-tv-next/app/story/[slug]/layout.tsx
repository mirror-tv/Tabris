'use client'
import Aside from '~/components/story/aside'
import styles from './_styles/story.module.scss'
import Script from 'next/script'

export default function StoryPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.LayoutWrapper}>
      <Script
        id="dable"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(d,a,b,l,e,_) {
              d[b] = d[b] || function () {
                (d[b].q = d[b].q || []).push(arguments)
              }
              e = a.createElement(l)
              e.async = 1
              e.charset = 'utf-8'
              e.onload = function() {
                dable('setService', 'mnews.tw')
                dable('renderWidgetByWidth', 'dablewidget_2Xnxwk7d_xXAWmB7G')
              }
              e.src = '//static.dable.io/dist/plugin.min.js'
              _ = a.getElementsByTagName(l)[0]
              _.parentNode.insertBefore(e, _)
            })(window, document, 'dable', 'script')
          `,
        }}
      />

      {/* Popin Script */}
      <Script
        id="popinAd"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var pa = document.createElement('script')
              pa.type = 'text/javascript'
              pa.charset = 'utf-8'
              pa.async = true
              pa.src = window.location.protocol + '//api.popin.cc/searchbox/mnews.js'
              var s = document.getElementsByTagName('script')[0]
              s.parentNode.insertBefore(pa, s)
            })()
          `,
        }}
      />

      <section className={styles.story}>
        <main className={styles.article}>{children}</main>
        <Aside />
      </section>
    </div>
  )
}
