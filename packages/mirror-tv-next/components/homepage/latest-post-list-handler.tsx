'use client'
import styles from './_styles/latest-post-list-handler.module.scss'
import InfiniteScrollList from '@readr-media/react-infinite-scroll-list'
import { FormattedPostCard, formatArticleCard } from '~/utils'
import { HOMEPAGE_POSTS_PAGE_SIZE } from '~/constants/constant'
import { getLatestPostsServerAction } from '~/app/_actions/homepage/latest-posts'
import UiPostCardHomepage from './ui-post-card-hompage'

type LatestPostListHandlerProps = {
  initPosts: FormattedPostCard[]
  postsCount: number
  renderedSalesLength: number
  filteredSlug: string[]
}

export default function LatestPostListHandler({
  initPosts,
  postsCount,
  renderedSalesLength,
  filteredSlug,
}: LatestPostListHandlerProps) {
  const fetchMorePosts = async (page: number) => {
    const postsResponse = await getLatestPostsServerAction({
      first: HOMEPAGE_POSTS_PAGE_SIZE,
      skip: HOMEPAGE_POSTS_PAGE_SIZE * (page - 1) - renderedSalesLength,
      withCount: false,
      filteredSlug: filteredSlug,
    })
    return postsResponse?.data?.allPosts?.map((post) => formatArticleCard(post))
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
              />
            </ol>
          ))}
        </ol>
      )}
    </InfiniteScrollList>
  )
}
