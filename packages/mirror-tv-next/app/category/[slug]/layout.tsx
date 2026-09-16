import styles from '~/styles/pages/category-layout.module.scss'
import CategoryPageLayoutAside from '~/components/category/layout/aside'
import {
  GPTPlaceholderMobile,
  GPTPlaceholderDesktop,
} from '~/components/ads/gpt/gpt-placeholder'
import GPTAd from '~/components/ads/gpt/gpt-ad'

export default async function CategoryPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <GPTPlaceholderDesktop>
        <p>廣告</p>
        <GPTAd adUnit="mnews_masthead_top_970x400" />
      </GPTPlaceholderDesktop>
      <GPTPlaceholderMobile>
        <p>廣告</p>
        <GPTAd adUnit="mnews_m_category_top_300x250" />
      </GPTPlaceholderMobile>
      <section className={styles.category}>
        {children}
        <GPTAd adUnit="mnews_m_category_middle_300x250" />
        <CategoryPageLayoutAside />
        <GPTAd adUnit="mnews_m_category_end_300x250_04" />
      </section>
    </main>
  )
}
