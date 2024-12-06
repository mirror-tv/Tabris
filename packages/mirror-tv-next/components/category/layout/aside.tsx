'use client'
import { getClient } from '~/apollo-client'
import styles from './_styles/aside.module.scss'
import { getLatestPosts, PostCardItem } from '~/graphql/query/posts'
import { formatArticleCard, FormattedPostCard, handleResponse } from '~/utils'
import UiListPostsAside from '~/components/shared/ui-list-posts-aside'

import dynamic from 'next/dynamic'
import { useData } from '~/context/data-context'
import { useEffect, useState } from 'react'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))
const MicroAd = dynamic(() => import('~/components/ads/micro-ad'))

export default function CategoryPageLayoutAside() {
  const { popularPosts } = useData()
  const [latestPosts, setLatestPosts] = useState<FormattedPostCard[]>([])

  const formattedPopularPosts =
    popularPosts
      ?.map((post) => formatArticleCard({ ...post, style: 'article' }))
      ?.slice(0, 5) ?? []

  useEffect(() => {
    const fetchData = async () => {
      const client = getClient()
      const fetchLatestPosts = () =>
        client.query<{
          allPosts: PostCardItem[]
        }>({
          query: getLatestPosts,
          variables: {
            first: 5,
            filteredSlug: [],
          },
        })
      const responses = await Promise.allSettled([fetchLatestPosts()])
      const latestPostsData = handleResponse(
        responses[0],
        (
          latestPostsData:
            | Awaited<ReturnType<typeof fetchLatestPosts>>
            | undefined
        ) => {
          return (
            latestPostsData?.data?.allPosts.map((post) =>
              formatArticleCard(post)
            ) ?? []
          )
        },
        'Error occurs while fetching latest posts in category page'
      )
      setLatestPosts(latestPostsData ?? [])
    }
    fetchData()
  }, [])

  return (
    <aside className={styles.aside}>
      <GPTAd pageKey="category" adKey="PC_R1" />
      {!!formattedPopularPosts.length && (
        <UiListPostsAside
          listTitle="熱門新聞"
          page="category"
          listData={formattedPopularPosts}
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
