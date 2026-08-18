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
          <GPTAd pageKey={asideCategory} adKey="PC_R1" />
        </div>
        <UiListPostsAside
          listTitle="即時新聞"
          page={asideCategory}
          listData={latestPosts.slice(0, 5)}
          className={`aside__list-latest ${styles.asideItem} list-wrapper`}
        />
        <GPTAd pageKey={asideCategory} adKey="PC_R2" />
        {!!popularPosts.length && (
          <UiListPostsAside
            listTitle="熱門新聞"
            page={asideCategory}
            listData={popularPosts}
            className={`aside__list-popular ${styles.asideItem}`}
          />
        )}
        <GPTAd pageKey={asideCategory} adKey="PC_R3" />
      </div>
    </aside>
  )
}

export default Aside
