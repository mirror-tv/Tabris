import errors from '@twreporter/errors'
import type { Metadata } from 'next'
import { fetchTopics } from '~/app/_actions/topic'
import TopicsListManager from '~/components/topic/topics-list-manager'
import { SITE_URL } from '~/constants/environment-variables'
import { Topic } from '~/graphql/query/topic'
import styles from '~/styles/pages/topic-page.module.scss'
import GPTAd from '~/components/ads/gpt/gpt-ad'
import { GPTPlaceholderDesktop } from '~/components/ads/gpt/gpt-placeholder'
import PageLogger from '~/components/tracking/page-logger'

export const revalidate = 0

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '專題 - 鏡新聞',
  alternates: {
    canonical: `${SITE_URL}/topic`,
  },
  openGraph: {
    title: '專題 - 鏡新聞',
    images: {
      url: '/images/default-og-img.jpg',
    },
  },
}

export default async function TagPage() {
  const PAGE_SIZE = 12
  let topicsList: Topic[] = []
  let topicsCount: number = 0

  try {
    const topicsResponse = await fetchTopics({
      page: 1,
      pageSize: PAGE_SIZE,
      isWithCount: true,
    })
    if (!topicsResponse.allTopics) return
    topicsList = topicsResponse?.allTopics ?? []
    topicsCount = topicsResponse?._allTopicsMeta?.count ?? 0
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data for header'
    )

    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(annotatingError, {
          withStack: false,
          withPayload: true,
        }),
      })
    )

    throw annotatingError
  }

  return (
    <section className={styles.topic}>
      <PageLogger />
      <GPTPlaceholderDesktop>
        <p>廣告</p>
        <GPTAd pageKey="all" adKey="PC_HD" />
      </GPTPlaceholderDesktop>
      <div
        className={[styles.topicWrapper, 'topic-listing__content'].join(' ')}
      >
        <h1 className={styles.topicName}>推薦專題</h1>
        <TopicsListManager
          pageSize={PAGE_SIZE}
          topicsCount={topicsCount}
          initTopicsList={topicsList}
        />
      </div>
    </section>
  )
}
