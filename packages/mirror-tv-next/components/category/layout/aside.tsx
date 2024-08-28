import { getClient } from '~/apollo-client'
import styles from './_styles/aside.module.scss'
import { getLatestPosts, PostCardItem } from '~/graphql/query/posts'
import { formatArticleCard, FormattedPostCard, handleResponse } from '~/utils'
import UiListPostsAside from '~/components/shared/ui-list-posts-aside'
import {
  POPULAR_POSTS_URL,
  GLOBAL_CACHE_SETTING,
} from '~/constants/environment-variables'
import dynamic from 'next/dynamic'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))
const MicroAd = dynamic(() => import('~/components/ads/micro-ad'))

type RawPopularPost = {
  id: string
  name: string
  slug: string
  source: string
  heroImage: {
    urlMobileSized: string
    urlOriginal: string
    urlDesktopSized: string
    urlTabletSized: string
    urlTinySized: string
  }
  publishTime: string
}

type RawPopularPostData = {
  report: RawPopularPost[]
}

export default async function CategoryPageLayoutAside() {
  let latestPosts: FormattedPostCard[] = []
  let popularPosts: FormattedPostCard[] = []

  const client = getClient()

  const fetchLatestPosts = () =>
    client.query<{
      allPosts: PostCardItem[]
    }>({
      query: getLatestPosts,
      variables: {
        first: 5,
      },
    })

  const fetchPopularPosts = () =>
    fetch(POPULAR_POSTS_URL, {
      next: { revalidate: GLOBAL_CACHE_SETTING },
    }).then((res) => {
      // use type assertion to eliminate any
      return res.json() as unknown as RawPopularPostData
    })

  const responses = await Promise.allSettled([
    fetchLatestPosts(),
    fetchPopularPosts(),
  ])

  latestPosts = handleResponse(
    responses[0],
    (
      latestPostsData: Awaited<ReturnType<typeof fetchLatestPosts>> | undefined
    ) => {
      return (
        latestPostsData?.data.allPosts.map((post) => formatArticleCard(post)) ??
        []
      )
    },
    'Error occurs while fetching latest posts in category page'
  )

  popularPosts = handleResponse(
    responses[1],
    (
      popularPostsData:
        | Awaited<ReturnType<typeof fetchPopularPosts>>
        | undefined
    ) => {
      // post in json doesn't have 'style' attribute
      return (
        popularPostsData?.report
          ?.map((post) => formatArticleCard({ ...post, style: 'article' }))
          ?.slice(5) ?? []
      )
    },
    'Error occurs while fetching popular posts in category page'
  )

  return (
    <aside className={styles.aside}>
      <GPTAd pageKey="category" adKey="PC_R1" />
      {!!popularPosts.length && (
        <UiListPostsAside
          listTitle="熱門新聞"
          page="category"
          listData={popularPosts}
          className={`aside__list-popular ${styles.asideItem}`}
        />
      )}
      <div className={styles.microId}>
        <MicroAd
          unitIdMobile="4300420"
          unitIdDesktop="4300419"
          className={styles.microAd}
          condition="!isTablet"
        />
      </div>
      <GPTAd pageKey="category" adKey="PC_R2" />
      <UiListPostsAside
        listTitle="即時新聞"
        page="category"
        listData={latestPosts}
        className={`aside__list-latest ${styles.asideItem}`}
      />
    </aside>
  )
}
