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
        <GPTAd pageKey="all" adKey="PC_HD" />
      </GPTPlaceholderDesktop>
      <GPTPlaceholderMobile>
        <p>廣告</p>
        <GPTAd pageKey="category" adKey="MB_M1" />
      </GPTPlaceholderMobile>
      <section className={styles.category}>
        {children}
        <GPTAd pageKey="category" adKey="MB_M2" />
        <CategoryPageLayoutAside />
        <GPTAd pageKey="category" adKey="MB_M3" />
      </section>
    </main>
  )
}
