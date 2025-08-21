'use client'
import Aside from '~/components/story/aside'
import styles from './_styles/story.module.scss'
import Script from 'next/script'
import dynamic from 'next/dynamic'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))
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
              console.log('PopIn 腳本開始載入...')
              
              var pa = document.createElement('script')
              pa.type = 'text/javascript'
              pa.charset = 'utf-8'
              pa.async = true
              pa.src = window.location.protocol + '//api.popin.cc/searchbox/mnews.js'
              pa.onload = function() {
                console.log('PopIn 主要腳本載入完成')
                console.log('window.popin:', window.popin)
                
                // 等待一下再檢查，因為腳本可能需要時間初始化
                setTimeout(function() {
                  console.log('延遲檢查 window.popin:', window.popin)
                  if (window.popin && window.popin.init) {
                    console.log('執行 window.popin.init()')
                    window.popin.init()
                  }
                }, 1000)
              }
              pa.onerror = function() {
                console.error('PopIn 主要腳本載入失敗')
              }
              var s = document.getElementsByTagName('script')[0]
              s.parentNode.insertBefore(pa, s)
              
              // 嘗試載入 PopIn 推薦廣告腳本
              var paRecommend = document.createElement('script')
              paRecommend.type = 'text/javascript'
              paRecommend.charset = 'utf-8'
              paRecommend.async = true
              paRecommend.src = window.location.protocol + '//api.popin.cc/recommend/mnews.js'
              paRecommend.onload = function() {
                console.log('PopIn 推薦腳本載入完成')
                console.log('window.popinRecommend:', window.popinRecommend)
                // 初始化推薦廣告
                if (window.popinRecommend && window.popinRecommend.init) {
                  console.log('執行 window.popinRecommend.init()')
                  window.popinRecommend.init()
                }
              }
              paRecommend.onerror = function() {
                console.error('PopIn 推薦腳本載入失敗')
              }
              s.parentNode.insertBefore(paRecommend, s)
              
              // 嘗試載入 PopIn 通用腳本
              var paGeneral = document.createElement('script')
              paGeneral.type = 'text/javascript'
              paGeneral.charset = 'utf-8'
              paGeneral.async = true
              paGeneral.src = window.location.protocol + '//api.popin.cc/mnews.js'
              paGeneral.onload = function() {
                console.log('PopIn 通用腳本載入完成')
                console.log('window.popin:', window.popin)
                // 嘗試初始化
                if (window.popin && typeof window.popin === 'function') {
                  console.log('window.popin 是函數，直接調用')
                  window.popin()
                }
              }
              paGeneral.onerror = function() {
                console.error('PopIn 通用腳本載入失敗')
              }
              s.parentNode.insertBefore(paGeneral, s)
              
              // 嘗試載入 PopIn 官方推薦腳本
              var paOfficial = document.createElement('script')
              paOfficial.type = 'text/javascript'
              paOfficial.charset = 'utf-8'
              paOfficial.async = true
              paOfficial.src = window.location.protocol + '//api.popin.cc/widget.js'
              paOfficial.onload = function() {
                console.log('PopIn 官方腳本載入完成')
                console.log('window.Popin:', window.Popin)
                console.log('window.PopinWidget:', window.PopinWidget)
                // 嘗試初始化
                if (window.Popin && window.Popin.init) {
                  console.log('執行 window.Popin.init()')
                  window.Popin.init()
                }
                if (window.PopinWidget && window.PopinWidget.init) {
                  console.log('執行 window.PopinWidget.init()')
                  window.PopinWidget.init()
                }
              }
              paOfficial.onerror = function() {
                console.error('PopIn 官方腳本載入失敗')
              }
              s.parentNode.insertBefore(paOfficial, s)
              
              console.log('PopIn 腳本載入完成')
            })()
          `,
        }}
      />
      <GPTAd pageKey="story" adKey="MB_M1" />
      <GPTAd pageKey="fs" adKey="MB_NEWS" />
      <GPTAd pageKey="all" adKey="PC_HD" />
      <section className={styles.story}>
        <main className={styles.article}>{children}</main>
        <Aside />
      </section>
    </div>
  )
}
