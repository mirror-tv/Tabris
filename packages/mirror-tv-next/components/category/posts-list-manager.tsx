'use client'
import UiLoadMoreButton from '../shared/ui-load-more-button'
import { type PostCardItem } from '~/graphql/query/posts'
import {
  fetchExternalsByCategory,
  fetchPostsByCategory,
} from '~/app/_actions/category/posts-by-category'
import styles from './_styles/posts-list-manager.module.scss'
import UiPostCard from '~/components/shared/ui-post-card'
import { type FormattedPostCard } from '~/utils'
import InfiniteScrollList from '@readr-media/react-infinite-scroll-list'
import { useRef, useState } from 'react'
import { combineAndSortedByPublishedTime } from '~/utils/post-handler'
import { type External } from '~/graphql/query/externals'

type PostsListManagerProps = {
  categorySlug: string
  pageSize: number
  postsCount: number
  filteredSlug: string[]
  externalsCount: number
  salePosts: FormattedPostCard[]
  hasFeaturePostInJson: boolean
  externals: FormattedPostCard[]
  categoryPosts: FormattedPostCard[]
}

export default function PostsListManager({
  categorySlug,
  pageSize,
  postsCount,
  filteredSlug = [],
  externalsCount,
  salePosts,
  hasFeaturePostInJson,
  externals,
  categoryPosts,
}: PostsListManagerProps) {
  const isExternal = (post: FormattedPostCard) => post.__typename === 'External'
  const initPostsList = combineAndSortedByPublishedTime([
    ...categoryPosts,
    ...externals,
  ])
  const [postsList, setPostsList] = useState<FormattedPostCard[]>(initPostsList)
  const salesCount = salePosts.length ?? 0

  const postsListWithSales = [...postsList]
  const salesPostsInsertIndex = [2, 4, 8, 10].slice(0, salesCount)
  if (salesCount) {
    salesPostsInsertIndex.forEach((position, index) => {
      postsListWithSales.splice(position, 0, salePosts[index])
    })
  }

  const differentPostsCount = useRef({
    rendered: {
      posts:
        initPostsList.slice(0, pageSize).filter((post) => !isExternal(post))
          .length - salesCount,
      externals: initPostsList.slice(0, pageSize).filter(isExternal).length,
    },
    fetched: {
      posts: pageSize,
      externals: pageSize,
    },
  })

  const handleFetchLoadMore = async (page: number) => {
    const { rendered, fetched } = differentPostsCount.current
    const isNeedFetchPost: boolean =
      fetched.posts - rendered.posts <= pageSize && postsCount > fetched.posts
    const isNeedFetchExternal: boolean =
      fetched.externals - rendered.externals <= pageSize &&
      externalsCount > fetched.externals

    let newPosts: PostCardItem[] = []
    let newExternals: External[] = []
    if (isNeedFetchPost) {
      const postRes = await fetchPostsByCategory({
        skip: fetched.posts,
        categorySlug,
        pageSize,
        isWithCount: false,
        filteredSlug,
      })
      newPosts = postRes.allPosts ?? []
    }
    if (isNeedFetchExternal) {
      const externalRes = await fetchExternalsByCategory({
        skip: fetched.externals,
        categorySlug,
        pageSize,
        isWithCount: false,
        filteredSlug,
      })
      newExternals = externalRes.allExternals ?? []
    }

    const newPostList = combineAndSortedByPublishedTime([
      ...postsList,
      ...newExternals,
      ...newPosts,
    ])
    const newListSlice = newPostList.slice(
      (page - 1) * pageSize - salesCount,
      page * pageSize - salesCount
    )

    differentPostsCount.current = {
      rendered: {
        posts:
          rendered.posts +
          newListSlice.filter((post) => !isExternal(post)).length,
        externals: rendered.externals + newListSlice.filter(isExternal).length,
      },
      fetched: {
        posts: fetched.posts + newPosts.length,
        externals: fetched.externals + newExternals.length,
      },
    }
    setPostsList(newPostList)
    return newListSlice
  }

  return (
    <>
      <section className={styles.list}>
        <InfiniteScrollList
          initialList={postsListWithSales.slice(0, pageSize)}
          pageSize={pageSize}
          amountOfElements={
            postsCount +
            externalsCount +
            salesCount -
            (hasFeaturePostInJson ? 0 : 1)
          }
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
