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
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(d,a,b,l,e,_) {
              d[b] = d[b] || function () {
                (d[b].q = d[b].q || []).push(arguments)
              }
              e = a.createElement(l)
              e.async = 1
              e.charset = 'utf-8'
              e.src = '//static.dable.io/dist/plugin.min.js'
              _ = a.getElementsByTagName(l)[0]
              _.parentNode.insertBefore(e, _)
            })(window, document, 'dable', 'script')
          `,
        }}
      />

      <Script
        id="popinAd"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // 簡化的設備欺騙：讓 PopIn 認為這是移動設備
              var originalWidth = window.innerWidth
              Object.defineProperty(window, 'innerWidth', {
                get: () => 375,
                configurable: true
              })
              
              var script = document.createElement('script')
              script.src = window.location.protocol + '//api.popin.cc/searchbox/mnews.js'
              script.async = true
              
              script.onload = () => {
                // 恢復原始寬度
                Object.defineProperty(window, 'innerWidth', {
                  get: () => originalWidth,
                  configurable: true
                })
                console.log('PopIn loaded with mobile spoofing')
              }
              
              document.body.appendChild(script)
            })()
          `,
        }}
      />

      <section className={styles.ads}>
        <GPTAd pageKey="story" adKey="MB_M1" />
        <GPTAd pageKey="fs" adKey="MB_NEWS" />
        <GPTAd pageKey="all" adKey="PC_HD" />
      </section>
      <section className={styles.story}>
        <main className={styles.article}>{children}</main>
        <Aside />
      </section>
    </div>
  )
}
