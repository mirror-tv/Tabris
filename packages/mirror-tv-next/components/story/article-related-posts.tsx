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
          <a
            key={item.slug + idx}
            className={`ga-article-related ${styles.item}`}
            href={`/story/${item.slug}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            {item.name}
          </a>
        ))}
      </ul>
      {shouldShowAds && (
        <>
          <div className={styles.popinAd}>
            <LazyRenderWrapper>
              <div id="_popIn_recommend_word" />
            </LazyRenderWrapper>
          </div>
          {page === 'story' && (
            <LazyRenderWrapper>
              <div
                className="avivid_textad avivid_ad_one"
                data-web_id="mnewstext"
              />
              {width && width >= 768 ? (
                <div id="compass-fit-4333664" className="compass-fit" />
              ) : (
                <div id="compass-fit-4333665" className="compass-fit" />
              )}
            </LazyRenderWrapper>
          )}
        </>
      )}
    </div>
  )
}

export default ArticleRelatedPosts
