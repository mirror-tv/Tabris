'use client'

import styles from './_styles/aside.module.scss'
import { GLOBAL_CACHE_SETTING } from '~/constants/environment-variables'
import { pipe } from '~/utils/fp'
import UiListPostsAside from '../shared/ui-list-posts-aside'
import { useData } from '~/context/data-context'
import { formatArticleCard, type FormattedPostCard } from '~/utils'
import { type PostCardItem } from '~/graphql/query/posts'
import MicroAd from '../ads/micro-ad'
import dynamic from 'next/dynamic'

const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))

// NOTE: for revalidate the data in <Aside>
export const revalidate = GLOBAL_CACHE_SETTING

const Aside: React.FC = () => {
  const asideCategory = 'story'
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
      <GPTAd pageKey={asideCategory} adKey="PC_R2" />
      <UiListPostsAside
        listTitle="即時新聞"
        page={asideCategory}
        listData={formattedLatestPosts}
        className={`aside__list-latest ${styles.asideItem}`}
      />
      <div className={styles.microId}>
        <MicroAd
          unitIdMobile="4300420"
          unitIdDesktop="4300419"
          className={styles.microAd}
          condition="!isTablet"
        />
      </div>
      <GPTAd pageKey={asideCategory} adKey="PC_R1" />
      {!!formattedPopularPosts.length && (
        <UiListPostsAside
          listTitle="熱門新聞"
          page={asideCategory}
          listData={formattedPopularPosts}
          className={`aside__list-popular ${styles.asideItem}`}
        />
      )}
    </aside>
  )
}

export default Aside
