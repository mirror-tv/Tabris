'use client'
import UiLoadMoreButton from '../shared/ui-load-more-button'
import { type PostCardItem } from '~/graphql/query/posts'
import { fetchPostsItems } from '~/app/_actions/category'
import styles from './_styles/posts-list-manager.module.scss'
import UiPostCard from '~/components/shared/ui-post-card'
import { formatArticleCard, FormattedPostCard } from '~/utils'
import InfiniteScrollList from '@readr-media/react-infinite-scroll-list'

type PostsListManagerProps = {
  categorySlug: string
  pageSize: number
  postsCount: number
  initPostsList: FormattedPostCard[]
  filteredSlug: string[]
}

export default function PostsListManager({
  categorySlug,
  pageSize,
  postsCount,
  initPostsList,
  filteredSlug = [],
}: PostsListManagerProps) {
  const formattedPostsList = (list: PostCardItem[]) =>
    list.map((post) => formatArticleCard(post))

  const handleFetchLoadMore = async (page: number) => {
    const { allPosts: newPosts } = await fetchPostsItems({
      page: page - 1,
      categorySlug,
      pageSize,
      isWithCount: false,
      filteredSlug,
    })
    return formattedPostsList(newPosts)
  }

  return (
    <>
      <section className={styles.list}>
        <InfiniteScrollList
          initialList={initPostsList}
          pageSize={pageSize}
          amountOfElements={postsCount + 1}
          fetchListInPage={handleFetchLoadMore}
          isAutoFetch={false}
          loader={<UiLoadMoreButton title="看更多" className={styles.more} />}
        >
          {(renderList) => (
            <ol className={styles.posts}>
              {renderList.map((postItem) => {
                return (
                  <li key={postItem.slug}>
                    <UiPostCard
                      href={postItem.href}
                      images={postItem.images}
                      title={postItem.name}
                      date={postItem.publishTime}
                      postStyle={postItem.style}
                      label={postItem.label ?? ''}
                      mobileLayoutDirection="row"
                    />
                  </li>
                )
              })}
            </ol>
          )}
        </InfiniteScrollList>
      </section>
    </>
  )
}
