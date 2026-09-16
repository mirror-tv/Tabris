'use client'

import styles from './_styles/aside.module.scss'

import UiListPostsAside from '../shared/ui-list-posts-aside'
import { useData } from '~/context/data-context'
import GPTAd from '~/components/ads/gpt/gpt-ad'

// NOTE: for revalidate the data in <Aside>
export const revalidate = 0

const Aside: React.FC = () => {
  const asideCategory = 'story'
  const { popularPosts, latestPosts } = useData()

  return (
    <aside className={styles.aside}>
      <div className={styles.asideWrapper}>
        <div className={styles.gptAdContainer}>
          <GPTAd adUnit="mnews_article_sidebar_300x250_01" />
        </div>
        <UiListPostsAside
          listTitle="即時新聞"
          page={asideCategory}
          listData={latestPosts.slice(0, 5)}
          className={`aside__list-latest ${styles.asideItem} list-wrapper`}
        />
        <GPTAd adUnit="mnews_article_sidebar_300x250_02" />
        {!!popularPosts.length && (
          <UiListPostsAside
            listTitle="熱門新聞"
            page={asideCategory}
            listData={popularPosts}
            className={`aside__list-popular ${styles.asideItem}`}
          />
        )}
        <GPTAd adUnit="mnews_article_sidebar_300x250_03" />
      </div>
    </aside>
  )
}

export default Aside
