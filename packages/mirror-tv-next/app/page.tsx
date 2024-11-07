import dynamic from 'next/dynamic'
import MainFlashNews from '~/components/flash-news/main-flash-news'
import styles from '~/styles/pages/page.module.scss'
import { GPTPlaceholderMobile } from '~/components/ads/gpt/gpt-placeholder'
import { GPTPlaceholderDesktop } from '~/components/ads/gpt/gpt-placeholder'
import GptPopup from '~/components/ads/gpt/gpt-popup'
import { GLOBAL_CACHE_SETTING } from '~/constants/environment-variables'
import PopularPostsList from '~/components/homepage/popular-posts-list'
import TopicList from '~/components/homepage/topic-list'
import { type FeatureTopic } from '~/graphql/query/topic'
import errors from '@twreporter/errors'
import { handleResponse } from '~/utils'
import { getFeatureTopics } from './_actions/homepage/feature-topics'

const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))

export const revalidate = GLOBAL_CACHE_SETTING

export default async function Home() {
  let allTopics: FeatureTopic[] = []

  try {
    const responses = await Promise.allSettled([
      getFeatureTopics({ topicFirst: 4, postFirst: 3 }),
    ])
    allTopics = handleResponse(
      responses[0],
      (
        featureTopicsData:
          | Awaited<ReturnType<typeof getFeatureTopics>>
          | undefined
      ) => {
        return featureTopicsData?.data?.allTopics ?? []
      },
      'Error occurs while fetching feature topics data in homepage'
    )
  } catch (error) {
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(
          error,
          {
            withStack: true,
            withPayload: true,
          },
          0,
          0
        ),
      })
    )
  }

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
      <PopularPostsList title="熱門新聞" />
      <TopicList title="推薦專題" topics={allTopics} />
    </main>
  )
}
