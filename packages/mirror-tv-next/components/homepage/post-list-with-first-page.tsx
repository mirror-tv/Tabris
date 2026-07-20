'use client'
import { useState } from 'react'
import styles from './_styles/post-list-with-first-page.module.scss'
import InfiniteScrollList from '@readr-media/react-infinite-scroll-list'
import { HOMEPAGE_POSTS_PAGE_SIZE } from '~/constants/constant'
import UiPostCardHomepage from './ui-post-card-hompage'
import { getLatestPostsAndEditorChoices } from '~/app/_actions/homepage/latest-posts-and-editor-choices'
import { PostWithCategory } from '~/graphql/query/posts'

type PostListWithFirstPageProps = {
  initPosts: PostWithCategory[]
  postsCount: number
  renderedSalesLength: number
  filteredSlug: string[]
  source: 'json' | 'graphql'
}

export default function PostListWithFirstPage({
  initPosts,
  postsCount,
  renderedSalesLength,
  filteredSlug,
  source,
}: PostListWithFirstPageProps) {
  const [jsonPosts, setJsonPosts] = useState(initPosts)
  const [hasShowSecondPage, setHasShowSecondPage] = useState(false)
  const fetchMorePosts = async (page: number) => {
    const withTimeout = <T,>(p: Promise<T>, label: string): Promise<T> => {
      let timer: ReturnType<typeof setTimeout> | undefined
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`[homepage latest] timeout at ${label}`))
        }, 5000)
      })
      return Promise.race([p, timeout]).finally(() => {
        if (timer) clearTimeout(timer)
      }) as Promise<T>
    }

    try {
      if (source === 'json') {
        const postsResponse = await withTimeout(
          getLatestPostsAndEditorChoices({
            first: HOMEPAGE_POSTS_PAGE_SIZE,
            skip: 0,
            withCount: false,
            filteredSlug: filteredSlug,
            jsonPage: page,
          }),
          'json-branch'
        )

        const additionalPosts = postsResponse?.data?.latest || []

        if (additionalPosts.length > 0) {
          const existingSlugs = new Set(jsonPosts.map((post) => post.slug))
          const newPosts = additionalPosts.filter(
            (post) => !existingSlugs.has(post.slug)
          )
          setJsonPosts((prevPosts) => {
            return [...prevPosts, ...newPosts]
          })
          return newPosts
        }

        return []
      }

      const postsResponse = await withTimeout(
        getLatestPostsAndEditorChoices({
          first: HOMEPAGE_POSTS_PAGE_SIZE,
          skip: HOMEPAGE_POSTS_PAGE_SIZE * (page - 1) - renderedSalesLength,
          withCount: false,
          filteredSlug: filteredSlug,
          jsonPage: 0,
        }),
        'graphql-branch'
      )

      return postsResponse?.data?.latest || []
    } catch (err) {
      return []
    }
  }

  return (
    <>
      <ol className={styles.firstList}>
        {initPosts.slice(0, HOMEPAGE_POSTS_PAGE_SIZE).map((postItem) => (
          <li key={postItem.slug} className={`${styles.item} list-latest`}>
            <UiPostCardHomepage {...postItem} />
          </li>
        ))}
      </ol>
      {!hasShowSecondPage && (
        <div className={styles.loadMoreWrapper}>
          <button
            onClick={() => setHasShowSecondPage(true)}
            className={`${styles.load} load-more g-button-load-more button-load-more`}
          >
            看更多
          </button>
        </div>
      )}
      {hasShowSecondPage && (
        <InfiniteScrollList<PostWithCategory>
          initialList={initPosts.slice(HOMEPAGE_POSTS_PAGE_SIZE)}
          pageSize={HOMEPAGE_POSTS_PAGE_SIZE}
          amountOfElements={postsCount}
          fetchListInPage={fetchMorePosts}
          isAutoFetch={false}
          loader={
            <button
              className={`${styles.load} load-more g-button-load-more button-load-more`}
            >
              看更多
            </button>
          }
        >
          {(renderList) => (
            <ol className={styles.list}>
              {renderList.map((postItem) => (
                <li
                  key={postItem.slug}
                  className={`${styles.item} list-latest`}
                >
                  <UiPostCardHomepage {...postItem} />
                </li>
              ))}
            </ol>
          )}
        </InfiniteScrollList>
      )}
    </>
  )
}
