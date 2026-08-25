import HeroImg from '~/components/ombuds/hero-img'
import OmbudsIntro from '~/components/ombuds/ombuds-intro'
import OmbudsArticleContainerMb from '~/components/ombuds/ombuds-article-container-mb'
import FetchArticleDataPc from '~/components/ombuds/fetchArticleData-pc'
import IconLinkList from '~/components/ombuds/iconLinkList'
import styles from '~/styles/pages/ombuds-page.module.scss'
import type { Metadata } from 'next'
import { SITE_URL } from '~/constants/environment-variables'
import GPTAd from '~/components/ads/gpt/gpt-ad'
import { GPTPlaceholderDesktop } from '~/components/ads/gpt/gpt-placeholder'
import { SITE_TITLE } from '~/constants/constant'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '公評人專區 - 鏡新聞',
  alternates: {
    canonical: `${SITE_URL}/ombuds`,
  },
  openGraph: {
    title: '公評人專區 - 鏡新聞',
    url: '/ombuds',
    images: {
      url: '/images/default-og-img.jpg',
    },
    siteName: SITE_TITLE,
  },
}

export default function Ombuds() {
  return (
    <main>
      <GPTPlaceholderDesktop>
        <p>廣告</p>
        <GPTAd pageKey="all" adKey="PC_HD" />
      </GPTPlaceholderDesktop>
      <div className={styles.main}>
        <HeroImg />
        <OmbudsIntro />
        <OmbudsArticleContainerMb />
        <FetchArticleDataPc />
        <IconLinkList />
      </div>
    </main>
  )
}
