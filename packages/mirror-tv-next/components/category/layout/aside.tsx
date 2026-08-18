'use client'
import styles from './_styles/aside.module.scss'
import UiListPostsAside from '~/components/shared/ui-list-posts-aside'

import { useData } from '~/context/data-context'
import GPTAd from '~/components/ads/gpt/gpt-ad'

export default function CategoryPageLayoutAside() {
  const { popularPosts, latestPosts } = useData()

  return (
    <aside className={styles.aside}>
      <GPTAd pageKey="category" adKey="PC_R1" />
      {!!popularPosts.length && (
        <UiListPostsAside
          listTitle="熱門新聞"
          page="category"
          listData={popularPosts.slice(0, 5)}
          className={`aside__list-popular ${styles.asideItem}`}
        />
      )}
      <GPTAd pageKey="category" adKey="PC_R2" />
      <UiListPostsAside
        listTitle="即時新聞"
        page="category"
        listData={latestPosts.slice(0, 5)}
        className={`aside__list-latest ${styles.asideItem} list-wrapper`}
      />
    </aside>
  )
}
