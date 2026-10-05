'use client'
import Aside from '~/components/story/aside'
import styles from './_styles/story.module.scss'
import AdH1Remover from '~/components/shared/ad-h1-remover'
import {
  GPTPlaceholderDesktop,
  GPTPlaceholderMobile,
} from '~/components/ads/gpt/gpt-placeholder'
import GPTAd from '~/components/ads/gpt/gpt-ad'
import GptHiddenSlot from '~/components/ads/gpt/gpt-hidden-slot'

export default function StoryPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.LayoutWrapper}>
      <AdH1Remover />
      <section>
        <GPTPlaceholderMobile>
          <GPTAd adUnit="mnews_m_article_top_300x250" />
        </GPTPlaceholderMobile>
        <GPTPlaceholderDesktop>
          <GPTAd adUnit="mnews_masthead_top_970x400" />
        </GPTPlaceholderDesktop>
      </section>
      <section className={styles.story}>
        <main className={styles.article}>{children}</main>
        <Aside />
      </section>
      <GptHiddenSlot adUnit="mnews_article_footer" />
      {/* PC 文章錨底 1x1 */}
    </div>
  )
}
