'use client'
import UiLoadMoreButton from '../shared/ui-load-more-button'
import { PostCardItem } from '~/graphql/query/posts'
import { useMemo, useState } from 'react'
import { fetchPostsItems } from '~/components/category/action'
import styles from './_styles/posts-list-manager.module.scss'
import UiPostCard from '~/components/shared/ui-post-card'
import { formatArticleCard, FormattedPostCard } from '~/utils'

type PostsListManagerProps = {
  categorySlug: string
  pageSize: number
  postsCount: number
  initPostsList: FormattedPostCard[]
  salePostsList: FormattedPostCard[]
}

export default function PostsListManager({
  categorySlug,
  pageSize,
  postsCount,
  initPostsList,
  salePostsList,
}: PostsListManagerProps) {
  const [page, setPage] = useState(1)
  const [postsList, setPostsList] = useState<FormattedPostCard[]>([
    ...initPostsList,
  ])
  const salesLength = salePostsList?.length || 0
  const salesPostsInsertIndex = [2, 4, 8, 10].slice(0, salesLength)
  const renderedPostsList: FormattedPostCard[] = useMemo(() => {
    if (!salesLength) {
      return postsList
    }
    const postsListAfterInserted = [...postsList]
    salesPostsInsertIndex.forEach((position, index) => {
      postsListAfterInserted.splice(position, 0, salePostsList[index])
    })
    return postsListAfterInserted
  }, [postsList])

  const formattedPostsList = (list: PostCardItem[]) =>
    list.map((post) => formatArticleCard(post))

  const handleClickLoadMore = async () => {
    const { allPosts: newPosts } = await fetchPostsItems({
      page,
      categorySlug,
      pageSize,
      isWithCount: false,
      salePostsCount: salesLength,
    })
    if (!newPosts) return
    setPage((page) => page + 1)
    setPostsList((oldPost) => [...oldPost, ...formattedPostsList(newPosts)])
  }

  return (
    <>
      <section className={styles.list}>
        <ol className={styles.posts}>
          {renderedPostsList?.map((postItem) => {
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
      </section>
      {postsCount - 1 > pageSize * page && (
        <div className={styles.btnWrapper}>
          <UiLoadMoreButton title="看更多" onClick={handleClickLoadMore} />
        </div>
      )}
    </>
  )
}
