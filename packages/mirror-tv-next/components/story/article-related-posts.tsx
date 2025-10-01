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
          <LazyRenderWrapper
            callbackFn={() => {
              const initPopIn = () => {
                const popinFunction = (window as unknown as { popin?: unknown })
                  .popin
                const isPopinReady =
                  typeof popinFunction === 'function' ||
                  (typeof popinFunction === 'object' &&
                    popinFunction &&
                    'q' in popinFunction)

                if (isPopinReady) {
                  try {
                    if (typeof popinFunction === 'function') {
                      popinFunction('loadRecommend', '_popIn_recommend_word')
                    } else {
                      ;(popinFunction as { q: unknown[] }).q.push([
                        'loadRecommend',
                        '_popIn_recommend_word',
                      ])
                    }
                  } catch (error) {
                    console.error('popin initialization failed:', error)
                  }
                } else {
                  setTimeout(initPopIn, 1000)
                }
              }

              setTimeout(initPopIn, 2000)
            }}
          >
            <div id="_popIn_recommend_word" className="_popIn_recommend" />
          </LazyRenderWrapper>
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
