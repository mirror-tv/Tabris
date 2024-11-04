import dynamic from 'next/dynamic'
import MainFlashNews from '~/components/flash-news/main-flash-news'
import styles from '~/styles/pages/page.module.scss'
import { GPTPlaceholderMobile } from '~/components/ads/gpt/gpt-placeholder'
import { GPTPlaceholderDesktop } from '~/components/ads/gpt/gpt-placeholder'
import GptPopup from '~/components/ads/gpt/gpt-popup'
import TopicList from '~/components/homepage/topic-list'
import { getClient } from '~/apollo-client'
import { fetchFeatureTopics, type FeatureTopic } from '~/graphql/query/topic'
import errors from '@twreporter/errors'
import { handleResponse } from '~/utils'

const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))

export default async function Home() {
  const client = getClient()
  const getFeatureTopics = () =>
    client.query<{ allTopics: FeatureTopic[] }>({
      query: fetchFeatureTopics,
      variables: {
        topicFirst: 4,
        postFirst: 3,
      },
    })

  let allTopics: FeatureTopic[] = []

  try {
    const responses = await Promise.allSettled([getFeatureTopics()])
    allTopics = handleResponse(
      responses[0],
      (
        latestPostsData:
          | Awaited<ReturnType<typeof getFeatureTopics>>
          | undefined
      ) => {
        return latestPostsData?.data?.allTopics ?? []
      },
      'Error occurs while fetching category data in video category page'
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
      <TopicList title="推薦專題" topics={allTopics} />
    </main>
  )
}
