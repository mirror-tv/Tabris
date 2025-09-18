'use client'
import UiHeadingBordered from '../shared/ui-heading-bordered'
import { SinglePost } from '~/graphql/query/story'
import dynamic from 'next/dynamic'

import styles from './_styles/article-related-posts.module.scss'
import useWindowDimensions from '~/hooks/use-window-dimensions'

const LazyRenderWrapper = dynamic(
  () => import('~/components/shared/lazy-render-wrapper'),
  {
    ssr: false,
  }
)

const ArticleRelatedPosts = ({
  relatedPosts,
  shouldShowAds,
  page,
}: {
  relatedPosts: SinglePost['relatedPosts']
  shouldShowAds: boolean
  page: 'story' | 'external'
}) => {
  const { width } = useWindowDimensions()

  return (
    <div className={`${styles.container} list-wrapper post__related`}>
      <UiHeadingBordered title={'更多新聞'} className={styles.listTitle} />
      <ul className={styles.list}>
        {relatedPosts.map((item, idx) => (
          <li
            key={item.slug + idx}
            className={`ga-article-related ${styles.item}`}
          >
            {item.name}
          </li>
        ))}
      </ul>

      {shouldShowAds && (
        <>
          {width && width >= 768 && (
            <div id="_popIn_recommend_word" className="_popIn_recommend" />
          )}
          {page === 'story' && (
            <LazyRenderWrapper>
              <div
                className="avivid_textad avivid_ad_one"
                data-web_id="mnewstext"
              />
              {width && width >= 768 ? (
                <div id="compass-fit-4333664" />
              ) : (
                <div id="compass-fit-4333665" />
              )}
            </LazyRenderWrapper>
          )}
        </>
      )}
    </div>
  )
}

export default ArticleRelatedPosts
