'use client'
import Aside from '~/components/story/aside'
import styles from './_styles/external.module.scss'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import AdH1Remover from '~/components/shared/ad-h1-remover'
import TagManagerWrapper from '~/app/tag-manager'
import {
  GPTPlaceholderDesktop,
  GPTPlaceholderMobile,
} from '~/components/ads/gpt/gpt-placeholder'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))
export default function StoryPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.LayoutWrapper}>
      <TagManagerWrapper />
      <AdH1Remover />

      <Script
        id="popinAd"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var script = document.createElement('script')
              script.src = window.location.protocol + '//api.popin.cc/searchbox/mnews.js'
              script.async = true
              document.body.appendChild(script)
            })()
          `,
        }}
      />

      <section className={styles.ads}>
        <GPTPlaceholderMobile>
          <GPTAd pageKey="story" adKey="MB_M1" />
        </GPTPlaceholderMobile>
        <GPTPlaceholderDesktop>
          <GPTAd pageKey="all" adKey="PC_HD" />
        </GPTPlaceholderDesktop>
      </section>
      <section className={styles.story}>
        <main className={styles.article}>{children}</main>
        <Aside />
      </section>
    </div>
  )
}
