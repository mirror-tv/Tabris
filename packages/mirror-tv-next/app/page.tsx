import dynamic from 'next/dynamic'
import MainFlashNews from '~/components/flash-news/main-flash-news'
import styles from '~/styles/pages/page.module.scss'
import { GPTPlaceholderMobile } from '~/components/ads/gpt/gpt-placeholder'
import { GPTPlaceholderDesktop } from '~/components/ads/gpt/gpt-placeholder'
import GptPopup from '~/components/ads/gpt/gpt-popup'
import { GLOBAL_CACHE_SETTING } from '~/constants/environment-variables'
import PopularPostsList from '~/components/homepage/popular-posts-list'
import TopicList from '~/components/homepage/topic-list'
import LiveCamList from '~/components/homepage/live-cam-list'
import ShowList from '~/components/homepage/show-list-init'
import LatestAndEditorchoicesWithLive from '~/components/homepage/latest-and-editor-choices-with-live'

const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))
const PromotionVideoList = dynamic(
  () => import('~/components/homepage/promotion-video-list')
)

export const revalidate = GLOBAL_CACHE_SETTING

export default function Home() {
  return (
    <main className={styles.main}>
      <GptPopup adKey="MB_HOME" />
      {/* GPT ADs */}
      <GPTPlaceholderDesktop>
        <p>廣告</p>
        <GPTAd pageKey="all" adKey="PC_HD" />
      </GPTPlaceholderDesktop>
      <GPTPlaceholderMobile>
        <p>廣告</p>
        <GPTAd pageKey="home" adKey="MB_M1" />
      </GPTPlaceholderMobile>
      <div className={styles.mobFlashNewsWrapper}>
        <MainFlashNews />
      </div>
      <LatestAndEditorchoicesWithLive latestListTitle="即時新聞" />
      <GPTAd pageKey="home" adKey="PC_BT" />
      <GPTAd pageKey="home" adKey="MB_M3" />
      <PopularPostsList title="熱門新聞" />
      <LiveCamList title="直播現場" />
      <PromotionVideoList title="發燒單元" />
      <ShowList title="節目" />
      <GPTAd pageKey="home" adKey="PC_BT2" />
      <GPTAd pageKey="home" adKey="MB_M4" />
      <TopicList title="推薦專題" />
    </main>
  )
}
