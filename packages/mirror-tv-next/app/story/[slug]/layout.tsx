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
              // 載入主要的 PopIn 腳本
              var pa = document.createElement('script')
              pa.type = 'text/javascript'
              pa.charset = 'utf-8'
              pa.async = true
              pa.src = window.location.protocol + '//api.popin.cc/searchbox/mnews.js'
              pa.onload = function() {
                // 初始化 PopIn 推薦廣告
                if (window.popin && window.popin.init) {
                  window.popin.init()
                }
              }
              var s = document.getElementsByTagName('script')[0]
              s.parentNode.insertBefore(pa, s)
              
              // 載入 PopIn 推薦廣告腳本
              var paRecommend = document.createElement('script')
              paRecommend.type = 'text/javascript'
              paRecommend.charset = 'utf-8'
              paRecommend.async = true
              paRecommend.src = window.location.protocol + '//api.popin.cc/recommend/mnews.js'
              paRecommend.onload = function() {
                // 初始化推薦廣告
                if (window.popinRecommend && window.popinRecommend.init) {
                  window.popinRecommend.init()
                }
              }
              s.parentNode.insertBefore(paRecommend, s)
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
