'use client'
import styles from './_styles/aside.module.scss'
import { formatArticleCard, type FormattedPostCard } from '~/utils'
import UiListPostsAside from '~/components/shared/ui-list-posts-aside'

import dynamic from 'next/dynamic'
import { useData } from '~/context/data-context'
import { type PostCardItem } from '~/graphql/query/posts'
import { pipe } from '~/utils/fp'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))
const MicroAd = dynamic(() => import('~/components/ads/micro-ad'))

export default function CategoryPageLayoutAside() {
  const { popularPosts, latestPosts } = useData()

  const ensureArray = (data: unknown) => (Array.isArray(data) ? data : [])
  const addStyle = (data: PostCardItem[]): FormattedPostCard[] =>
    [...data].map((post) => formatArticleCard({ ...post, style: 'article' }))
  const getLatest5Items = (data: FormattedPostCard[]) => data.slice(0, 5)

  const formatForPostCard = pipe(ensureArray, addStyle, getLatest5Items)

  const formattedPopularPosts = formatForPostCard(popularPosts)
  const formattedLatestPosts = formatForPostCard(latestPosts)

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
        listData={formattedLatestPosts}
        className={`aside__list-latest ${styles.asideItem}`}
      />
    </aside>
  )
}
