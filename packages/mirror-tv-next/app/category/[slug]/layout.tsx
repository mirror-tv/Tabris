import styles from '~/styles/pages/category-layout.module.scss'
import CategoryPageLayoutAside from '~/components/category/layout/aside'
import {
  GPTPlaceholderMobile,
  GPTPlaceholderDesktop,
} from '~/components/ads/gpt/gpt-placeholder'
import dynamic from 'next/dynamic'

const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))
const MicroAd = dynamic(() => import('~/components/ads/micro-ad'))

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
        <MicroAd
          unitIdMobile="4300420"
          unitIdDesktop="4300419"
          className={styles.microAd}
          condition="isTablet"
        />
        <GPTAd pageKey="category" adKey="MB_M3" />
      </section>
    </main>
  )
}
