'use client'
import { useState } from 'react'
import styles from './_styles/latest-post-list-handler.module.scss'
import InfiniteScrollList from '@readr-media/react-infinite-scroll-list'
import { FormattedPostCard, formatArticleCard } from '~/utils'
import { HOMEPAGE_POSTS_PAGE_SIZE } from '~/constants/constant'
import UiPostCardHomepage from './ui-post-card-hompage'
import { getLatestPostsAndEditorChoices } from '~/app/_actions/homepage/latest-posts-and-editor-choices'

type LatestPostListHandlerProps = {
  initPosts: FormattedPostCard[]
  postsCount: number
  renderedSalesLength: number
  filteredSlug: string[]
  source: 'json' | 'graphql'
}

export default function LatestPostListHandler({
  initPosts,
  postsCount,
  renderedSalesLength,
  filteredSlug,
  source,
}: LatestPostListHandlerProps) {
  const [jsonPosts, setJsonPosts] = useState<FormattedPostCard[]>(initPosts)
  const fetchMorePosts = async (page: number) => {
    if (source === 'json') {
      const postsResponse = await getLatestPostsAndEditorChoices({
        first: HOMEPAGE_POSTS_PAGE_SIZE,
        skip: 0,
        withCount: false,
        filteredSlug: filteredSlug,
        jsonPage: page,
      })

      const additionalPosts =
        postsResponse?.data?.latest?.map((post) => formatArticleCard(post)) ||
        []

      if (additionalPosts.length > 0) {
        const existingSlugs = new Set(jsonPosts.map((post) => post.slug))
        const newPosts = additionalPosts.filter(
          (post) => !existingSlugs.has(post.slug)
        )
        setJsonPosts((prevPosts) => {
          return [...newPosts, ...prevPosts]
        })
        return newPosts
      }

      return []
    }

    const postsResponse = await getLatestPostsAndEditorChoices({
      first: HOMEPAGE_POSTS_PAGE_SIZE,
      skip: HOMEPAGE_POSTS_PAGE_SIZE * (page - 1) - renderedSalesLength,
      withCount: false,
      filteredSlug: filteredSlug,
      jsonPage: 0,
    })
    return (
      postsResponse?.data?.latest?.map((post) => formatArticleCard(post)) || []
    )
  }

  return (
    <InfiniteScrollList<FormattedPostCard>
      initialList={initPosts}
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
            <ol key={postItem.slug} className={`${styles.item} list-latest`}>
              <UiPostCardHomepage
                href={postItem.href}
                images={postItem.images}
                title={postItem.name}
                date={postItem.publishTime}
                postStyle={postItem.style}
                label={postItem.label}
                exclusive={postItem.exclusive ?? false}
              />
            </ol>
          ))}
        </ol>
      )}
    </InfiniteScrollList>
  )
}
