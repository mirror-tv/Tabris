'use client'
import { useState } from 'react'
import UiPostCard from '~/components/shared/ui-post-card'
import {
  fetchPostsItems,
  fetchExternalsByTagName,
} from '~/app/_actions/tag/posts-by-tag'
import { type PostCardItem } from '~/graphql/query/posts'
import styles from './_styles/posts-list-manager.module.scss'
import { type FormattedPostCard } from '~/utils'
import UiLoadMoreButton from '../shared/ui-load-more-button'
import { type External } from '~/graphql/query/externals'
import InfiniteScrollList from '@readr-media/react-infinite-scroll-list'
import { combineAndSortedByPublishedTime } from '~/utils/post-handler'

type TagPostsListManagerProps = {
  tagName: string
  pageSize: number
  postsCount: number
  initPostsList: PostCardItem[]
  initExternalsList: External[]
  externalsCount: number
}

export default function TagPostsListManager({
  tagName,
  pageSize,
  postsCount,
  initPostsList,
  initExternalsList,
  externalsCount,
}: TagPostsListManagerProps) {
  const initFetchList = combineAndSortedByPublishedTime([
    ...initPostsList,
    ...initExternalsList,
  ])
  const isExternal = (post: FormattedPostCard) => post.__typename === 'External'

  const [differentPostsCount, setDifferentPostsCount] = useState(() => {
    const renderedPosts = initFetchList
      .slice(0, pageSize)
      .filter((post) => !isExternal(post)).length
    const renderedExternals = initFetchList
      .slice(0, pageSize)
      .filter((post) => isExternal(post)).length

    return {
      rendered: {
        posts: renderedPosts,
        externals: renderedExternals,
      },
      fetched: {
        posts: initPostsList.length,
        externals: initExternalsList.length,
      },
    }
  })

  const handleClickLoadMore = async () => {
    // 直接從 state 取得最新的 differentPostsCount
    const { rendered, fetched } = differentPostsCount
    const isNeedFetchPost: boolean = fetched.posts - rendered.posts <= pageSize
    const isNeedFetchExternal: boolean =
      fetched.externals - rendered.externals <= pageSize

    let newPosts: PostCardItem[] = []
    let newExternals: External[] = []
    if (isNeedFetchPost) {
      const postRes = await fetchPostsItems({
        page: fetched.posts / pageSize,
        tagName,
        pageSize,
        isWithCount: false,
      })
      newPosts = postRes.allPosts ?? []
    }
    if (isNeedFetchExternal) {
      const externalRes = await fetchExternalsByTagName({
        page: fetched.externals / pageSize,
        tagName,
        pageSize,
        isWithCount: false,
      })
      newExternals = externalRes.allExternals ?? []
    }

    const newlyFetchedAndCombined = combineAndSortedByPublishedTime([
      ...newExternals,
      ...newPosts,
    ])

    setDifferentPostsCount((prevCounts) => ({
      rendered: {
        posts:
          prevCounts.rendered.posts +
          newlyFetchedAndCombined.filter((post) => !isExternal(post)).length,
        externals:
          prevCounts.rendered.externals +
          newlyFetchedAndCombined.filter(isExternal).length,
      },
      fetched: {
        posts: prevCounts.fetched.posts + newPosts.length,
        externals: prevCounts.fetched.externals + newExternals.length,
      },
    }))

    return newlyFetchedAndCombined
  }

  return (
    <>
      <section className={styles.list}>
        <InfiniteScrollList<FormattedPostCard>
          initialList={initFetchList.slice(0, pageSize)}
          pageSize={pageSize}
          isAutoFetch={false}
          amountOfElements={postsCount + externalsCount}
          fetchListInPage={handleClickLoadMore}
          loader={
            <div className={styles.btnWrapper}>
              <UiLoadMoreButton title="看更多" />
            </div>
          }
        >
          {(renderList) => (
            <ol className={styles.posts}>
              {renderList.map((postItem, index) => (
                <li
                  key={`${index}-${postItem.slug}`}
                  className="list-handler__item"
                >
                  <UiPostCard
                    href={postItem.href}
                    images={postItem.images}
                    imagesWebP={postItem.imagesWebP}
                    title={postItem.name}
                    date={postItem.publishTime}
                    postStyle={postItem.style}
                    mobileLayoutDirection="column"
                    exclusive={postItem.exclusive ?? false}
                    priority={index === 0}
                    slug={postItem.slug}
                  />
                </li>
              ))}
            </ol>
          )}
        </InfiniteScrollList>
      </section>
    </>
  )
}
