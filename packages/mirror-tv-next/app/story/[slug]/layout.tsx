'use client'
import Aside from '~/components/story/aside'
import styles from './_styles/story.module.scss'
import AdH1Remover from '~/components/shared/ad-h1-remover'
import {
  GPTPlaceholderDesktop,
  GPTPlaceholderMobile,
} from '~/components/ads/gpt/gpt-placeholder'
import GPTAd from '~/components/ads/gpt/gpt-ad'
export default function StoryPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.LayoutWrapper}>
      <AdH1Remover />
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
