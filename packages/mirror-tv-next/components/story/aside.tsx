'use client'

import styles from './_styles/aside.module.scss'
import { GLOBAL_CACHE_SETTING } from '~/constants/environment-variables'

import UiListPostsAside from '../shared/ui-list-posts-aside'
import { useData } from '~/context/data-context'
import MicroAd from '../ads/micro-ad'
import dynamic from 'next/dynamic'
import UiHeadingBordered from '../shared/ui-heading-bordered'
import useWindowDimensions from '~/hooks/use-window-dimensions'

const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))

// NOTE: for revalidate the data in <Aside>
export const revalidate = GLOBAL_CACHE_SETTING

const Aside: React.FC = () => {
  const asideCategory = 'story'
  const { popularPosts, latestPosts } = useData()
  const { width } = useWindowDimensions()

  const isTablet = width && width < 1200 && width >= 768

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
        {!isTablet && (
          <div className={styles.microId}>
            <div style={{ paddingLeft: width && width >= 1200 ? '24px' : '' }}>
              <UiHeadingBordered
                title="網友排行榜"
                className={styles.compassFitHeading}
              />
            </div>
            <MicroAd
              unitIdMobile="4300420"
              unitIdDesktop="4300419"
              className={styles.microAd}
              condition="!isTablet"
            />
          </div>
        )}
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
      {isTablet && (
        <div className={`${styles.microId}`}>
          <UiHeadingBordered
            title="網友排行榜"
            className={styles.compassFitHeading}
          />

          <MicroAd
            unitIdMobile="4300420"
            unitIdDesktop="4300419"
            className={styles.microAd}
            condition="isTablet"
          />
        </div>
      )}
    </aside>
  )
}

export default Aside
